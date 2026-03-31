import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchLeads } from "../api/leadsApi";
import AppHeader from "../components/AppHeader";
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
    <main className="page-shell min-h-screen">
      <AppHeader
        title="Lead Dashboard"
        subtitle={keyword ? `Showing results for: ${keyword}` : "Showing all leads"}
        rightAction={
          <Link to="/" className="btn-secondary">
            New Search
          </Link>
        }
      />

      <SummaryCards summary={summary} />

      <section className="mt-6">
        {isLoading && <p className="text-[#6f6863]">Loading leads...</p>}
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
