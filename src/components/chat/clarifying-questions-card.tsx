"use client";

import { useEffect, useCallback, useState } from "react";
import { Check } from "lucide-react";
import { ClarifyingQuestions } from "@/types/chat";

interface ClarifyingQuestionsCardProps {
  data: ClarifyingQuestions;
  onSubmitAnswers: (answers: Record<string, string | string[]>) => void;
}

export function ClarifyingQuestionsCard({
  data,
  onSubmitAnswers,
}: ClarifyingQuestionsCardProps) {
  const { questions, answered, answers: savedAnswers } = data;
  const [activeTab, setActiveTab] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(
    savedAnswers || {}
  );
  const [otherText, setOtherText] = useState<Record<string, string>>({});

  const currentQuestion = questions[activeTab];
  const isAnswered = answered === true;

  const handleSelect = useCallback((questionId: string, label: string) => {
    if (isAnswered) return;
    setAnswers((prev) => ({ ...prev, [questionId]: label }));
  }, [isAnswered]);

  const handleMultiSelect = useCallback((questionId: string, label: string) => {
    if (isAnswered) return;
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || [];
      const exists = current.includes(label);
      return {
        ...prev,
        [questionId]: exists
          ? current.filter((l) => l !== label)
          : [...current, label],
      };
    });
  }, [isAnswered]);

  const handleOtherSelect = (questionId: string) => {
    if (isAnswered) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: `Other: ${otherText[questionId] || ""}`,
    }));
  };

  const handleOtherTextChange = (questionId: string, text: string) => {
    if (isAnswered) return;
    setOtherText((prev) => ({ ...prev, [questionId]: text }));
    if (
      typeof answers[questionId] === "string" &&
      (answers[questionId] as string).startsWith("Other:")
    ) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: `Other: ${text}`,
      }));
    }
  };

  const hasAnswer = (questionId: string) => {
    const a = answers[questionId];
    if (!a) return false;
    if (typeof a === "string" && a === "Other: ") return false;
    if (Array.isArray(a)) return a.length > 0;
    return true;
  };

  const answeredCount = questions.filter((q) => hasAnswer(q.id)).length;

  const allAnswered = answeredCount === questions.length;

  const handleSubmit = () => {
    if (!allAnswered || isAnswered) return;
    onSubmitAnswers(answers);
  };

  // Keyboard shortcuts: number keys to select, Enter to advance/submit
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isAnswered || !currentQuestion) return;
    // Ignore if user is typing in an input
    if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "TEXTAREA") return;

    if (e.key === "Enter") {
      if (!hasAnswer(currentQuestion.id)) return;
      if (activeTab < questions.length - 1) {
        setActiveTab(activeTab + 1);
      } else if (allAnswered) {
        onSubmitAnswers(answers);
      }
      return;
    }

    const num = parseInt(e.key, 10);
    if (isNaN(num) || num < 1 || num > currentQuestion.options.length) return;
    const option = currentQuestion.options[num - 1];
    if (currentQuestion.multiSelect) {
      handleMultiSelect(currentQuestion.id, option.label);
    } else {
      handleSelect(currentQuestion.id, option.label);
    }
  }, [isAnswered, currentQuestion, handleMultiSelect, handleSelect, activeTab, questions.length, allAnswered, answers, onSubmitAnswers]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Answered state: compact read-only summary
  if (isAnswered && savedAnswers) {
    return (
      <div className="rounded-lg border border-emerald-500/20 bg-card/50 px-4 py-3 max-w-[520px]">
        <div className="flex items-center gap-2 mb-2.5 text-[12px] tracking-wide uppercase text-emerald-500/70">
          <Check size={12} />
          <span>Questions answered</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {questions.map((q) => {
            const answer = savedAnswers[q.id];
            const answerText = Array.isArray(answer)
              ? answer.join(", ")
              : answer || "—";
            return (
              <div
                key={q.id}
                className="flex gap-2 text-[12px] leading-relaxed"
              >
                <span className="text-muted-foreground shrink-0">
                  {q.header}:
                </span>
                <span className="text-foreground">{answerText}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active state: tabbed question UI
  return (
    <div className="rounded-lg border border-border bg-card/50 overflow-hidden max-w-[520px]">
      {/* Tab bar */}
      <div className="flex border-b border-border bg-muted/30 overflow-x-auto">
        {questions.map((q, idx) => {
          const tabAnswered = hasAnswer(q.id);
          const isActive = idx === activeTab;
          return (
            <button
              key={q.id}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2.5 text-[12px] border-b-2 bg-transparent cursor-pointer flex items-center gap-1.5 whitespace-nowrap transition-colors duration-150 ${
                isActive
                  ? "text-foreground border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground/70"
              }`}
            >
              {tabAnswered && (
                <Check size={10} className="text-emerald-500" />
              )}
              {q.header}
            </button>
          );
        })}
      </div>

      {/* Question area */}
      {currentQuestion && (
        <div className="p-4 px-5">
          <p className="text-[13px] text-foreground mb-4 leading-relaxed">
            {currentQuestion.question}
          </p>

          {/* Option cards */}
          <div className="flex flex-col gap-2">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = currentQuestion.multiSelect
                ? (
                    (answers[currentQuestion.id] as string[]) || []
                  ).includes(option.label)
                : answers[currentQuestion.id] === option.label;

              return (
                <button
                  key={option.label}
                  onClick={() =>
                    currentQuestion.multiSelect
                      ? handleMultiSelect(currentQuestion.id, option.label)
                      : handleSelect(currentQuestion.id, option.label)
                  }
                  className={`p-2.5 px-3.5 text-left rounded-md cursor-pointer transition-all duration-150 w-full border flex items-start gap-3 ${
                    isSelected
                      ? "bg-primary/10 border-primary/30"
                      : "bg-muted/30 border-border hover:border-border/80 hover:bg-muted/50"
                  }`}
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[12px] font-medium ${
                    isSelected
                      ? "bg-primary/20 text-foreground"
                      : "bg-muted/60 text-foreground/50"
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <div
                      className={`text-[13px] ${
                        isSelected
                          ? "text-foreground font-medium"
                          : "text-foreground/70"
                      }`}
                    >
                      {option.label}
                    </div>
                    {option.description && (
                      <div className={`text-[11px] mt-0.5 ${
                        isSelected
                          ? "text-foreground/60"
                          : "text-foreground/45"
                      }`}>
                        {option.description}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}

            {/* "Other" option */}
            {(() => {
              const isOtherSelected =
                typeof answers[currentQuestion.id] === "string" &&
                (answers[currentQuestion.id] as string).startsWith("Other:");
              return (
                <>
                  <button
                    onClick={() => handleOtherSelect(currentQuestion.id)}
                    className={`p-2.5 px-3.5 text-left rounded-md cursor-pointer transition-all duration-150 w-full border ${
                      isOtherSelected
                        ? "bg-primary/10 border-primary/30"
                        : "bg-muted/30 border-border hover:border-border/80 hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className={`text-[13px] ${
                        isOtherSelected
                          ? "text-foreground font-medium"
                          : "text-foreground/70"
                      }`}
                    >
                      Other
                    </div>
                  </button>

                  {isOtherSelected && (
                    <input
                      type="text"
                      value={otherText[currentQuestion.id] || ""}
                      onChange={(e) =>
                        handleOtherTextChange(
                          currentQuestion.id,
                          e.target.value
                        )
                      }
                      placeholder="Type your answer..."
                      autoFocus
                      className="p-2 px-3 bg-muted/30 border border-primary/20 rounded-md text-foreground text-[13px] outline-none w-full focus:border-primary/40"
                    />
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Action button */}
      <div className="p-3 px-5 border-t border-border">
        {activeTab < questions.length - 1 ? (
          <button
            onClick={() => setActiveTab(activeTab + 1)}
            disabled={!hasAnswer(currentQuestion.id)}
            className={`w-full py-2.5 border-none rounded-md text-[12px] font-semibold tracking-wide transition-all duration-200 ${
              hasAnswer(currentQuestion.id)
                ? "bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90"
                : "bg-muted/50 text-muted-foreground/40 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`w-full py-2.5 border-none rounded-md text-[12px] font-semibold tracking-wide transition-all duration-200 ${
              allAnswered
                ? "bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90"
                : "bg-muted/50 text-muted-foreground/40 cursor-not-allowed"
            }`}
          >
            Submit answers ({answeredCount}/{questions.length})
          </button>
        )}
      </div>
    </div>
  );
}
