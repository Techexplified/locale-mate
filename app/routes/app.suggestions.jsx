import SuggestionsTable from "../components/dashboard/SuggestionsTable";

export default function SuggestionsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">AI Suggestions</h1>
      <SuggestionsTable />
    </div>
  );
}
