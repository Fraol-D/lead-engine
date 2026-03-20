const express = require("express");
const cors = require("cors");
const { seedLeads } = require("./src/data/seedLeads");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const actionScorePriority = ["Hot", "Warm", "Cold", "Contacted"];

const normalizeLegacyScore = (lead) => {
  if (lead.actionScore) {
    return normalizeScore(lead.actionScore);
  }

  const legacyStatus = (lead.status || "").toLowerCase();
  if (legacyStatus === "hot") return "Hot";
  if (legacyStatus === "warm") return "Warm";
  if (legacyStatus === "cold") return "Cold";
  return "Cold";
};

let leadsStore = seedLeads.map((lead) => ({
  ...lead,
  actionScore: normalizeLegacyScore(lead),
}));

const normalizeScore = (value) => {
  const normalized = (value || "").toLowerCase();
  const match = actionScorePriority.find(
    (score) => score.toLowerCase() === normalized,
  );
  return match || "Cold";
};

const cloneLead = (lead) => ({
  ...lead,
  actionScore: normalizeLegacyScore(lead),
});

const filterByKeyword = (keyword) => {
  if (!keyword) {
    return leadsStore.map(cloneLead);
  }

  const lowerKeyword = keyword.toLowerCase();
  return leadsStore
    .filter((lead) => {
      const searchable = [
        lead.name,
        lead.platform,
        lead.niche,
        lead.reason,
        lead.description,
      ];
      return searchable.some((field) =>
        field.toLowerCase().includes(lowerKeyword),
      );
    })
    .map(cloneLead);
};

const createSimulatedLeads = (keyword, count = 8) => {
  const base = keyword.trim();
  const platforms = ["LinkedIn", "Product Hunt", "Indie Hackers", "Twitter/X"];
  return Array.from({ length: count }).map((_, index) => {
    const id = `sim-${Date.now()}-${index + 1}`;
    const actionScore =
      actionScorePriority[index % (actionScorePriority.length - 1)];
    return {
      id,
      name: `${base} Prospect ${index + 1}`,
      link: `https://example.com/${base.toLowerCase().replace(/\s+/g, "-")}-${index + 1}`,
      platform: platforms[index % platforms.length],
      niche: base,
      reason: `Matches the '${base}' keyword and appears active in startup communities.`,
      actionScore,
      nextAction: "Send a personalized intro message",
      description: `${base} focused startup showing early traction and growth signals.`,
      notes: "",
    };
  });
};

const buildSummary = (leads) => {
  const total = leads.length;
  const hot = leads.filter((lead) => lead.actionScore === "Hot").length;
  const readyToContact = leads.filter(
    (lead) => lead.actionScore === "Hot" || lead.actionScore === "Warm",
  ).length;
  return { total, hot, readyToContact };
};

const generateMessage = (lead) => {
  const shortReason =
    typeof lead.reason === "string" && lead.reason.includes("→")
      ? lead.reason.split("→")[0].trim().toLowerCase()
      : lead.reason.toLowerCase();

  return `Hi ${lead.name},\n\nI saw you recently ${shortReason}. Early-stage growth can be tough, so I built something that helps founders find and organize high-quality leads faster. Thought it might be useful for you.\n\nBest,\n[Your Name]`;
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/leads", (req, res) => {
  const keyword = (req.query.keyword || "").toString().trim();
  let leads = filterByKeyword(keyword);

  if (keyword && leads.length === 0) {
    const simulatedLeads = createSimulatedLeads(keyword);
    leadsStore = [...simulatedLeads, ...leadsStore];
    leads = simulatedLeads.map(cloneLead);
  }

  leads.sort(
    (a, b) =>
      actionScorePriority.indexOf(a.actionScore) -
      actionScorePriority.indexOf(b.actionScore),
  );

  res.json({
    keyword,
    summary: buildSummary(leads),
    leads,
  });
});

app.patch("/api/leads/:id", (req, res) => {
  const { id } = req.params;
  const { notes, actionScore } = req.body;

  const leadIndex = leadsStore.findIndex((lead) => lead.id === id);
  if (leadIndex === -1) {
    return res.status(404).json({ message: "Lead not found" });
  }

  const updatedLead = {
    ...leadsStore[leadIndex],
    notes: typeof notes === "string" ? notes : leadsStore[leadIndex].notes,
    actionScore: actionScore
      ? normalizeScore(actionScore)
      : normalizeLegacyScore(leadsStore[leadIndex]),
  };

  leadsStore[leadIndex] = updatedLead;
  return res.json(updatedLead);
});

app.post("/api/leads/:id/message", (req, res) => {
  const { id } = req.params;
  const lead = leadsStore.find((item) => item.id === id);

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  return res.json({ message: generateMessage(lead) });
});

app.listen(PORT, () => {
  console.log(`Lead Engine API listening on port ${PORT}`);
});
