# SIDEQUEST — Design Decision History Tool

## Your Job
Evolve the existing "decision tree" (an interactive HTML+JSON visualization) into a **design decision history tool** — something that serves two audiences:
1. **New team members** who need to get onboarded quickly on why things are the way they are
2. **The product trio** (PM, designer, engineer) who need to remember months later why decisions were made

The current tool tracks *what* was explored and its status, but it doesn't capture the *why* — the reasoning, tradeoffs, user feedback, and evolution of thinking. That's the gap to fill.

## Context
We're building a "Clients" view for a BambooHR consultant app. The core UX problem: how does a consultant select which client they're working with? We brainstormed 10 approaches, prototyped the top 4 (A-D) through 3 iterations each, then spawned 2 more ideas (E, F). Each iteration was informed by persona feedback, UX reviews, and user reactions.

The decision tree already exists as a standalone HTML+JSON tool (not part of the Next.js app). It has:
- A dark-themed card-list UI showing all approaches with status dots, version badges, and notes
- Status filtering (exploring/new/filed/parked/abandoned) with a stats bar
- Inline editing (double-click name or note, click status to cycle)
- Auto-save to JSON via a small Node server on port 3333
- Keyboard shortcuts (Esc to clear filter)
- Spawn lineage (showing when one idea inspired another)

### What it's missing for the "decision history" vision:
- **Timeline/narrative**: No sense of when things happened or what order decisions were made
- **Reasoning capture**: The "note" field is one line — no room for "we tried X because Y, but Z happened"
- **Evidence links**: No way to attach screenshots, persona quotes, or review excerpts
- **Decision moments**: No concept of "we chose C over A because..." — just individual statuses
- **Onboarding flow**: No guided reading order for a newcomer — it's a flat status dashboard

## What Exists

### Files
- **`decision-tree.html`** — The full interactive UI (~725 lines, single-file HTML+CSS+JS). Dark theme, data-driven from JSON, inline editing, status filtering, auto-save.
- **`decision-tree-data.json`** — The data store. Tree structure with approaches, statuses, versions, notes, mockup/prototype links. See schema below.
- **`decision-tree-server.js`** — Node HTTP server (port 3333) serving static files + POST /save endpoint for auto-save.

### Current data schema (decision-tree-data.json)
```json
{
  "title": "...",
  "subtitle": "...",
  "lastUpdated": "2026-02-20",
  "statuses": { "exploring": { "label": "Exploring", "color": "#3b82f6", "glow": true }, ... },
  "tree": [
    {
      "id": "root",
      "name": "Client Selection UX Problem",
      "note": "How does a consultant select which client they're working with?",
      "children": [
        {
          "phase": "Brainstorm → Prototype (Top 4)",
          "children": [
            {
              "id": "A", "name": "Card Grid", "status": "parked",
              "note": "Mode-switch friction — must leave workspace to switch clients",
              "versions": ["v1","v2","v3"], "currentVersion": "v3",
              "mockup": "mockup-01-card-grid.html", "prototype": "localhost:3001",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

### The server is already running
**http://localhost:3333/decision-tree.html** — you can view the current state.

### Previous iteration history
- **v1**: Static tree visualization (user said "this is really promising")
- **v2**: Made data-driven (JSON), added stats bar, click-to-filter, prototype links
- **v3**: Added inline editing (double-click name/note, click status to cycle), auto-save via server
- **v4**: Cleaned up UI, simplified layout from tree-lines to card-list

### Current state of all tracked ideas
**Active / Exploring:**
- C: Sidebar Client List (v3, EXPLORING) — Favorite so far
- F: Client Tabs Row (v1, NEW) — Spawned from C's collapsed mode + idea #9
- E: Tab Groups (v1, NEW) — All clients' tabs in one bar, grouped by client

**Filed:** 5: Command Palette — Power user quick-switch

**Parked:** A: Card Grid (v3), B: Dropdown (v3), D: Breadcrumb (v3), 8: Sliding Drawer, 9: Recent + Favorites

**Abandoned:** 6: Floating Pill, 10: Avatar Row

## What the User Wants Next
Transform this from a "status tracker" into a **"decision history"** that tells a story. The user's exact words: *"keeping a history of design decisions that anyone can step into and get onboarded super quickly, or the product trio can use to remember why things were done a certain way."*

Key qualities:
- A newcomer should understand not just WHAT was tried, but WHY each thing was tried, what happened, and why the current direction was chosen
- The product trio should be able to come back months later and reconstruct their reasoning
- It should still be interactive and editable (the inline-edit pattern works well)
- The dark aesthetic and minimal style should be preserved — this is a tool, not a document

Possible directions (not prescriptive — use your judgment, propose ideas to the user):
- Expandable detail panels on each card (click to reveal full reasoning, evidence, timeline)
- A timeline/narrative view showing the arc of exploration
- "Decision point" entries that capture fork-in-the-road moments ("we chose C over A because...")
- Ability to attach/reference screenshots and quotes
- A "story mode" or guided walkthrough for onboarding
- Richer data fields in the JSON (reasoning, evidence, dates, decision_points)

## Files You Own
- `decision-tree.html` — The main UI (feel free to evolve significantly)
- `decision-tree-data.json` — The data store (extend the schema as needed)
- `decision-tree-server.js` — The server (extend if needed for new endpoints)
- `SIDEQUEST.md` — This file (update as you work)
- Any new files needed for this feature (keep in project root alongside existing decision-tree files)

## Files You Do NOT Touch
- `src/` — The entire Next.js application
- `INTENT.md` — Managed by the main session
- `CLAUDE.md` — Project config
- `package.json`, `next.config.ts`, etc. — App infrastructure
- `mockup-*.html` — The original brainstorm mockups (read-only reference)

## Reference Files (read-only, for context)
- `OBSERVATIONS.md` — Rich UX review content with persona quotes, rankings, version-by-version rationale. This is exactly the kind of narrative content that should be capturable in the decision history tool.
- `INTENT.md` — Full project history and current state
- `approach-*.png` — Screenshots of each approach at various versions
- `decision-tree-*.png` — Screenshots of previous decision tree iterations
