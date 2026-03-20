const statusStyles = {
  Hot: "bg-red-100 text-red-700",
  Warm: "bg-amber-100 text-amber-800",
  Cold: "bg-slate-200 text-slate-700",
  Hold: "bg-violet-100 text-violet-700",
  Contacted: "bg-blue-100 text-blue-800",
};

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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Platform</th>
              <th className="px-4 py-3 font-semibold w-1/3">Reason</th>
              <th className="px-4 py-3 font-semibold">Action Score</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-slate-100 align-top">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <div className="flex flex-col">
                    <span>{lead.name}</span>
                    <span className="text-xs text-slate-500 font-normal">
                      {lead.niche}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">{lead.platform}</td>
                <td className="px-4 py-3 text-slate-700">{lead.reason}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusStyles[normalizeActionScore(lead)] || statusStyles.Cold}`}
                  >
                    {normalizeActionScore(lead)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onSelectLead(lead)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
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
