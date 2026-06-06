import { createRequestListener } from "@react-router/node";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildPath = path.join(__dirname, "../build/server/index.js");

let requestListener;

async function getListener() {
  if (!requestListener) {
    try {
      const { createRequestHandler } = await import("react-router");
      const build = await import(buildPath);
      const handler = createRequestHandler(build, process.env.NODE_ENV || "production");
      requestListener = createRequestListener(handler);
      console.log("[LocaleMate] Server build loaded successfully");
    } catch (err) {
      console.error("[LocaleMate] Failed to load server build:", err);
      throw err;
    }
  }
  return requestListener;
}

export default async function handler(req, res) {
  try {
    const listen = await getListener();
    await listen(req, res);
  } catch (error) {
    console.error("[LocaleMate] Handler error:", error.message);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end("Internal Server Error: " + error.message);
  }
}
