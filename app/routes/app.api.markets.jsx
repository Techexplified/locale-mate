/**
 * Resource route for Market CRUD operations
 * No default export — this is an API-only route
 *
 * POST   — Create a new market
 * PUT    — Update an existing market
 * DELETE — Remove a market by ID
 */
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

/**
 * Builds a JSON Response with proper headers
 * @param {object} body - Response body
 * @param {number} status - HTTP status code
 * @returns {Response}
 */
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Action handler for market API requests
 * @param {object} params - Route params
 * @param {Request} params.request - The incoming request
 * @returns {Promise<Response>} JSON response
 */
export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const method = request.method.toUpperCase();

  try {
    switch (method) {
      case "POST": {
        const body = await request.json();
        const { country, countryCode, region, flag, currency, language } = body;

        if (!country || !countryCode) {
          return jsonResponse(
            { success: false, error: "country and countryCode are required" },
            400
          );
        }

        const market = await prisma.market.create({
          data: {
            country,
            countryCode,
            region: region || "Other",
            flag: flag || "🌐",
            currency: currency || "USD",
            language: language || "en",
            shop,
          },
        });

        return jsonResponse({ success: true, market });
      }

      case "PUT": {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
          return jsonResponse(
            { success: false, error: "id is required for update" },
            400
          );
        }

        // Verify the market belongs to this shop
        const existing = await prisma.market.findFirst({
          where: { id, shop },
        });

        if (!existing) {
          return jsonResponse(
            { success: false, error: "Market not found" },
            404
          );
        }

        const market = await prisma.market.update({
          where: { id },
          data: updateData,
        });

        return jsonResponse({ success: true, market });
      }

      case "DELETE": {
        const body = await request.json();
        const { id } = body;

        if (!id) {
          return jsonResponse(
            { success: false, error: "id is required for deletion" },
            400
          );
        }

        // Verify the market belongs to this shop
        const existing = await prisma.market.findFirst({
          where: { id, shop },
        });

        if (!existing) {
          return jsonResponse(
            { success: false, error: "Market not found" },
            404
          );
        }

        await prisma.market.delete({
          where: { id },
        });

        return jsonResponse({ success: true, deletedId: id });
      }

      default:
        return jsonResponse(
          { success: false, error: `Method ${method} not allowed` },
          405
        );
    }
  } catch (error) {
    console.error("[app.api.markets] Action error:", error);

    // Handle unique constraint violations
    if (error.code === "P2002") {
      return jsonResponse(
        { success: false, error: "A market with this country already exists for your shop" },
        409
      );
    }

    return jsonResponse(
      { success: false, error: "Internal server error" },
      500
    );
  }
}
