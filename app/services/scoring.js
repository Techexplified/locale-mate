/**
 * Scoring utilities for LocaleMate dashboard
 * Provides localization score calculation, conversion rates,
 * trend calculations, and Tailwind CSS color helpers.
 */

/**
 * Calculates a 0-100 localization score based on weighted criteria
 * @param {object} params - Scoring parameters
 * @param {number} params.translatedItems - Number of translated items
 * @param {number} params.totalProducts - Total number of translatable products
 * @param {boolean} params.hasCurrency - Whether local currency is supported
 * @param {boolean} params.hasLanguage - Whether local language is supported
 * @param {number} params.activeCampaigns - Number of active campaigns
 * @param {number} params.conversionRate - Current conversion rate percentage
 * @returns {number} Score between 0 and 100
 */
export function calculateLocalizationScore({
  translatedItems = 0,
  totalProducts = 1,
  hasCurrency = false,
  hasLanguage = false,
  activeCampaigns = 0,
  conversionRate = 0,
}) {
  // Prevent division by zero
  const safeTotal = totalProducts > 0 ? totalProducts : 1;

  // Translation coverage — 40% weight
  const translationRatio = Math.min(translatedItems / safeTotal, 1);
  const translationScore = translationRatio * 40;

  // Currency support — 20% weight
  const currencyScore = hasCurrency ? 20 : 0;

  // Language support — 20% weight
  const languageScore = hasLanguage ? 20 : 0;

  // Active campaigns — 10% weight
  const campaignScore = activeCampaigns > 0 ? 10 : 0;

  // Conversion rate above 2% — 10% weight
  const conversionScore = conversionRate > 2 ? 10 : 0;

  const totalScore = Math.round(
    translationScore + currencyScore + languageScore + campaignScore + conversionScore
  );

  return Math.max(0, Math.min(100, totalScore));
}

/**
 * Calculates conversion rate as a percentage
 * @param {number} orders - Number of orders
 * @param {number} visitors - Number of visitors
 * @returns {number} Conversion rate percentage rounded to 1 decimal
 */
export function calculateConversionRate(orders, visitors) {
  if (!visitors || visitors <= 0) {
    return 0;
  }
  return Math.round((orders / visitors) * 100 * 10) / 10;
}

/**
 * Calculates the trend (percentage change) between two values
 * @param {number} current - Current period value
 * @param {number} previous - Previous period value
 * @returns {number} Percentage change rounded to 1 decimal
 */
export function calculateTrend(current, previous) {
  if (!previous || previous <= 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100 * 10) / 10;
}

/**
 * Returns Tailwind CSS classes for a score badge based on score value
 * @param {number} score - Score between 0 and 100
 * @returns {string} Tailwind CSS classes for badge styling
 */
export function getScoreBadgeColor(score) {
  if (score >= 80) {
    return "bg-green-100 text-green-800";
  }
  if (score >= 60) {
    return "bg-yellow-100 text-yellow-800";
  }
  return "bg-red-100 text-red-800";
}

/**
 * Returns Tailwind CSS background class for a progress bar based on score value
 * @param {number} score - Score between 0 and 100
 * @returns {string} Tailwind CSS background class
 */
export function getProgressBarColor(score) {
  if (score >= 80) {
    return "bg-green-500";
  }
  if (score >= 60) {
    return "bg-yellow-500";
  }
  return "bg-red-500";
}
