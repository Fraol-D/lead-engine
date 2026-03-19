const statusStyles = {
  hot: 'bg-red-100 text-red-700',
  warm: 'bg-amber-100 text-amber-800',
  cold: 'bg-slate-200 text-slate-700',
}

export default function LeadsTable({ leads, onSelectLead }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Platform</th>
              <th className="px-4 py-3 font-semibold">Niche</th>
              <th className="px-4 py-3 font-semibold">Reason</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-slate-100 align-top">
                <td className="px-4 py-3 font-medium text-slate-900">{lead.name}</td>
                <td className="px-4 py-3 text-slate-700">{lead.platform}</td>
                <td className="px-4 py-3 text-slate-700">{lead.niche}</td>
                <td className="px-4 py-3 text-slate-700">{lead.reason}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusStyles[lead.status] || statusStyles.cold}`}
                  >
                    {lead.status}
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
  )
}
