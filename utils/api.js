import axios from "axios";

// Shared axios instance pointing to the Express backend
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

// ─── CAMPAIGN APIs ─────────────────────────────────────────────────────────────

export async function generateCampaign(payload) {
  const res = await api.post("/campaigns/generate", payload);
  return res.data;
}

export async function getCampaigns() {
  const res = await api.get("/campaigns");
  return res.data;
}

export async function getCampaignById(id) {
  const res = await api.get(`/campaigns/${id}`);
  return res.data;
}

export async function deleteCampaign(id) {
  const res = await api.delete(`/campaigns/${id}`);
  return res.data;
}

// ─── SUGGESTION APIs ───────────────────────────────────────────────────────────

// Fetch all saved suggestions
export async function getSuggestions() {
  const res = await api.get("/suggestions");
  return res.data;
}

// Generate a new AI suggestion and save it
export async function generateSuggestion(market, currentHeadline, currentDetail = "") {
  const res = await api.post("/suggestions/generate", { market, currentHeadline, currentDetail });
  return res.data;
}

// Mark a suggestion as applied
export async function applySuggestion(id) {
  const res = await api.post(`/suggestions/apply/${id}`);
  return res.data;
}

// Mark a suggestion as under review
export async function reviewSuggestion(id) {
  const res = await api.patch(`/suggestions/review/${id}`);
  return res.data;
}

// Regenerate AI suggestion for an existing entry
export async function regenerateSuggestion(id) {
  const res = await api.post(`/suggestions/regenerate/${id}`);
  return res.data;
}

// Apply all pending suggestions at once
export async function applyAllSuggestions() {
  const res = await api.post("/suggestions/apply-all");
  return res.data;
}

// Delete a suggestion by id
export async function deleteSuggestion(id) {
  const res = await api.delete(`/suggestions/${id}`);
  return res.data;
}

export default api;
