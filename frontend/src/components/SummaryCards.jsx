const cardStyles = [
  'bg-white/95 border-slate-200',
  'bg-orange-50 border-orange-200',
  'bg-emerald-50 border-emerald-200',
]

export default function SummaryCards({ summary }) {
  const cards = [
    { label: 'Total leads', value: summary.total },
    { label: 'Hot leads', value: summary.hot },
    { label: 'Ready to contact', value: summary.readyToContact },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className={`rounded-xl border p-4 shadow-sm ${cardStyles[index]}`}
        >
          <p className="text-sm text-slate-600">{card.label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
        </div>
      ))}
    </div>
  )
}
