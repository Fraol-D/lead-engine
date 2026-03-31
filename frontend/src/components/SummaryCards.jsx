const cardStyles = [
  "col-span-12 md:col-span-5 bg-[#ffffff]",
  "col-span-6 md:col-span-3 bg-[#f7ebe7]",
  "col-span-6 md:col-span-4 bg-[#ece9e5]",
];

export default function SummaryCards({ summary }) {
  const cards = [
    { label: "Total Leads", value: summary.total },
    { label: "Hot Leads", value: summary.hot },
    { label: "Ready To Contact", value: summary.readyToContact },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card, index) => (
        <div key={card.label} className={`summary-card ${cardStyles[index]}`}>
          <p className="summary-label">{card.label}</p>
          <p className="summary-value">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
