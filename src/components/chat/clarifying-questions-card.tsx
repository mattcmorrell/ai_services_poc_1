"use client";

import { useState } from "react";
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

  const handleSelect = (questionId: string, label: string) => {
    if (isAnswered) return;
    setAnswers((prev) => ({ ...prev, [questionId]: label }));
  };

  const handleMultiSelect = (questionId: string, label: string) => {
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
  };

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

  const answeredCount = questions.filter((q) => {
    const answer = answers[q.id];
    if (!answer) return false;
    if (typeof answer === "string" && answer === "Other: ") return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return true;
  }).length;

  const allAnswered = answeredCount === questions.length;

  const handleSubmit = () => {
    if (!allAnswered || isAnswered) return;
    onSubmitAnswers(answers);
  };

  // Answered state: compact read-only summary
  if (isAnswered && savedAnswers) {
    return (
      <div
        style={{
          background: "rgba(232, 224, 255, 0.02)",
          border: "1px solid rgba(48, 255, 176, 0.15)",
          borderRadius: "8px",
          padding: "14px 18px",
          maxWidth: "520px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px",
            fontSize: "11px",
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "rgba(48, 255, 176, 0.7)",
          }}
        >
          <Check size={12} />
          <span>Questions answered</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {questions.map((q) => {
            const answer = savedAnswers[q.id];
            const answerText = Array.isArray(answer)
              ? answer.join(", ")
              : answer || "—";
            return (
              <div
                key={q.id}
                style={{
                  display: "flex",
                  gap: "8px",
                  fontSize: "12px",
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    color: "rgba(232, 224, 255, 0.5)",
                    fontFamily: "'IBM Plex Mono', monospace",
                    flexShrink: 0,
                  }}
                >
                  {q.header}:
                </span>
                <span style={{ color: "#E8E0FF" }}>{answerText}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active state: tabbed question UI
  return (
    <div
      style={{
        background: "rgba(232, 224, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "8px",
        overflow: "hidden",
        maxWidth: "520px",
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          background: "rgba(232, 224, 255, 0.01)",
          overflowX: "auto",
        }}
      >
        {questions.map((q, idx) => {
          const hasAnswer = (() => {
            const a = answers[q.id];
            if (!a) return false;
            if (typeof a === "string" && a === "Other: ") return false;
            if (Array.isArray(a)) return a.length > 0;
            return true;
          })();
          const isActive = idx === activeTab;
          return (
            <button
              key={q.id}
              onClick={() => setActiveTab(idx)}
              style={{
                padding: "9px 16px",
                fontSize: "12px",
                fontFamily: "'IBM Plex Mono', monospace",
                color: isActive
                  ? "#E8E0FF"
                  : "rgba(232, 224, 255, 0.4)",
                borderBottom: isActive
                  ? "2px solid #E930FF"
                  : "2px solid transparent",
                background: "transparent",
                border: "none",
                borderBottomWidth: "2px",
                borderBottomStyle: "solid",
                borderBottomColor: isActive ? "#E930FF" : "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
                transition: "color 0.15s ease",
              }}
            >
              {hasAnswer && (
                <Check size={10} style={{ color: "#30FFB0" }} />
              )}
              {q.header}
            </button>
          );
        })}
      </div>

      {/* Question area */}
      {currentQuestion && (
        <div style={{ padding: "16px 20px" }}>
          <p
            style={{
              fontSize: "13px",
              color: "#E8E0FF",
              marginBottom: "16px",
              lineHeight: 1.6,
            }}
          >
            {currentQuestion.question}
          </p>

          {/* Option cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {currentQuestion.options.map((option) => {
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
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    background: isSelected
                      ? "rgba(233, 48, 255, 0.08)"
                      : "rgba(232, 224, 255, 0.02)",
                    border: isSelected
                      ? "1px solid rgba(233, 48, 255, 0.3)"
                      : "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      color: isSelected
                        ? "#E8E0FF"
                        : "rgba(232, 224, 255, 0.7)",
                      fontWeight: isSelected ? 500 : 400,
                    }}
                  >
                    {option.label}
                  </div>
                  {option.description && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "rgba(232, 224, 255, 0.35)",
                        marginTop: "2px",
                      }}
                    >
                      {option.description}
                    </div>
                  )}
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
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      background: isOtherSelected
                        ? "rgba(233, 48, 255, 0.08)"
                        : "rgba(232, 224, 255, 0.02)",
                      border: isOtherSelected
                        ? "1px solid rgba(233, 48, 255, 0.3)"
                        : "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        color: isOtherSelected
                          ? "#E8E0FF"
                          : "rgba(232, 224, 255, 0.7)",
                        fontWeight: isOtherSelected ? 500 : 400,
                      }}
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
                      style={{
                        padding: "8px 12px",
                        background: "rgba(232, 224, 255, 0.03)",
                        border: "1px solid rgba(233, 48, 255, 0.15)",
                        borderRadius: "6px",
                        color: "#E8E0FF",
                        fontSize: "13px",
                        fontFamily: "'IBM Plex Mono', monospace",
                        outline: "none",
                        width: "100%",
                      }}
                    />
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Submit button */}
      <div
        style={{
          padding: "12px 20px",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          style={{
            width: "100%",
            padding: "10px",
            background: allAnswered
              ? "linear-gradient(135deg, #E930FF 0%, #FF3060 100%)"
              : "rgba(232, 224, 255, 0.05)",
            border: "none",
            borderRadius: "6px",
            color: allAnswered ? "#050510" : "rgba(232, 224, 255, 0.3)",
            fontSize: "12px",
            fontWeight: 600,
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: "1px",
            cursor: allAnswered ? "pointer" : "not-allowed",
            boxShadow: allAnswered
              ? "0 0 12px rgba(233, 48, 255, 0.3)"
              : "none",
            transition: "all 0.2s ease",
          }}
        >
          Submit answers ({answeredCount}/{questions.length})
        </button>
      </div>
    </div>
  );
}
