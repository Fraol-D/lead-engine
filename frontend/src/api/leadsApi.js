export async function fetchLeads(keyword = '') {
  const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : ''
  const response = await fetch(`/api/leads${query}`)
  if (!response.ok) {
    throw new Error('Failed to fetch leads')
  }
  return response.json()
}

export async function updateLead(id, payload) {
  const response = await fetch(`/api/leads/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to update lead')
  }

  return response.json()
}

export async function generateMessage(id) {
  const response = await fetch(`/api/leads/${id}/message`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to generate message')
  }

  return response.json()
}
