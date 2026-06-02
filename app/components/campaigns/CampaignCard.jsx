import { useState } from "react";
import { PLATFORM_META, BUDGET_META, getScoreColor, getScoreBg } from "./mockData.js";

/**
 * CampaignCard — displays a single campaign suggestion
 * Props:
 *   campaign  {object}  — campaign data object
 *   onSave    {fn}      — called when heart/save clicked
 *   onRegenerate {fn}   — called when AI regenerate clicked
 *   isSaved   {bool}    — is this campaign saved/favorited?
 */
export default function CampaignCard({ campaign, onSave, onRegenerate, isSaved }) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const platform = PLATFORM_META[campaign.platform] || {
    color: "bg-gray-100 text-gray-600",
    icon: "📢",
  };
  const budgetStyle = BUDGET_META[campaign.budget] || "bg-gray-100 text-gray-600";
  const scoreColor = getScoreColor(campaign.performanceScore);
  const scoreBg = getScoreBg(campaign.performanceScore);

  function copyCTA() {
    navigator.clipboard.writeText(campaign.cta).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function exportCampaign() {
    const blob = new Blob(
      [JSON.stringify(campaign, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${campaign.title.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">

        {/* TOP STRIPE — performance score bar */}
        <div className="h-1 w-full bg-gray-100">
          <div
            className={`h-full ${scoreBg} transition-all duration-700`}
            style={{ width: `${campaign.performanceScore}%` }}
          />
        </div>

        <div className="p-5 flex flex-col flex-1">

          {/* HEADER ROW */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* Category + Platform */}
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  {campaign.category}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${platform.color}`}>
                  {platform.icon} {campaign.platform}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${budgetStyle}`}>
                  {campaign.budget} Budget
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 text-base leading-snug truncate">
                {campaign.title}
              </h3>
            </div>

            {/* Save / Favorite button */}
            <button
              onClick={() => onSave(campaign.id)}
              title={isSaved ? "Remove from saved" : "Save campaign"}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isSaved
                  ? "bg-red-50 text-red-500 hover:bg-red-100"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-400"
              }`}
            >
              {isSaved ? "❤️" : "🤍"}
            </button>
          </div>

          {/* DESCRIPTION */}
          <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">
            {campaign.description}
          </p>

          {/* AUDIENCE */}
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <span>🎯</span>
            <span className="truncate">{campaign.audience}</span>
          </div>

          {/* CTA BAR */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 truncate">
              "{campaign.cta}"
            </div>
            <button
              onClick={copyCTA}
              title="Copy CTA"
              className="flex-shrink-0 text-xs px-2 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition font-medium"
            >
              {copied ? "✅" : "📋"}
            </button>
          </div>

          {/* TAGS */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {campaign.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* METRICS ROW */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Engagement */}
              <div className="text-center">
                <div className="text-sm font-bold text-gray-800">
                  {campaign.engagementRate}%
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Engagement</div>
              </div>
              {/* Score */}
              <div className="text-center">
                <div className={`text-sm font-bold ${scoreColor}`}>
                  {campaign.performanceScore}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Score</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowModal(true)}
                title="View Details"
                className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition"
              >
                View
              </button>
              <button
                onClick={() => onRegenerate(campaign.id)}
                title="Regenerate with AI"
                className="text-xs px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium transition"
              >
                ✨ AI
              </button>
              <button
                onClick={exportCampaign}
                title="Export JSON"
                className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium transition"
              >
                ↓
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                    {campaign.category}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${platform.color}`}>
                    {platform.icon} {campaign.platform}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{campaign.title}</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl ml-4"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">{campaign.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Target Audience</div>
                <div className="text-sm text-gray-700 font-medium">{campaign.audience}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Budget Level</div>
                <div className={`text-sm font-bold inline-block px-2 py-0.5 rounded-full ${budgetStyle}`}>
                  {campaign.budget}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Engagement Rate</div>
                <div className="text-lg font-bold text-gray-900">{campaign.engagementRate}%</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Performance Score</div>
                <div className={`text-lg font-bold ${scoreColor}`}>{campaign.performanceScore}/100</div>
              </div>
            </div>

            <div className="mt-4 bg-purple-50 rounded-xl p-3">
              <div className="text-[10px] text-purple-400 uppercase font-semibold mb-1">Call To Action</div>
              <div className="text-sm font-semibold text-purple-800">"{campaign.cta}"</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {campaign.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={exportCampaign}
                className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition font-medium"
              >
                ↓ Export
              </button>
              <button
                onClick={() => { onSave(campaign.id); setShowModal(false); }}
                className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition font-medium"
              >
                {isSaved ? "❤️ Saved" : "🤍 Save"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
