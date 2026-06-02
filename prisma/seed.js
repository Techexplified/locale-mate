/**
 * Prisma seed script for LocaleMate
 * Seeds 4 default markets and 30 days of analytics data per market.
 *
 * Run with: npx prisma db seed
 * Or:       node prisma/seed.js
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Default market seed data matching the current UI */
const markets = [
  {
    country: "India",
    countryCode: "IN",
    region: "South Asia",
    flag: "🇮🇳",
    currency: "INR",
    language: "hi",
    visitors: 194500,
    orders: 5976,
    revenue: 234500,
    conversionRate: 4.8,
    localizationScore: 88,
    translatedItems: 847,
    trend: 0.6,
    isActive: true,
    shop: "dev-store",
  },
  {
    country: "USA",
    countryCode: "US",
    region: "North America",
    flag: "🇺🇸",
    currency: "USD",
    language: "en",
    visitors: 210340,
    orders: 11779,
    revenue: 567800,
    conversionRate: 5.6,
    localizationScore: 91,
    translatedItems: 1024,
    trend: 1.1,
    isActive: true,
    shop: "dev-store",
  },
  {
    country: "Germany",
    countryCode: "DE",
    region: "Europe",
    flag: "🇩🇪",
    currency: "EUR",
    language: "de",
    visitors: 89210,
    orders: 2855,
    revenue: 156300,
    conversionRate: 3.2,
    localizationScore: 76,
    translatedItems: 523,
    trend: 0.3,
    isActive: true,
    shop: "dev-store",
  },
  {
    country: "Japan",
    countryCode: "JP",
    region: "East Asia",
    flag: "🇯🇵",
    currency: "JPY",
    language: "ja",
    visitors: 67890,
    orders: 2784,
    revenue: 189400,
    conversionRate: 4.1,
    localizationScore: 82,
    translatedItems: 453,
    trend: 0.4,
    isActive: true,
    shop: "dev-store",
  },
];

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random float between min and max, rounded to 2 decimals
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
function randomFloat(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

/**
 * Analytics range configuration per market for realistic daily data
 */
const analyticsRanges = {
  India: { visitorsMin: 3500, visitorsMax: 5000, ordersMin: 150, ordersMax: 250, revenueMin: 6000, revenueMax: 10000 },
  USA: { visitorsMin: 6000, visitorsMax: 8500, ordersMin: 300, ordersMax: 500, revenueMin: 15000, revenueMax: 25000 },
  Germany: { visitorsMin: 2500, visitorsMax: 3500, ordersMin: 70, ordersMax: 120, revenueMin: 4000, revenueMax: 7000 },
  Japan: { visitorsMin: 1800, visitorsMax: 2800, ordersMin: 70, ordersMax: 120, revenueMin: 5000, revenueMax: 8000 },
};

/**
 * Main seed function
 */
async function main() {
  console.log("🌍 Seeding LocaleMate markets...");

  // Upsert each market
  for (const marketData of markets) {
    const { country, countryCode, shop, ...rest } = marketData;

    const market = await prisma.market.upsert({
      where: {
        shop_countryCode: { shop, countryCode },
      },
      update: { ...rest, country },
      create: { country, countryCode, shop, ...rest },
    });

    console.log(`  ✅ Market upserted: ${market.flag} ${market.country} (${market.id})`);

    // Generate 30 days of analytics for this market
    const ranges = analyticsRanges[country] || {
      visitorsMin: 1000,
      visitorsMax: 3000,
      ordersMin: 50,
      ordersMax: 150,
      revenueMin: 2000,
      revenueMax: 5000,
    };

    const now = new Date();
    const analyticsPromises = [];

    for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
      const date = new Date(now);
      date.setDate(date.getDate() - dayOffset);
      // Normalize to start of day (UTC)
      date.setUTCHours(0, 0, 0, 0);

      const dailyVisitors = randomInt(ranges.visitorsMin, ranges.visitorsMax);
      const dailyOrders = randomInt(ranges.ordersMin, ranges.ordersMax);
      const dailyRevenue = randomFloat(ranges.revenueMin, ranges.revenueMax);
      const dailyConversionRate = dailyVisitors > 0
        ? Math.round((dailyOrders / dailyVisitors) * 100 * 10) / 10
        : 0;

      analyticsPromises.push(
        prisma.analytics.upsert({
          where: {
            marketId_date: {
              marketId: market.id,
              date,
            },
          },
          update: {
            visitors: dailyVisitors,
            orders: dailyOrders,
            revenue: dailyRevenue,
            conversionRate: dailyConversionRate,
          },
          create: {
            marketId: market.id,
            visitors: dailyVisitors,
            orders: dailyOrders,
            revenue: dailyRevenue,
            conversionRate: dailyConversionRate,
            date,
          },
        })
      );
    }

    await Promise.all(analyticsPromises);
    console.log(`  📊 30 days of analytics seeded for ${market.country}`);
  }

  console.log("\n🎉 Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
