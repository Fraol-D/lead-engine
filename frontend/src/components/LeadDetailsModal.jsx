import { useEffect, useRef, useState } from "react";
import { generateMessage, updateLead } from "../api/leadsApi";

export default function LeadDetailsModal({ lead, onClose, onLeadUpdated }) {
  const [notes, setNotes] = useState(lead?.notes || "");
  const [actionScore, setActionScore] = useState(lead?.actionScore || "Cold");
  const [message, setMessage] = useState("");
  const [copyState, setCopyState] = useState("idle");
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const copyResetTimeoutRef = useRef(null);

  const queueCopyStateReset = (nextState, durationMs) => {
    if (copyResetTimeoutRef.current) {
      clearTimeout(copyResetTimeoutRef.current);
      copyResetTimeoutRef.current = null;
    }

    setCopyState(nextState);
    copyResetTimeoutRef.current = setTimeout(() => {
      setCopyState("idle");
      copyResetTimeoutRef.current = null;
    }, durationMs);
  };

  useEffect(() => {
    if (lead) {
      setNotes(lead.notes || "");
      setActionScore(lead.actionScore || "Cold");
      setMessage("");
      setCopyState("idle");

      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current);
        copyResetTimeoutRef.current = null;
      }
    }
  }, [lead]);

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current);
      }
    };
  }, []);

  if (!lead) {
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedLead = await updateLead(lead.id, { notes, actionScore });
      onLeadUpdated(updatedLead);
    } catch (error) {
      console.error(error);
      alert("Unable to save notes right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const markAsContacted = async () => {
    try {
      const updatedLead = await updateLead(lead.id, {
        notes,
        actionScore: "Contacted",
      });
      setActionScore("Contacted");
      onLeadUpdated(updatedLead);
    } catch (error) {
      console.error(error);
      alert("Unable to update right now.");
    }
  };

  const handleGenerateMessage = async () => {
    setIsGenerating(true);
    try {
      const result = await generateMessage(lead.id);
      setMessage(result.message);
      setCopyState("idle");

      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current);
        copyResetTimeoutRef.current = null;
      }
    } catch (error) {
      console.error(error);
      alert("Unable to generate message right now.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!message) {
      return;
    }

    try {
      await navigator.clipboard.writeText(message);
      queueCopyStateReset("copied", 1700);
    } catch (error) {
      console.error(error);
      queueCopyStateReset("failed", 2200);
      alert("Copy failed. Please copy manually from the text area.");
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="modal-shell">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="kicker">Lead Profile</p>
            <h3 className="text-2xl font-semibold text-[#22201f]">
              {lead.name}
            </h3>
            <a
              href={lead.link}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[#72564c] hover:underline"
            >
              {lead.link}
            </a>
          </div>
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-4 text-sm text-[#3c3936]">
          <div className="modal-grid">
            <div className="ghost-block">
              <span className="label-micro">The Reason</span>
              <p className="value-copy">{lead.reason}</p>
            </div>
            <div className="ghost-block bg-[#efe9e4]">
              <span className="label-micro text-[#77584f]">
                Recommended Action
              </span>
              <p className="value-copy">
                {lead.nextAction ||
                  "Follow and observe activity, then send a concise intro."}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="label-micro">Action Score</span>
              <select
                value={actionScore}
                onChange={(event) => setActionScore(event.target.value)}
                className="field-select"
              >
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
                <option value="Contacted">Contacted</option>
              </select>
            </label>
          </div>

          <label className="grid gap-2">
            <span className="label-micro">Notes & Context</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              className="field-area"
              placeholder="Add your research notes here..."
            />
          </label>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary w-fit disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Notes"}
            </button>
            <button onClick={markAsContacted} className="btn-secondary">
              Mark as Contacted
            </button>
          </div>

          <div className="mt-2 pt-4">
            <h4 className="font-semibold text-[#2a2724]">Message Generator</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={handleGenerateMessage}
                disabled={isGenerating}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGenerating
                  ? "Generating..."
                  : message
                    ? "Regenerate Message"
                    : "Generate Message"}
              </button>
              {message && (
                <button onClick={handleCopy} className="btn-secondary">
                  {copyState === "copied" ? "Copied" : "Copy Message"}
                </button>
              )}
            </div>
            <div className="mt-2 h-7">
              <p
                className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium ring-1 transition-all duration-300 ${
                  copyState === "idle"
                    ? "pointer-events-none translate-y-1 opacity-0"
                    : "translate-y-0 opacity-100"
                } ${
                  copyState === "copied"
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-red-50 text-red-700 ring-red-200"
                }`}
              >
                {copyState === "copied"
                  ? "Message copied to clipboard"
                  : "Copy failed, please try again"}
              </p>
            </div>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={7}
              className="field-area mt-3"
              placeholder="Generated message appears here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
