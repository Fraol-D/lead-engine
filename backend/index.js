const express = require('express')
const cors = require('cors')
const { seedLeads } = require('./src/data/seedLeads')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

let leadsStore = [...seedLeads]

const statusPriority = ['hot', 'warm', 'cold']

const normalizeStatus = (value) => {
  const normalized = (value || '').toLowerCase()
  return statusPriority.includes(normalized) ? normalized : 'cold'
}

const cloneLead = (lead) => ({ ...lead })

const filterByKeyword = (keyword) => {
  if (!keyword) {
    return leadsStore.map(cloneLead)
  }

  const lowerKeyword = keyword.toLowerCase()
  return leadsStore
    .filter((lead) => {
      const searchable = [lead.name, lead.platform, lead.niche, lead.reason, lead.description]
      return searchable.some((field) => field.toLowerCase().includes(lowerKeyword))
    })
    .map(cloneLead)
}

const createSimulatedLeads = (keyword, count = 8) => {
  const base = keyword.trim()
  const platforms = ['LinkedIn', 'Product Hunt', 'Indie Hackers', 'Twitter/X']
  return Array.from({ length: count }).map((_, index) => {
    const id = `sim-${Date.now()}-${index + 1}`
    const status = statusPriority[index % statusPriority.length]
    return {
      id,
      name: `${base} Prospect ${index + 1}`,
      link: `https://example.com/${base.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
      platform: platforms[index % platforms.length],
      niche: base,
      reason: `Matches the '${base}' keyword and appears active in startup communities.`,
      status,
      description: `${base} focused startup showing early traction and growth signals.`,
      notes: '',
    }
  })
}

const buildSummary = (leads) => {
  const total = leads.length
  const hot = leads.filter((lead) => lead.status === 'hot').length
  const readyToContact = leads.filter((lead) => lead.status === 'hot' || lead.status === 'warm').length
  return { total, hot, readyToContact }
}

const generateMessage = (lead) => {
  return `Hi ${lead.name} team,\n\nI came across your work in ${lead.niche} on ${lead.platform} and noticed: ${lead.reason}\n\nI'm reaching out because I help early teams streamline lead capture and outreach so founders spend less time on manual prospecting.\n\nIf useful, I can share a short playbook tailored to ${lead.name}.\n\nBest,\n[Your Name]`
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/leads', (req, res) => {
  const keyword = (req.query.keyword || '').toString().trim()
  let leads = filterByKeyword(keyword)

  if (keyword && leads.length === 0) {
    const simulatedLeads = createSimulatedLeads(keyword)
    leadsStore = [...simulatedLeads, ...leadsStore]
    leads = simulatedLeads.map(cloneLead)
  }

  leads.sort((a, b) => statusPriority.indexOf(a.status) - statusPriority.indexOf(b.status))

  res.json({
    keyword,
    summary: buildSummary(leads),
    leads,
  })
})

app.patch('/api/leads/:id', (req, res) => {
  const { id } = req.params
  const { notes, status } = req.body

  const leadIndex = leadsStore.findIndex((lead) => lead.id === id)
  if (leadIndex === -1) {
    return res.status(404).json({ message: 'Lead not found' })
  }

  const updatedLead = {
    ...leadsStore[leadIndex],
    notes: typeof notes === 'string' ? notes : leadsStore[leadIndex].notes,
    status: status ? normalizeStatus(status) : leadsStore[leadIndex].status,
  }

  leadsStore[leadIndex] = updatedLead
  return res.json(updatedLead)
})

app.post('/api/leads/:id/message', (req, res) => {
  const { id } = req.params
  const lead = leadsStore.find((item) => item.id === id)

  if (!lead) {
    return res.status(404).json({ message: 'Lead not found' })
  }

  return res.json({ message: generateMessage(lead) })
})

app.listen(PORT, () => {
  console.log(`Lead Engine API listening on port ${PORT}`)
})
