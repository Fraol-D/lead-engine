const normalizeActionScore = (lead) => {
  const score = (lead?.actionScore || "").toLowerCase();
  if (score === "hot") return "Hot";
  if (score === "warm") return "Warm";
  if (score === "cold") return "Cold";
  if (score === "contacted") return "Contacted";
  if (score === "hold") return "Hold";

  const legacyStatus = (lead?.status || "").toLowerCase();
  if (legacyStatus === "hot") return "Hot";
  if (legacyStatus === "warm") return "Warm";
  if (legacyStatus === "cold") return "Cold";
  return "Cold";
};

export default function LeadsTable({ leads, onSelectLead }) {
  return (
    <div className="table-shell overflow-hidden">
      <div className="overflow-x-auto">
        <table className="lead-table min-w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Platform</th>
              <th className="w-[35%]">Reason</th>
              <th>Action Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <div className="flex flex-col">
                    <span className="font-medium text-[#242322]">
                      {lead.name}
                    </span>
                    <span className="text-xs text-[#706b67] font-normal">
                      {lead.niche}
                    </span>
                  </div>
                </td>
                <td className="text-[#57524f]">{lead.platform}</td>
                <td className="text-[#3e3a37]">{lead.reason}</td>
                <td>
                  <span
                    className={`score-pill ${
                      normalizeActionScore(lead) === "Hot"
                        ? "score-hot"
                        : normalizeActionScore(lead) === "Warm"
                          ? "score-warm"
                          : normalizeActionScore(lead) === "Contacted"
                            ? "score-contacted"
                            : normalizeActionScore(lead) === "Hold"
                              ? "score-hold"
                              : "score-cold"
                    }`}
                  >
                    {normalizeActionScore(lead)}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => onSelectLead(lead)}
                    className="btn-secondary"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
