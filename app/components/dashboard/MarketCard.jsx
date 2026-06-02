import { TrendingUp, Users, Star } from "lucide-react";

/**
 * Maps country codes to background color classes for the flag avatar.
 */
const BG_COLOR_MAP = {
  IN: "bg-orange-50",
  US: "bg-blue-50",
  DE: "bg-yellow-50",
  JP: "bg-pink-50",
  GB: "bg-indigo-50",
  FR: "bg-sky-50",
  BR: "bg-green-50",
  SA: "bg-emerald-50",
  KR: "bg-rose-50",
  AU: "bg-cyan-50",
  CA: "bg-red-50",
  AE: "bg-teal-50",
  MX: "bg-lime-50",
  IT: "bg-amber-50",
  ES: "bg-orange-50",
  ID: "bg-fuchsia-50",
  TR: "bg-red-50",
  TH: "bg-violet-50",
  NG: "bg-green-50",
  CN: "bg-rose-50",
};

/**
 * Returns Tailwind classes for the score badge based on score value.
 * @param {number} score
 * @returns {string}
 */
function getScoreBadgeClasses(score) {
  if (score >= 80) return "bg-green-100 text-green-700";
  if (score >= 60) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

/**
 * Returns the Tailwind bg class for the progress bar.
 * @param {number} score
 * @returns {string}
 */
function getProgressBarColor(score) {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

/**
 * Formats a number using Indian/locale-aware formatting.
 * @param {number} value
 * @returns {string}
 */
function formatVisitors(value) {
  if (typeof value !== "number") return String(value);
  return value.toLocaleString("en-IN");
}

/**
 * A single market card displaying flag, region, score, visitors, conversion rate, and trend.
 * @param {{ market: object }} props - market matches the Market Prisma model shape
 */
// export default function MarketCard({ market }) {
export default function MarketCard({ market, onDelete }) {
  const bgColor = BG_COLOR_MAP[market.countryCode] || "bg-gray-50";
  const scoreBadge = getScoreBadgeClasses(market.localizationScore);
  const progressColor = getProgressBarColor(market.localizationScore);

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-200">
      {/* TOP */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl ${bgColor} flex items-center justify-center text-xl`}
          >
            {market.flag}
          </div>

          <div>
            <h3 className="font-bold text-lg text-gray-900 leading-none">
              {market.country}
            </h3>

            <p className="text-sm text-gray-400 mt-1">{market.region}</p>
          </div>
        </div>

        <div
          className={`${scoreBadge} text-xs font-bold px-3 py-1 rounded-full`}
        >
          {market.localizationScore}%
        </div>
      </div>

      {/* STATS */}
      <div className="mt-6 space-y-4 text-sm">
        <div className="flex justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <Users size={14} />
            Visitors
          </div>

          <p className="font-semibold text-gray-900">
            {formatVisitors(market.visitors)}
          </p>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <TrendingUp size={14} />
            Conv. Rate
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">
              {market.conversionRate}%
            </span>

            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              +{market.trend}%
            </span>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <Star size={14} />
            Loc. Score
          </div>

          <p className="font-semibold text-gray-900">
            {market.localizationScore}/100
          </p>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="mt-5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${progressColor}`}
          style={{ width: `${market.localizationScore}%` }}
        ></div>
      </div>

      {/* BUTTON */}
      {/* <button className="mt-5 text-sm text-blue-600 font-semibold hover:text-blue-700 transition">
        View Details →
      </button> */}
      {/* BUTTONS */}
      <div className="mt-5 flex items-center justify-between">
        <button className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition">
          View Details →
        </button>

        <button
          onClick={() => {
            const confirmed = window.confirm(
              `Remove ${market.country} market?`,
            );

            if (confirmed) {
              onDelete(market.id);
            }
          }}
          className="text-sm text-red-600 font-semibold hover:text-red-700 transition"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
