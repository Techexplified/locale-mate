import express from "express";
import {
  getSuggestions,
  generateAndSaveSuggestion,
  applySuggestion,
  reviewSuggestion,
  regenerateSuggestion,
  applyAllSuggestions,
  deleteSuggestion,
  getAppliedSuggestions,
} from "../controllers/suggestionController.js";

const router = express.Router();

// GET /api/suggestions/applied — fetch all applied suggestions
router.get("/applied", getAppliedSuggestions);

// GET /api/suggestions — fetch all suggestions
router.get("/", getSuggestions);

// POST /api/suggestions/generate — generate AI suggestion and save
router.post("/generate", generateAndSaveSuggestion);

// POST /api/suggestions/apply-all — apply all pending suggestions
router.post("/apply-all", applyAllSuggestions);

// POST /api/suggestions/apply/:id — mark one suggestion as applied
router.post("/apply/:id", applySuggestion);

// PATCH /api/suggestions/review/:id — mark as under_review
router.patch("/review/:id", reviewSuggestion);

// POST /api/suggestions/regenerate/:id — regenerate AI suggestion
router.post("/regenerate/:id", regenerateSuggestion);

// DELETE /api/suggestions/:id — delete suggestion
router.delete("/:id", deleteSuggestion);

export default router;
