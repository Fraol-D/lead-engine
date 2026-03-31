export default function AppHeader({ title, subtitle, rightAction }) {
  return (
    <header className="glass-nav">
      <div>
        <p className="kicker">Lead Engine</p>
        <h1 className="nav-title">{title}</h1>
        {subtitle ? <p className="nav-subtitle">{subtitle}</p> : null}
      </div>
      <div>{rightAction}</div>
    </header>
  );
}
