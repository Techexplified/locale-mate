import prisma from "../lib/prisma.js";
import { generateSuggestion } from "../services/openrouterSuggestionService.js";

// Market metadata — flags and colors per market name
const MARKET_META = {
  India:   { flag: "🇮🇳", tone: "bg-orange-50", color: "bg-teal-600" },
  USA:     { flag: "🇺🇸", tone: "bg-blue-50",   color: "bg-blue-600" },
  Germany: { flag: "🇩🇪", tone: "bg-amber-50",  color: "bg-amber-500" },
  Japan:   { flag: "🇯🇵", tone: "bg-rose-50",   color: "bg-rose-500" },
  MENA:    { flag: "🌙",  tone: "bg-green-50",  color: "bg-teal-600" },
};

function getMeta(market) {
  return MARKET_META[market] || { flag: "🌐", tone: "bg-gray-100", color: "bg-teal-600" };
}

// GET /api/suggestions
export async function getSuggestions(req, res) {
  try {
    const suggestions = await prisma.suggestion.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ success: true, suggestions });
  } catch (error) {
    console.error("getSuggestions error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch suggestions." });
  }
}

// POST /api/suggestions/generate
export async function generateAndSaveSuggestion(req, res) {
  const { market, currentHeadline, currentDetail } = req.body;

  if (!market || !currentHeadline) {
    return res.status(400).json({ success: false, error: "market and currentHeadline are required." });
  }

  try {
    const aiResult = await generateSuggestion(market, currentHeadline);
    const meta = getMeta(market);

    const suggestion = await prisma.suggestion.create({
      data: {
        market,
        flag: meta.flag,
        tone: meta.tone,
        color: meta.color,
        currentHeadline,
        currentDetail: currentDetail || "",
        suggestedHeadline: aiResult.suggestedHeadline,
        expectedLift: aiResult.expectedLift,
        confidence: aiResult.confidence,
        status: "pending",
      },
    });

    return res.status(201).json({ success: true, suggestion });
  } catch (error) {
    console.error("generateAndSaveSuggestion error:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to generate suggestion." });
  }
}

// POST /api/suggestions/apply/:id
export async function applySuggestion(req, res) {
  const { id } = req.params;
  try {
    const suggestion = await prisma.suggestion.update({
      where: { id },
      data: { status: "applied" },
    });
    return res.status(200).json({ success: true, suggestion });
  } catch (error) {
    console.error("applySuggestion error:", error);
    return res.status(500).json({ success: false, error: error.code === "P2025" ? "Suggestion not found." : "Failed to apply suggestion." });
  }
}

// PATCH /api/suggestions/review/:id
export async function reviewSuggestion(req, res) {
  const { id } = req.params;
  try {
    const suggestion = await prisma.suggestion.update({
      where: { id },
      data: { status: "under_review" },
    });
    return res.status(200).json({ success: true, suggestion });
  } catch (error) {
    console.error("reviewSuggestion error:", error);
    return res.status(500).json({ success: false, error: error.code === "P2025" ? "Suggestion not found." : "Failed to review suggestion." });
  }
}

// POST /api/suggestions/regenerate/:id
export async function regenerateSuggestion(req, res) {
  const { id } = req.params;
  try {
    const existing = await prisma.suggestion.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, error: "Suggestion not found." });

    const aiResult = await generateSuggestion(existing.market, existing.currentHeadline);

    const updated = await prisma.suggestion.update({
      where: { id },
      data: {
        suggestedHeadline: aiResult.suggestedHeadline,
        expectedLift: aiResult.expectedLift,
        confidence: aiResult.confidence,
        status: "pending",
      },
    });

    return res.status(200).json({ success: true, suggestion: updated });
  } catch (error) {
    console.error("regenerateSuggestion error:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to regenerate suggestion." });
  }
}

// POST /api/suggestions/apply-all
export async function applyAllSuggestions(req, res) {
  try {
    const result = await prisma.suggestion.updateMany({
      where: { status: "pending" },
      data: { status: "applied" },
    });
    return res.status(200).json({ success: true, appliedCount: result.count });
  } catch (error) {
    console.error("applyAllSuggestions error:", error);
    return res.status(500).json({ success: false, error: "Failed to apply all suggestions." });
  }
}

// GET /api/suggestions/applied — fetch all applied suggestions
export async function getAppliedSuggestions(req, res) {
  try {
    const suggestions = await prisma.suggestion.findMany({
      where: { status: "applied" },
    });
    return res.status(200).json({ success: true, suggestions });
  } catch (error) {
    console.error("getAppliedSuggestions error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch applied suggestions." });
  }
}

// DELETE /api/suggestions/:id
export async function deleteSuggestion(req, res) {
  const { id } = req.params;
  try {
    await prisma.suggestion.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Suggestion deleted." });
  } catch (error) {
    console.error("deleteSuggestion error:", error);
    return res.status(500).json({ success: false, error: error.code === "P2025" ? "Suggestion not found." : "Failed to delete suggestion." });
  }
}
