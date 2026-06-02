import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";

const prisma = new PrismaClient();

async function main() {
  const shop = "testing-ofdju06g.myshopify.com";
  console.log("Querying direct API for shop:", shop);
  
  try {
    const session = await prisma.session.findFirst({
      where: { shop }
    });
    
    if (!session || !session.accessToken) {
      console.error("No access token found for shop", shop);
      return;
    }
    
    const accessToken = session.accessToken;
    const url = `https://${shop}/admin/api/2025-01/graphql.json`;
    
    // 1. Query locales
    const localesQuery = {
      query: `query {
        shopLocales {
          locale
          name
          primary
          published
        }
      }`
    };
    
    let res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken
      },
      body: JSON.stringify(localesQuery)
    });
    let data = await res.json();
    console.log("Shop Locales:");
    console.log(JSON.stringify(data?.data?.shopLocales, null, 2));

    // 2. Query markets
    const marketsQuery = {
      query: `query {
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
    };
    
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken
      },
      body: JSON.stringify(marketsQuery)
    });
    data = await res.json();
    console.log("\nMarkets:");
    console.log(JSON.stringify(data?.data?.markets?.nodes, null, 2));
    
  } catch (error) {
    console.error("Error querying Shopify:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
