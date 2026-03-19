import { useEffect, useState } from 'react'
import { generateMessage, updateLead } from '../api/leadsApi'

export default function LeadDetailsModal({ lead, onClose, onLeadUpdated }) {
  const [notes, setNotes] = useState(lead?.notes || '')
  const [status, setStatus] = useState(lead?.status || 'cold')
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (lead) {
      setNotes(lead.notes || '')
      setStatus(lead.status || 'cold')
      setMessage('')
    }
  }, [lead])

  if (!lead) {
    return null
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updatedLead = await updateLead(lead.id, { notes, status })
      onLeadUpdated(updatedLead)
    } catch (error) {
      console.error(error)
      alert('Unable to save notes right now.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerateMessage = async () => {
    setIsGenerating(true)
    try {
      const result = await generateMessage(lead.id)
      setMessage(result.message)
    } catch (error) {
      console.error(error)
      alert('Unable to generate message right now.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!message) {
      return
    }

    try {
      await navigator.clipboard.writeText(message)
    } catch (error) {
      console.error(error)
      alert('Copy failed. Please copy manually from the text area.')
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{lead.name}</h3>
            <a
              href={lead.link}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-700 hover:underline"
            >
              {lead.link}
            </a>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-4 text-sm text-slate-700">
          <p>{lead.description}</p>
          <p>
            <span className="font-semibold text-slate-900">Reason:</span> {lead.reason}
          </p>

          <label className="grid gap-2">
            <span className="font-semibold text-slate-900">Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2"
            >
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="font-semibold text-slate-900">Notes</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              className="rounded-md border border-slate-300 px-3 py-2"
              placeholder="Write your outreach notes..."
            />
          </label>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSaving ? 'Saving...' : 'Save Notes'}
          </button>

          <div className="mt-2 border-t border-slate-200 pt-4">
            <h4 className="font-semibold text-slate-900">Message Generator</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={handleGenerateMessage}
                disabled={isGenerating}
                className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isGenerating ? 'Generating...' : 'Generate Message'}
              </button>
              <button
                onClick={handleCopy}
                disabled={!message}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Copy Message
              </button>
            </div>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={7}
              className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Generated message appears here..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
