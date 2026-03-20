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
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              {lead.name}
            </h3>
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
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                The Reason
              </span>
              <p className="mt-1 font-medium text-slate-900">{lead.reason}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                Recommended Action
              </span>
              <p className="mt-1 font-medium text-blue-900">
                {lead.nextAction}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="font-semibold text-slate-900">Action Score</span>
              <select
                value={actionScore}
                onChange={(event) => setActionScore(event.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 bg-white"
              >
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
                <option value="Contacted">Contacted</option>
              </select>
            </label>
          </div>

          <label className="grid gap-2">
            <span className="font-semibold text-slate-900">
              Notes & Context
            </span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              className="rounded-md border border-slate-300 px-3 py-2"
              placeholder="Add your research notes here..."
            />
          </label>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSaving ? "Saving..." : "Save Notes"}
            </button>
            <button
              onClick={markAsContacted}
              className="w-fit rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 border border-slate-300"
            >
              Mark as Contacted
            </button>
          </div>

          <div className="mt-2 border-t border-slate-200 pt-4">
            <h4 className="font-semibold text-slate-900">Message Generator</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={handleGenerateMessage}
                disabled={isGenerating}
                className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isGenerating
                  ? "Generating..."
                  : message
                    ? "Regenerate Message"
                    : "Generate Message"}
              </button>
              {message && (
                <button
                  onClick={handleCopy}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
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
              className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Generated message appears here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
