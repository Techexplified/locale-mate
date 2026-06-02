import MarketCard from "./MarketCard";

/**
 * Renders a responsive grid of MarketCard components.
 * Shows an empty-state message when no markets are provided.
 * @param {{ markets: Array }} props
 */
export default function MarketsGrid({ markets = [], onDeleteMarket }) {
  if (markets.length === 0) {
    return (
      <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <p className="text-2xl">🌍</p>
        <h3 className="text-lg font-bold text-gray-900 mt-3">
          No active markets
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Click &quot;+ Add market&quot; above to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
      {markets.map((market) => (
        <MarketCard key={market.id} market={market} onDelete={onDeleteMarket} />
      ))}
    </div>
  );
}
