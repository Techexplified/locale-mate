/**
 * Shopify GraphQL API service layer
 * All functions accept an `admin` object from authenticate.admin()
 * and return parsed data arrays. Errors are caught and logged,
 * returning empty arrays on failure.
 */

/**
 * Fetches all Shopify markets with locale and currency settings
 * @param {object} admin - Authenticated admin GraphQL client
 * @returns {Promise<Array>} Array of market nodes
 */
export async function fetchShopifyMarkets(admin) {
  try {
    const response = await admin.graphql(
      `#graphql
      query {
        markets(first: 20) {
          nodes {
            id
            name
            enabled
            primary
            webPresence {
              defaultLocale {
                locale
                name
              }
              alternateLocales {
                locale
                name
                published
              }
            }
            currencySettings {
              baseCurrency {
                currencyCode
                currencyName
              }
            }
          }
        }
      }`
    );

    const data = await response.json();
    return data?.data?.markets?.nodes ?? [];
  } catch (error) {
    console.error("[shopifyApi] fetchShopifyMarkets error:", error);
    return [];
  }
}

/**
 * Fetches all shop locales (languages) configured in the store
 * @param {object} admin - Authenticated admin GraphQL client
 * @returns {Promise<Array>} Array of locale objects
 */
export async function fetchShopLocales(admin) {
  try {
    const response = await admin.graphql(
      `#graphql
      query {
        shopLocales {
          locale
          name
          primary
          published
        }
      }`
    );

    const data = await response.json();
    return data?.data?.shopLocales ?? [];
  } catch (error) {
    console.error("[shopifyApi] fetchShopLocales error:", error);
    return [];
  }
}

/**
 * Fetches translatable product resources from the store
 * @param {object} admin - Authenticated admin GraphQL client
 * @param {number} first - Number of resources to fetch (default: 25)
 * @returns {Promise<Array>} Array of translatable resource nodes
 */
export async function fetchTranslatableProducts(admin, first = 25) {
  try {
    const response = await admin.graphql(
      `#graphql
      query TranslatableProducts($first: Int!) {
        translatableResources(first: $first, resourceType: PRODUCT) {
          edges {
            node {
              resourceId
              translatableContent {
                key
                value
                digest
                locale
              }
            }
          }
        }
      }`,
      { variables: { first } }
    );

    const data = await response.json();
    const edges = data?.data?.translatableResources?.edges ?? [];
    return edges.map((edge) => edge.node);
  } catch (error) {
    console.error("[shopifyApi] fetchTranslatableProducts error:", error);
    return [];
  }
}

/**
 * Fetches translations for a specific product resource in a given locale
 * @param {object} admin - Authenticated admin GraphQL client
 * @param {string} resourceId - The Shopify resource GID
 * @param {string} locale - The target locale code (e.g. "de", "ja")
 * @returns {Promise<Array>} Array of translation objects
 */
export async function fetchProductTranslations(admin, resourceId, locale) {
  try {
    const response = await admin.graphql(
      `#graphql
      query ProductTranslations($resourceId: ID!, $locale: String!) {
        translatableResource(resourceId: $resourceId) {
          resourceId
          translations(locale: $locale) {
            key
            value
            locale
            outdated
          }
        }
      }`,
      { variables: { resourceId, locale } }
    );

    const data = await response.json();
    return data?.data?.translatableResource?.translations ?? [];
  } catch (error) {
    console.error("[shopifyApi] fetchProductTranslations error:", error);
    return [];
  }
}

/**
 * Fetches recent orders with billing address country and price data
 * @param {object} admin - Authenticated admin GraphQL client
 * @param {number} first - Number of orders to fetch (default: 50)
 * @returns {Promise<Array>} Array of order nodes
 */
export async function fetchRecentOrders(admin, first = 50) {
  try {
    const response = await admin.graphql(
      `#graphql
      query RecentOrders($first: Int!) {
        orders(first: $first, sortKey: CREATED_AT, reverse: true) {
          nodes {
            id
            name
            createdAt
            billingAddress {
              countryCode
            }
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }`,
      { variables: { first } }
    );

    const data = await response.json();
    return data?.data?.orders?.nodes ?? [];
  } catch (error) {
    console.error("[shopifyApi] fetchRecentOrders error:", error);
    return [];
  }
}

/**
 * Fetches aggregated sales data grouped by billing country using ShopifyQL
 * @param {object} admin - Authenticated admin GraphQL client
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Promise<Array>} Array of sales-by-country rows
 */
export async function fetchSalesByCountry(admin, days = 30) {
  try {
    const response = await admin.graphql(
      `#graphql
      query SalesByCountry($query: String!) {
        shopifyqlQuery(query: $query) {
          __typename
          ... on TableResponse {
            tableData {
              rowData
              columns {
                name
                dataType
              }
            }
          }
          ... on PolarisVizResponse {
            data {
              key
              data {
                key
                value
              }
            }
          }
        }
      }`,
      {
        variables: {
          query: `FROM sales SHOW total_sales BY billing_country SINCE -${days}d ORDER BY total_sales DESC`,
        },
      }
    );

    const data = await response.json();

    // Handle TableResponse format
    const tableData = data?.data?.shopifyqlQuery?.tableData;
    if (tableData?.rowData) {
      return tableData.rowData.map((row) => {
        const result = {};
        tableData.columns.forEach((col, index) => {
          result[col.name] = row[index];
        });
        return result;
      });
    }

    // Handle PolarisVizResponse format
    const vizData = data?.data?.shopifyqlQuery?.data;
    if (vizData) {
      return vizData;
    }

    return [];
  } catch (error) {
    console.error("[shopifyApi] fetchSalesByCountry error:", error);
    return [];
  }
}

/**
 * Fetches the shop's enabled currencies and presentment currencies
 * @param {object} admin - Authenticated admin GraphQL client
 * @returns {Promise<object>} Object with currencies array and enabledPresentmentCurrencies
 */
export async function fetchShopCurrencies(admin) {
  try {
    const response = await admin.graphql(
      `#graphql
      query {
        shop {
          currencySettings(first: 50) {
            nodes {
              currencyCode
              currencyName
              enabled
            }
          }
          enabledPresentmentCurrencies
        }
      }`
    );

    const data = await response.json();
    const shop = data?.data?.shop;
    return {
      currencies: shop?.currencySettings?.nodes ?? [],
      enabledPresentmentCurrencies: shop?.enabledPresentmentCurrencies ?? [],
    };
  } catch (error) {
    console.error("[shopifyApi] fetchShopCurrencies error:", error);
    return { currencies: [], enabledPresentmentCurrencies: [] };
  }
}
