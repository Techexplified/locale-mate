import "dotenv/config";
import shopify from "../app/shopify.server.js";

async function main() {
  const shop = "testing-ofdju06g.myshopify.com";
  console.log("Querying for shop:", shop);
  
  try {
    const { admin } = await shopify.unauthenticated.admin(shop);
    
    // Query locales
    const localesResponse = await admin.graphql(
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
    const localesData = await localesResponse.json();
    console.log("Shop Locales:");
    console.log(JSON.stringify(localesData?.data?.shopLocales, null, 2));

    // Query markets
    const marketsResponse = await admin.graphql(
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
          }
        }
      }`
    );
    const marketsData = await marketsResponse.json();
    console.log("\nMarkets:");
    console.log(JSON.stringify(marketsData?.data?.markets?.nodes, null, 2));
    
  } catch (error) {
    console.error("Error querying Shopify:", error);
  }
}

main();
