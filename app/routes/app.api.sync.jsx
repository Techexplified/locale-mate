/**
 * Resource route for syncing Shopify data into Market records
 * No default export — this is an API-only route
 *
 * POST — Trigger a full sync of orders, translations, and scores
 */

import { authenticate } from "../shopify.server";
import prisma from "../db.server";

import {
  fetchRecentOrders,
  fetchShopifyMarkets,
  fetchTranslatableProducts,
} from "../services/shopifyApi.server";

import {
  calculateConversionRate,
  calculateLocalizationScore,
} from "../services/scoring";

/**
 * Builds a JSON Response with proper headers
 */
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Groups Shopify orders by country
 */
function groupOrdersByCountry(orders) {
  const grouped = {};

  for (const order of orders) {
    const countryCode = order.billingAddress?.countryCode;

    if (!countryCode) continue;

    if (!grouped[countryCode]) {
      grouped[countryCode] = {
        count: 0,
        revenue: 0,
      };
    }

    grouped[countryCode].count += 1;

    const amount = parseFloat(
      order.totalPriceSet?.shopMoney?.amount || "0"
    );

    grouped[countryCode].revenue += amount;
  }

  return grouped;
}

/**
 * Sync Action
 */
export async function action({ request }) {
  if (request.method.toUpperCase() !== "POST") {
    return jsonResponse(
      {
        success: false,
        error: "Only POST method is allowed",
      },
      405
    );
  }

  try {
    const formData = await request.formData();

    const days = Number(formData.get("days")) || 30;

    console.log("Syncing analytics for:", days, "days");

    const { admin, session } =
      await authenticate.admin(request);

    const shop = session.shop;

    /**
     * Fetch Shopify data
     */
    const [
      orders,
      shopifyMarkets,
      translatableProducts,
    ] = await Promise.all([
      fetchRecentOrders(admin, days),

      fetchShopifyMarkets(admin),

      fetchTranslatableProducts(admin, 100),
    ]);

    const totalProducts =
      translatableProducts.length || 1;

    /**
     * Group orders
     */
    const ordersByCountry =
      groupOrdersByCountry(orders);

    /**
     * Fetch markets
     */
    const markets = await prisma.market.findMany({
      where: {
        shop,
      },

      include: {
        translations: true,

        campaigns: {
          where: {
            status: "active",
          },
        },
      },
    });

    /**
     * Enabled locales/currencies
     */
    const enabledLocales = new Set();

    const enabledCurrencies = new Set();

    for (const market of shopifyMarkets) {
      if (market.webPresence?.defaultLocale?.locale) {
        enabledLocales.add(
          market.webPresence.defaultLocale.locale
        );
      }

      if (market.webPresence?.alternateLocales) {
        for (const alt of market.webPresence
          .alternateLocales) {
          if (alt.published) {
            enabledLocales.add(alt.locale);
          }
        }
      }

      if (
        market.currencySettings?.baseCurrency
          ?.currencyCode
      ) {
        enabledCurrencies.add(
          market.currencySettings.baseCurrency
            .currencyCode
        );
      }
    }

    /**
     * Update all markets dynamically
     */
    const updatedMarkets = [];

    for (const market of markets) {
      const countryData =
        ordersByCountry[market.countryCode] || {
          count: 0,
          revenue: 0,
        };

      /**
       * Translation count
       */
      const translationCount =
        market.translations.length;

      /**
       * Dynamic scaling based on selected days
       */

      const baseOrders =
        countryData.count || market.orders || 1;

      const scaledOrders = Math.max(
        1,
        Math.floor(baseOrders * (days / 30))
      );

      const scaledVisitors = Math.max(
        1,
        Math.floor(
          (market.visitors || 1) * (days / 30)
        )
      );

      const scaledRevenue =
        countryData.revenue > 0
          ? Math.floor(
              countryData.revenue * (days / 30)
            )
          : Math.floor(
              (market.revenue || 0) * (days / 30)
            );

      /**
       * Conversion rate
       */
      const conversionRate =
        calculateConversionRate(
          scaledOrders,
          scaledVisitors
        );

      /**
       * Localization score
       */
      const localizationScore =
        calculateLocalizationScore({
          translatedItems:
            translationCount ||
            market.translatedItems,

          totalProducts,

          hasCurrency:
            enabledCurrencies.has(
              market.currency
            ),

          hasLanguage:
            enabledLocales.has(
              market.language
            ),

          activeCampaigns:
            market.campaigns.length,

          conversionRate,
        });

      /**
       * Trend
       */
      const previousOrders =
        market.orders || 1;

      const trend =
        previousOrders > 0
          ? Math.round(
              ((scaledOrders - previousOrders) /
                previousOrders) *
                100 *
                10
            ) / 10
          : 0;

      /**
       * Update DB
       */
      const updated =
        await prisma.market.update({
          where: {
            id: market.id,
          },

          data: {
            visitors: scaledVisitors,

            orders: scaledOrders,

            revenue: scaledRevenue,

            conversionRate,

            localizationScore,

            translatedItems:
              translationCount ||
              market.translatedItems,

            trend,
          },
        });

      updatedMarkets.push(updated);
    }

    /**
     * Success response
     */
    return jsonResponse({
      success: true,

      synced: updatedMarkets.length,

      days,

      markets: updatedMarkets,

      meta: {
        totalOrders: orders.length,

        totalProducts,

        countriesWithOrders:
          Object.keys(ordersByCountry).length,

        enabledLocales:
          Array.from(enabledLocales),

        enabledCurrencies:
          Array.from(enabledCurrencies),
      },
    });
  } catch (error) {
    console.error(
      "[app.api.sync] Action error:",
      error
    );

    return jsonResponse(
      {
        success: false,
        error: "Sync failed: " + error.message,
      },
      500
    );
  }
}