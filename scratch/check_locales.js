import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function main() {
  try {
    const session = await prisma.session.findFirst({
      where: {
        shop: 'testing-ofdju06g.myshopify.com'
      }
    });

    if (!session) {
      console.log('No session found for testing-ofdju06g.myshopify.com');
      // Let's print any session we find
      const allSessions = await prisma.session.findMany();
      console.log('Available sessions:', allSessions.map(s => s.shop));
      return;
    }

    console.log('Found session for:', session.shop);
    
    // Fetch shop locales via GraphQL
    const graphqlUrl = `https://${session.shop}/admin/api/2024-10/graphql.json`;
    const query = `
      query {
        shopLocales {
          locale
          name
          primary
          published
        }
      }
    `;
    console.log('Sending GraphQL query to Shopify...');
    const response = await axios.post(graphqlUrl, { query }, {
      headers: {
        'X-Shopify-Access-Token': session.accessToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('GraphQL Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response details:', error.response.data);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
