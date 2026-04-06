## The Prompt

Paste this as a Codex task. Before running, Codex will need context about your product — either pass it in as part of the task description (replacing the bracketed placeholders yourself) or include a brief product description file in the repo that Codex can read.

```
Set up a Product Knowledge system for this project. Create two files and modify a third.

## Task 1: Create KNOWLEDGE.md in the project root

Write a file called `KNOWLEDGE.md` with the following structure. Replace all bracketed placeholders with real content based on what you find in the codebase (README, existing docs, code comments, config files). If you cannot determine the answer from the codebase, use the placeholder text as-is so the user can fill it in later.

---

# Product Knowledge

Stable product principles, architectural understanding, and design decisions for [PROJECT NAME]. This file captures durable knowledge that applies across all future work.

---

## What [Product] Is

[1-2 paragraph description of the product, who it's for, and what problem it solves. Infer from README, package.json description, or code structure.]

## Core JTBD

[The single most important job-to-be-done. If unclear from the codebase, write: "TODO: Define the core job-to-be-done."]

---

## [Topic-specific sections as needed]

For each major product area, integration, or architectural decision you can identify from the codebase, create a section with:
- **Summary** — what it is in 2-3 sentences
- **Principles** — the "why" and non-negotiables
- **What we decided** — specific decisions with reasoning
- **Rejected approaches** — what was considered and why it was rejected (leave blank if unknown — the user will fill this in over time)
- **Implementation** — where it lives in the codebase (file paths)
- **Testing** — how to validate it works

Create as many topic sections as you can justify from the codebase. Do not invent decisions — only document what is evident from the code and existing docs.

---

## Task 2: Modify CLAUDE.md (or AGENTS.md)

If a `CLAUDE.md` or `AGENTS.md` file exists in the project root, add the following two blocks to it. If neither file exists, create `AGENTS.md` with these contents.

### Add after the Project Overview section (or at the top if no overview exists):

**Read `KNOWLEDGE.md` before making product decisions.** It captures stable product principles, the core JTBD, and integration strategy.

### Add as a new section:

## Knowledge Management

### KNOWLEDGE.md
- Contains durable product knowledge — principles, decisions, and architectural understanding that apply across ALL future work
- **Read it first** when resuming work or making product/design decisions
- **Update it** when a significant product decision is made, a new integration is explored, or a design principle is established
- **Never delete** — if a decision changes, update the section with the new decision and move the old one to "Rejected approaches" with reasoning
- Keep it factual and concise — this isn't a changelog, it's a reference document
- Sections should answer: What did we decide? Why? What did we reject? Where is it implemented?

---

## Constraints

- Do NOT delete or overwrite existing content in CLAUDE.md / AGENTS.md — only append.
- Do NOT fabricate product decisions. If something is ambiguous, mark it as TODO.
- Keep KNOWLEDGE.md under 300 lines for the initial version. It will grow over time.
- Use real file paths from the codebase when documenting implementation details.
```
