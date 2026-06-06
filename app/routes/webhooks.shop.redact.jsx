import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received mandatory compliance webhook ${topic} for ${shop}`);

  // Mandatory compliance webhook: shop/redact
  // Respond with 200 OK to Shopify
  return new Response();
};
