import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchLeads } from "../api/leadsApi";
import SummaryCards from "../components/SummaryCards";
import LeadsTable from "../components/LeadsTable";
import LeadDetailsModal from "../components/LeadDetailsModal";

export default function DashboardPage() {
  const [searchParams] = useSearchParams();
  const keyword = useMemo(
    () => searchParams.get("keyword") || "",
    [searchParams],
  );

  const [summary, setSummary] = useState({
    total: 0,
    hot: 0,
    readyToContact: 0,
  });
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const result = await fetchLeads(keyword);
        setSummary(result.summary);
        setLeads(result.leads);
      } catch (loadError) {
        console.error(loadError);
        setError("Unable to load leads. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [keyword]);

  const handleLeadUpdated = (updatedLead) => {
    setLeads((currentLeads) => {
      const nextLeads = currentLeads.map((lead) =>
        lead.id === updatedLead.id ? updatedLead : lead,
      );

      const hot = nextLeads.filter((lead) => lead.actionScore === "Hot").length;
      const readyToContact = nextLeads.filter(
        (lead) => lead.actionScore === "Hot" || lead.actionScore === "Warm",
      ).length;

      setSummary({
        total: nextLeads.length,
        hot,
        readyToContact,
      });

      return nextLeads;
    });

    setSelectedLead(updatedLead);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
            Lead Engine
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Lead Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {keyword ? `Showing results for: ${keyword}` : "Showing all leads"}
          </p>
        </div>
        <Link
          to="/"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          New Search
        </Link>
      </header>

      <SummaryCards summary={summary} />

      <section className="mt-6">
        {isLoading && <p className="text-slate-600">Loading leads...</p>}
        {error && <p className="text-red-700">{error}</p>}
        {!isLoading && !error && (
          <LeadsTable leads={leads} onSelectLead={setSelectedLead} />
        )}
      </section>

      <LeadDetailsModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onLeadUpdated={handleLeadUpdated}
      />
    </main>
  );
}
