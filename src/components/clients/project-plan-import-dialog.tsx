"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";
import { ExtractedPlanData, ProjectPhase } from "@/types/project-plan";

type ImportStep = "input" | "processing" | "review";

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface ProjectPlanImportDialogProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  onImport: (clientId: string, extractedPlan: ExtractedPlanData) => void;
}

export function ProjectPlanImportDialog({
  open,
  onClose,
  clientId,
  clientName,
  onImport,
}: ProjectPlanImportDialogProps) {
  const [step, setStep] = useState<ImportStep>("input");
  const [textContent, setTextContent] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedPlan, setExtractedPlan] = useState<ExtractedPlanData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep("input");
    setTextContent("");
    setFileName(null);
    setExtractedPlan(null);
    setError(null);
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    if (file.type === "application/pdf") {
      setTextContent("[PDF files: please copy and paste the text content below for this POC]");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setTextContent(ev.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleExtract = async () => {
    if (!textContent.trim()) return;
    setStep("processing");
    setError(null);

    try {
      const response = await fetch("/api/extract-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: textContent, clientName }),
      });

      if (!response.ok) throw new Error("Extraction failed");

      const data = await response.json();
      setExtractedPlan(data.extractedPlan);
      setStep("review");
    } catch {
      setError("Failed to extract plan data. Please try again or adjust the pasted content.");
      setStep("input");
    }
  };

  const handleConfirm = () => {
    if (extractedPlan) {
      onImport(clientId, extractedPlan);
      handleClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative mx-4 flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Import Project Plan</h2>
            <p className="text-sm text-muted-foreground">for {clientName}</p>
          </div>
          <button onClick={handleClose} className="text-muted-foreground transition-colors hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {step === "input" && (
            <div className="space-y-4">
              {/* File upload */}
              <div>
                <label className="mb-2 block text-sm font-medium">Upload file</label>
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border px-6 py-8 transition-colors hover:border-primary/50 hover:bg-accent/50">
                  <Upload className="h-8 w-8 text-muted-foreground/50" />
                  <span className="text-sm text-muted-foreground">
                    {fileName || "Drop a file or click to browse"}
                  </span>
                  <span className="text-xs text-muted-foreground/50">
                    Supports .txt, .csv, .xlsx (PDF: paste text below)
                  </span>
                  <input type="file" className="hidden" accept=".txt,.csv,.xlsx,.pdf" onChange={handleFileSelect} />
                </label>
              </div>

              {/* Text paste */}
              <div>
                <label className="mb-2 block text-sm font-medium">Or paste plan text</label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Paste your project plan content here... Include dates, phases, milestones, and any relevant timeline information."
                  className="h-48 w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
            </div>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center gap-4 py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium">Extracting plan data...</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  AI is identifying phases, milestones, and dates
                </p>
              </div>
            </div>
          )}

          {step === "review" && extractedPlan && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Extraction complete — review the results below
              </div>

              {/* Plan title */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Plan Title</label>
                <p className="text-sm font-semibold">{extractedPlan.title}</p>
                {extractedPlan.description && (
                  <p className="mt-1 text-xs text-muted-foreground">{extractedPlan.description}</p>
                )}
              </div>

              {/* Phases */}
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Phases ({extractedPlan.phases.length})
                </label>
                <div className="space-y-2">
                  {extractedPlan.phases.map((phase, idx) => (
                    <div key={phase.id} className="rounded-lg border border-border px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium">{phase.name}</span>
                      </div>
                      <div className="ml-7 mt-1 text-xs text-muted-foreground">
                        {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                        <span className="ml-2">&middot; {phase.milestones.length} milestones</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ambiguous items */}
              {extractedPlan.ambiguousItems.length > 0 && (
                <div>
                  <label className="mb-2 flex items-center gap-1 text-xs font-medium text-amber-400">
                    <AlertTriangle className="h-3 w-3" />
                    Ambiguous Dates ({extractedPlan.ambiguousItems.length})
                  </label>
                  <div className="space-y-1.5">
                    {extractedPlan.ambiguousItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-2 rounded border border-amber-500/20 bg-amber-500/5 px-3 py-2"
                      >
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-400" />
                        <div>
                          <p className="text-xs">{item.description}</p>
                          <p className="text-[11px] text-muted-foreground">
                            &quot;{item.originalText}&quot;
                            {item.suggestedValue && <> &rarr; Suggested: {formatDate(item.suggestedValue)}</>}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    You can resolve these after importing from the timeline view.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={handleClose}
            className="rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </button>
          {step === "input" && (
            <button
              onClick={handleExtract}
              disabled={!textContent.trim()}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <FileText className="h-4 w-4" />
              Extract Plan
            </button>
          )}
          {step === "review" && (
            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <CheckCircle2 className="h-4 w-4" />
              Import Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
