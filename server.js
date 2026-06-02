import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import campaignRoutes from "./routes/campaignRoutes.js";
import suggestionRoutes from "./routes/suggestionRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/campaigns", campaignRoutes);
app.use("/api/suggestions", suggestionRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 LocaleMate backend running on http://localhost:${PORT}`);
});
