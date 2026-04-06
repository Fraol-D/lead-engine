import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";

export default function LandingPage() {
  const [keyword, setKeyword] = useState("AI SaaS");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanKeyword = keyword.trim();
    const query = cleanKeyword
      ? `?keyword=${encodeURIComponent(cleanKeyword)}`
      : "";
    navigate(`/dashboard${query}`);
  };

  return (
    <main className="page-shell min-h-screen">
      <AppHeader
        title="Architected Lead Discovery"
        subtitle="From scattered prospects to clear outreach priorities."
        rightAction={
          <span className="text-xs text-[#7f7771]">Curated Workflow</span>
        }
      />

      <section className="hero-wrap">
        <p className="kicker">The Architectural Manuscript</p>
        <h2 className="hero-title">
          Engineered intelligence for founder outreach.
        </h2>
        <p className="hero-copy">
          Use one keyword to surface lead opportunities, understand why each
          contact matters, and execute the next action with clarity.
        </p>

        <form onSubmit={handleSubmit} className="hero-grid">
          <div className="tier-panel">
            <label className="label-micro" htmlFor="keyword">
              Lead Focus
            </label>
            <input
              id="keyword"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="AI SaaS"
              className="input-architect mt-2"
            />
          </div>
          <button type="submit" className="btn-primary h-fit">
            Generate Leads →
          </button>
        </form>
      </section>
    </main>
  );
}
