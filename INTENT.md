# PROJECT STATUS: ON ICE (March 2026)

> **Read this first when resuming.** Then read `KNOWLEDGE.md` for the full product knowledge base.

## Where We Left Off

The project shifted from UI prototyping to **integration architecture and product strategy**. The last active work was researching how Pandopticon connects to HRCs' real tools (Google Docs, Sheets, Attention, Salesforce) and designing the flows between them.

## What's Built (Code)

- **15 design variants** (OG + v1-v14) — visual exploration, no winner picked yet
- **Client navigation** — 6 approaches prototyped (A-F), C (sidebar) chosen
- **Plan panel** — 3 approaches (A-C), C (split view) chosen
- **Dashboard** — calendar integration, meeting prep agent, proactive briefing flow
- **Client Home** — project plans with AI import, next meeting, deadlines
- **Decision journal** — `product-decisions.json` + `decision-journal.html` viewer (port 3334)
- **Integration map** — `mockups/system-architecture.html` (10 systems diagrammed)

## What's Designed But Not Built

- **Google Docs integration** — read Customer Profile Doc + auto-append call summaries (S19)
- **Google Sheets live linking** — replace one-time import with live sync + agent write-back (S18)
- **Attention.tech integration** — read extractedIntelligence for prep briefs and post-meeting flow (S17)
- **Client-facing project plan site** — rendered from Sheets, always-current URL for clients (S20)
- **Post-meeting flow** — Attention → agent proposes updates → cascade to Sheets + Docs + Pandopticon

## Critical Discovery Finding

**The Customer Profile Doc (Google Docs) is the real source of truth** — not Salesforce. A single Google Doc per client accumulates everything. Salesforce's role is narrower than assumed: it's a billing trigger and task template engine, not the daily planning tool. HRCs maintain plans in spreadsheets then duplicate into Salesforce (the #1 "work around the work").

Source: FigJam board `AI-Services` node 216:1103 — full HRC workflow mapped from discovery research. Captured in KNOWLEDGE.md under "Current HRC Workflow (As-Is)."

## Key Architectural Decisions

- **D8**: Pandopticon is an intelligence layer, never the system of record
- **D10**: Pull context via API, don't host files. UX feels like file hosting (linking), but architecture is reads and writes to source systems
- **Client-facing plan**: HRC edits via chat → agent writes to Google Sheet → rendered site updates. One sentence, three surfaces.

## Open Questions Needing Stakeholder Input

These can't be answered without Katie / BHR leadership:

- **Q13**: How much project management should Pandopticon own? (Dashboard vs. full PM tool)
- **Q14**: If Salesforce stays, how do we minimize double data entry? (Agent-mediated sync? Replace SF task tracking? Accept coexistence?)
- **Q16**: Is the rendered client site the seed of Katie's desired client portal?

## What's Outdated

- The "AI Services — Project Plans" todo (uploading files, storing files on company page) is superseded by D10 (pull context, don't host files) and live Google Sheets integration (S18)
- INTENT sections below for Client Tabs, Plan Panel, Visual Design — the decisions are made but the sections reflect the exploration phase, not current state

## Files That Matter

| File | What it is |
|------|-----------|
| `KNOWLEDGE.md` | **Start here.** All product knowledge, integration research, HRC workflow, architectural principles |
| `product-decisions.json` | Full OST — every decision, solution, experiment, open question with reasoning |
| `decision-journal.html` | Visual viewer for the OST (run `node decision-journal-server.js`, open localhost:3334) |
| `mockups/system-architecture.html` | Integration map diagram (10 systems) |

---

# INTENT — Client Tabs Feature

## Goal

Build a "Clients" view for the BambooHR AI consultant app with a tabbed workspace (like Figma's tab bar). The core UX problem being solved: **how does a consultant select which client they're working with?**

We're prototyping 4 different approaches to client selection, iterating each to production-ready quality, then the user will pick a winner. The feel should be fast, professional, and built for consultants who manage 5-50 clients and switch between them frequently throughout the day.

## Current Direction

**Pruned to 3 active candidates (B, C, E).** A is parked (cards may suit the dashboard better). D and F are killed. Prototype switcher shows active approaches by default with an expandable "Archived" section for parked/killed. Default view is now B (Dropdown).

**V2 Rankings:**
1. **Approach C (Sidebar)** — Best overall. Fastest switching, collapsible for space, urgency indicators, search.
2. **Approach B (Dropdown)** — Best compact option. Attention indicator is standout.
3. **Approach D (Breadcrumb)** — Best triage tool. Quick-switch dropdown fixes the fatal flaw.
4. **Approach A (Card Grid)** — Best first impression/onboarding. Mode-switch friction persists.

**Key Insight:** Overview-first approaches (A, D) are great for triage but bad for switching. Switch-first approaches (B, C) are great for daily workflow but lack overview. The production solution may need to combine elements.

## What's Done

### Infrastructure
- **Worktree**: `worktree-client-tabs` branch, based off `main`. Working dir: `/Users/mmorrell/CascadeProjects/ai_services_poc_1/.claude/worktrees/client-tabs/`
- **Dev server**: was running on `localhost:3001` (may need restart: `npm run dev`)
- **Sidebar nav**: "Clients" item added with Building2 icon (`src/components/sidebar.tsx`)
- **Tab bar**: Home tab (always present, not closeable), chat tabs (closeable, scrollable), Chrome-style "+" button adjacent to last tab — direct click creates new chat, no dropdown (`src/components/clients/client-tab-bar.tsx`)
- **Home tab**: Enriched with per-client metadata — industry, location, primary contact, employee count, urgency labels next to unread stat (`src/components/clients/client-home-tab.tsx`)
- **Floating prototype switcher**: Bottom-right pill, expands to show approach (A/B/C/D) + version (v1/v2) selector (`src/components/clients/prototype-switcher.tsx`)

### 4 Approach Prototypes (all v1 + v2 complete)
All in `src/components/clients/approaches/`:

| File | Approach | V1 | V2 Additions |
|------|----------|-----|-------------|
| `card-grid.tsx` | A: Card Grid | Full-page grid, click card → workspace, back button | Search bar, urgency sorting, red/amber borders, status labels, client-name back button |
| `dropdown-switcher.tsx` | B: Dropdown | Compact dropdown with search in tab bar area | Attention indicator on trigger, urgency sort, timestamps, wider dropdown, ⌘K hint |
| `sidebar-list.tsx` | C: Sidebar | Persistent w-56 sidebar with avatars + badges | Collapsible (w-56 → w-12), urgency dots/rings, search, tooltips, collapsed avatar mode |
| `breadcrumb-nav.tsx` | D: Breadcrumb | Breadcrumb + admin table with filter | Sortable columns, recently-viewed avatars, quick-switch dropdown on breadcrumb, hover actions |

### New Approaches (E, F)
- **Approach E (Tab Groups)** — `tab-groups.tsx`: Multi-client grouped tabs in a single bar. Each client has a colored header chip + their chat tabs inline. Color-coded backgrounds per group. Auto-selects first client/tab.
- **Approach F (Client Tabs Row)** — `client-tabs-row.tsx`: Horizontal avatar row above the tab bar. Click avatar to switch client. Urgency rings on avatars. Compact, always-visible.

### Tab Bar Architecture (Full-Width Refactor)
- **Split architecture**: `clients-view.tsx` creates `tabBar` (ClientTabBar) and `tabContent` (tab panels) as separate React nodes, passed as props to each approach
- **Full-width fix**: Wrapper div uses `min-w-0 flex-1 overflow-hidden` (no `flex`) to fill parent container. PrototypeSwitcher is `position: fixed` so it doesn't affect layout flow.
- **Sidebar hierarchy**: Approach C renders tabBar INSIDE the main content area (right of sidebar), not above the sidebar+content split. Other approaches render tabBar above their content.
- **Chrome-style + button**: Removed `flex-1` from scrollable tab area in both `client-tab-bar.tsx` and `tab-groups.tsx` — tabs and + button cluster together on the left.
- **Direct new chat**: Clicking + creates a stub tab immediately. No dropdown menu. `newChat` callback in `clients-view.tsx` generates `new-${Date.now()}` tabs.

### Orchestration
- `src/components/clients/clients-view.tsx` — Main orchestrator. 6 approaches (A-F). Manages tab state, tab persistence per client, creates tabBar + tabContent props.
- `src/app/page.tsx` — Renders `<ClientsView />` when `activeView === "clients"`

### Reviews Complete (V1 + V2)
- All approaches screenshotted via Playwright (v1 and v2)
- /personas skill run on v1 — 4 persona critiques (Hailey/Andrew/Katherine/Braxton)
- UX reviews written for both v1 and v2
- All findings documented in OBSERVATIONS.md with rankings

### Cross-Cutting Fixes Applied (V2)
- Home tab enriched with mock metadata per client (industry, employees, location, contact)
- Urgency labels ("Urgent"/"Needs attention") next to unread stat
- `suppressHydrationWarning` on time elements to fix SSR mismatch

### Tab Bar Full-Width Refactor (Post-V3)
- Split `tabWorkspace` into separate `tabBar` + `tabContent` props passed to all 6 approaches
- Fixed tab bar not spanning full content width (was stopping at ~60% in B, D)
- Fixed sidebar hierarchy in Approach C — tab bar now inside main content area, not above sidebar
- Chrome-style + button positioning — removed `flex-1` from scrollable tab area so + sits adjacent to last tab
- Replaced dropdown "New Chat" menu with direct-click + button
- Committed as `9652576`, pushed to `worktree-client-tabs`

## V3 Changes (COMPLETE)

### Cross-Cutting
- **Tab state persistence per client** — tabs stored in a Map keyed by clientId. Switching away and back preserves all open tabs + active tab. Verified working.

### Approach C v3 (Sidebar)
- Stronger active state in collapsed mode: primary-colored ring on active avatar + left border indicator
- Richer tooltips in collapsed mode: "Client Name (N unread) · M chats"
- Search filter verified working

### Approach B v3 (Dropdown)
- Increased dropdown max height (max-h-80) — all 6 clients visible without scrolling
- Added client count in footer alongside ⌘K hint

### Approaches A & D
- No visual v3 changes — v2 addressed main issues, remaining problems are structural
- Tab persistence benefits both

## Rejected / Parked Approaches
- **A (Card Grid)** — Parked. Cards metaphor is interesting but may belong on the dashboard, not as the primary client selector. Could come back combined with another idea.
- **D (Breadcrumb)** — Killed. Only one layer of breadcrumbs, so the pattern doesn't justify itself.
- **F (Client Tabs Row)** — Killed. Essentially a two-layer tab. HRCs unlikely to embrace circles for client identity.
- **Dropdown on + button** — user rejected this UX immediately ("that's just dumb"). Direct click to create tab is the correct pattern.
- The brainstorm had 10 options; 4 were never prototyped (see OBSERVATIONS.md for reasoning).

## Open Questions
- How does client selection interact with the rest of the app? (e.g., if you're in Dashboard and click a client mention, should it navigate to Clients view for that client?)
- The user hasn't yet decided which approach to go with — that's the whole point of this exercise.
- Chat view is still a stub ("Chat view coming soon") — what does the real chat UI look like?

## Next Steps
1. **Narrow to a winner** — 3 active candidates: B (Dropdown), C (Sidebar), E (Tab Groups). Iterate further or pick.
2. **Merge winning approach** — strip the prototype switcher + unused approaches, ship clean.
3. **Build out chat view** — currently stub ("Chat view coming soon"). Wire up real chat UI.
4. **Consider hybrid** — e.g., A's card grid on dashboard + C's sidebar for client workspace.

---

# SIDEQUEST — Product Decision Journal & Design Tooling

This section is separate from the Client Tabs feature above. It tracks a meta-project: building tools that make Claude Code design work legible, transferable, and traceable.

## Goal

Two problems to solve for designers working in Claude Code:
1. **No visual canvas** — In Figma you can see all artboards, branches, and iterations at a glance. In CC there's no equivalent. You can't see what screens exist, what was tried, what was abandoned.
2. **No institutional memory** — When a designer takes over a project, there's no artifact that captures why things are the way they are. The previous designer might not be around to explain.

The vision: any designer should be able to pick up a CC project and (a) see the full landscape of what's been explored via a visual artifact, and (b) ask Claude questions about any decision and get answers.

## Current Direction

**Two separate tools, not one:**
- **Tool 1: Design Iteration Tracker** — tracks branching tree of ideas during active design (the "workbench"). Already exists as `decision-tree.html` + `decision-tree-data.json`. Captures what's active, parked, rejected, spawned-from.
- **Tool 2: Product Decision Journal** — living record of the full product discovery process structured as an OST (the "archive/handoff artifact"). New file: `product-decisions.json` + `decision-journal.html` viewer.

Tool 1 feeds into Tool 2. The iteration tracker captures real-time exploration; that exploration gets distilled into the decision journal.

## What's Done

### Product Decision Journal (Tool 2) — v1 + UX Polish
- **`product-decisions.json`** — Structured as an Opportunity Solution Tree: outcomes, opportunities, solutions, experiments, decisions, open questions. Each node has id, title, status, reasoning, date, parentId, relatedIds, evidence[]. Seeded with the full brainstorm about how to build this tool (meta!).
- **`decision-journal.html`** — 4-view standalone HTML viewer served from `localhost:3333`:
  - **Tree view** (primary): OST hierarchy grouped by opportunity. Opportunities are collapsible sections with solutions nested underneath. Active/exploring items get colored left borders + emphasis. Experiments auto-collapsed. Status dropdown filter + "Active only" toggle.
  - **Graph view**: Node-and-edge diagram via dagre + d3. Zoomable/pannable. Hover tooltips. Click to jump to tree detail.
  - **Timeline view**: Chronological vertical timeline grouped by date.
  - **Reader view**: Full content, section by section.
- **CLAUDE.md updated** with instructions for Claude to read/maintain the journal across sessions.

### Tree View UX Polish (v2 iteration)
- **Removed visual noise**: Node IDs (OP1, S2, etc.) removed, section counts removed, titles wrap instead of truncating
- **Type labels on every node**: Each item shows a colored uppercase label (OUTCOME, OPPORTUNITY, SOLUTION, DECISION, QUESTION) above its title — essential for scannability now that color coding is subtle
- **Type-specific selection colors**: Selected outcome = green tint, opportunity = blue, solution = purple, decision = cyan, question = pink — matches each node's type color
- **Filter chips → dropdown**: Replaced 6 individual colored status filter chips with a single compact "All statuses" dropdown on the right. Active only toggle moved to the left. Much less visual noise.
- **Underline tabs**: Replaced pill-style view tabs with clean underline tabs (Tree, Graph, Timeline, Reader). No secondary description text.
- **Timestamp with local time**: Header shows "2026-02-23 · 4:16 PM" in subdued grey
- **Font size bump**: Minimum font is now 11px (was 8px). Full scale: 11→12→13→14→15→18px. Readable at 100% zoom.
- **Right-aligned status pills**: All status badges (ACTIVE, CHOSEN, etc.) pushed to right edge of tree panel
- **Smart default collapse**: Cross-cutting Solutions, Decisions, and Open Questions start collapsed. Primary content (Outcome → Opportunities → Solutions) is immediately visible.
- **Brighter selected state**: Selected items clearly distinguishable from emphasis (active) items
- **Improved contrast**: All grey text bumped lighter, dividers more visible (#2d2d3a)

### Tree View UX Polish (v3 iteration — current session)
- **Resizable tree panel**: Drag handle between tree and detail panels. Highlights blue on hover/drag. Min 240px tree, min 200px detail.
- **Detail header restructured**: Type badge + title on the left, plain status text on the far right. Eliminates confusion between type badge and status badge (they looked identical as adjacent pills).
- **Detail text brightened**: Reasoning and evidence text bumped to near-white (#e4e4e7). Attribution bumped from #8b8b95 to #b4b4bc.
- **Bold only on selection**: Tree node titles and opportunity titles are normal weight by default, only bolded when selected.
- **Outcome collapse moved to node**: "OUTCOME" label is now static (no chevron). The outcome node itself has a collapsible chevron — clicking it collapses all children. Clicking elsewhere selects it for detail view.
- **Hierarchy indentation**: Opportunities indent under outcomes, solutions indent under opportunities, experiments under solutions. Indent step is 28px. Opportunity caret aligns with outcome text block left edge.
- **Ancestor lineage highlighting**: When you select a child node, its parent chain (opportunity, outcome) gets a subtle left border in their type color. Communicates "you're looking at something inside this branch." Only appears on selection — not static.
- **Removed static left-border indicators**: The always-on colored left borders on active/emphasis nodes were removed. They were redundant with status badges and added visual noise without clear meaning.
- **No outcome dot**: Outcomes don't get the colored circle — they're top-level and don't need it.
- **Active only on by default**: Toggle starts enabled so you see the working set immediately.
- **Removed connections section**: The parent/child/related links in the detail panel were removed — redundant with the tree navigation.
- **Horizontal card grid for children**: When you select an opportunity, active solution cards appear in a horizontal grid in the detail panel. When you select a solution, active experiment cards appear. Cards show title, status badge, and full reasoning. Click a card to select that node.

### Architecture Redesign — IMPLEMENTED (v4)

**The Problem:** The left panel was trying to be two things — a full hierarchical map AND a navigation tool. A 4-level deep tree (outcome → opportunity → solution → experiment) is hard to scan and requires too much expand/collapse management. Solutions appeared in two places (tree AND cards), creating routing confusion.

**The Solution: "Shallow tree + detail does the drill-down" (Option A)**

Left panel only shows outcomes and opportunities — nothing deeper. Detail panel handles drill-down:
- Select an **outcome** → reasoning + opportunity cards + cross-cutting solution cards
- Select an **opportunity** → reasoning + solution cards
- Click a **solution card** → reasoning + experiment cards (via `drillToNode`)
- Click an **experiment card** → reasoning (leaf node, via `drillToNode`)

Key implementation:
- `detailNodeId` (separate from `selectedNodeId`) tracks detail panel state during drill-down
- `selectNode(id)` for tree-level clicks, `drillToNode(id)` for card clicks (walks up to nearest tree ancestor)
- Breadcrumb: clickable ancestor chain at top of detail panel, color-coded by type
- Decisions and open questions: collapsible sections at bottom of tree (start collapsed)
- Cross-cutting solutions (parentId → outcome, not opportunity) get their own card section

### v4 Polish (current session)
- **Detail header**: Type label ("OPPORTUNITY") moved above title as plain grey text, no pill. Cleaner hierarchy.
- **Rich child cards**: Solution/experiment cards now show ALL available detail — reasoning, evidence quotes, artifact links, open items. Not just a title + summary.
- **Card body copy**: Bumped from 12px to 14px for readability.
- **Redundant type labels removed**: Decisions and questions hide per-node type labels (section header already says it). Outcomes hide type labels too. Opportunities keep theirs for scannability.
- **Open questions exempt from Active Only**: They have no status field — they're always visible, never filtered.
- **Second outcome added**: "BHR consultants can work as fast as they think" (O2). OP3 (client workspaces) re-parented under it. Previously everything was under O1 (design tooling), which was wrong — the consultant app UX is a different project concern.

### UX Critique (honest assessment of current state)

**What works:**
- Shallow tree is a genuine win — 4-6 items in left panel, trivially scannable
- Breadcrumb navigation is natural, never feel lost
- Rich cards with evidence are the right call for handoff — scan a page, get the picture
- Active Only toggle keeps the working set clean

**What doesn't work yet:**
1. **Read-only** — biggest gap. Can't add decisions, update status, or capture experiments from the UI. Claude or hand-editing JSON are the only write paths. Needs inline editing to be a living tool.
2. **Decisions and open questions are buried** — collapsed at bottom, out of sight by default. These are arguably the most important sections (forks and unknowns). Need more prominence.
3. **No recency signal** — everything looks the same age. No "recently updated" indicator, no way to see what changed since last visit.
4. **Cards are navigation AND detail** — they show full reasoning + evidence + artifacts, which is great for reading, but the "click to drill deeper" affordance gets lost in the wall of text. Could benefit from compact-by-default with expand.
5. **No search** — fine now with ~25 nodes, won't scale.
6. **Graph and Reader views are half-baked** — Tree is 90% of usage. Consider hiding Graph and Reader for v1 sharing.

### Distribution Strategy (BUILT)

**GitHub repo:** https://github.com/mattcmorrell/product-decision-journal

**Architecture:**
```
GitHub repo (mattcmorrell/product-decision-journal):
├── decision-journal.html         ← viewer (fetched fresh each /journal run)
├── decision-journal-server.js    ← server with SSE live-reload (fetched fresh)
├── template.json                 ← empty schema for new projects
├── journal.md                    ← the slash command itself
└── README.md                     ← setup instructions

Designer's machine:
~/.claude/commands/journal.md     ← one-time install via curl

Any project after running /journal:
├── product-decisions.json        ← project-specific data (Claude maintains)
├── decision-journal.html         ← pulled from GitHub
├── decision-journal-server.js    ← pulled from GitHub
└── CLAUDE.md                     ← auto-start + auto-update instructions appended
```

**How it works:**
1. Designer installs once: `mkdir -p ~/.claude/commands && curl -sL https://raw.githubusercontent.com/mattcmorrell/product-decision-journal/main/journal.md -o ~/.claude/commands/journal.md`
2. In any project, type `/journal`
3. First run: pulls HTML + server from GitHub, creates `product-decisions.json`, scans git history for past decisions (presents top 10 for curation), appends auto-start instructions to project CLAUDE.md, starts server
4. Subsequent runs: pulls latest HTML + server, starts server
5. Future sessions: Claude auto-starts server (reads project CLAUDE.md instruction) — no `/journal` needed

**Key features:**
- **SSE live-reload**: Server watches `product-decisions.json` via `fs.watchFile`, pushes reload events to browser. Changes appear instantly.
- **Git history scanner**: On first run, scans last 50 commits + merged PRs + INTENT.md/README for past decisions. Presents numbered list, user picks which to import.
- **Auto-start via project CLAUDE.md**: `/journal` appends instructions to the project's CLAUDE.md. Any future Claude session auto-starts the server and maintains the journal. Zero per-user config after first designer runs `/journal`.
- **Always latest viewer**: HTML + server fetched from GitHub on every `/journal` run. Push an update to the repo, everyone gets it.
- **Port 3334**: Separate from iteration tracker (port 3333). Graceful exit if port already in use.

**Remaining polish (not blocking sharing):**
1. Clean up `product-decisions.json` reasoning — write for an audience that wasn't in the room
2. Consider hiding Graph and Reader tabs for v1
3. Optional: small "What is this?" blurb for designers landing cold

### Key Decisions Made
1. **Two separate tools** — workbench (iteration tracker) vs archive (decision journal). Different audiences, different timescales. Must stay separate files/schemas.
2. **Claude auto-maintains the journal via implicit capture** — "AI meeting notes" model. Claude watches for decision moments and logs them. Explicit `/decision` command also available as supplement.
3. **Notion is the collaboration path, but not v1** — Notion MCP has full read/write (22 tools). Free plan works for solo + 10 guests. Deferred because collab isn't a v1 requirement. Architecture should point toward it.
4. **The ideal end-state is FigJam OST with Claude read/write** — currently blocked by FigJam MCP being read-only. Every intermediate solution is a stepping stone.
5. **Local JSON + standalone HTML viewer for v1** — proven pattern from the iteration tracker. Zero dependencies. Claude reads/writes JSON natively.

### Rejected Approaches for Tool 2
- **Spreadsheet** — not queryable conversationally, not visual, flat
- **Obsidian vault** — hairball graph, extra dependency
- **Single markdown file** — too unstructured for reliable querying
- **SQLite** — overkill, invisible without a viewer
- **Git-native** — commit messages are garbage, only works retroactively

### Deferred for Later
- **Notion sync** — local JSON ↔ Notion database. Enables real-time collaboration for the trio.
- **Hybrid FigJam sync** — Claude reads trio's FigJam OST, merges with local journal. "Janky but interesting."
- **Auto-capture hooks** — post-session hook where Claude reviews what happened and proposes journal entries.
- **Graph viewer as full spatial canvas** — node-and-edge with pan/zoom, dead ends grayed out, like a Figma canvas.

## Files Owned by This Sidequest
- `decision-tree.html`, `decision-tree-data.json`, `decision-tree-server.js` — Design Iteration Tracker (Tool 1)
- `product-decisions.json`, `decision-journal.html` — Product Decision Journal (Tool 2)
- `SIDEQUEST.md` — Original sidequest brief

## Open Questions
- What are the exact heuristics for implicit decision capture?
- When/how to introduce Notion sync?
- How does the trio's existing OST practice (if any) integrate?
- Scaling story: how to make this adoptable across the org?

## Next Steps
1. Continue refining the tree view UX (primary working view)
2. Add inline editing to the decision journal (proven pattern from iteration tracker)
3. Test the "ask Claude about decisions" workflow — can Claude answer handoff questions from the JSON?
4. Consider building a `/decision` slash command for explicit capture

---

# WORKSTREAM 3 — Decision Tree Gallery View & Visual Polish

## Goal

Make the design iteration tracker (`decision-tree.html`) visually compelling and useful for someone stepping into the project cold. The original list-only view shows names and statuses but doesn't convey what any approach actually looks like.

## Current Direction

Gallery view is live. All approaches now have screenshot thumbnails. User wants this to evolve into a proper "design decision history" tool (see SIDEQUEST.md for full brief handed to a sidequest session).

## What's Done

### Gallery View (v5) — COMPLETE
- **Gallery layout**: Responsive card grid with screenshot thumbnails as hero images. Each card shows the approach's latest screenshot at `aspect-ratio: 16/10`, `object-fit: cover`. Status dot, ID badge, name, version, status pill, note, and links below.
- **List/Gallery toggle**: Segmented control `[List] [Gallery]` in controls bar. Defaults to Gallery. List view preserves the original compact row layout exactly.
- **Lightbox**: Clicking a thumbnail opens a fullscreen overlay with the image, caption ("Card Grid — v2 Grid"), left/right arrow navigation, and dot indicators. Arrow keys + Esc work. Multiple screenshots per approach are navigable.
- **Screenshot data in JSON**: Each node now has optional `thumbnail` (string, filename for gallery card) and `screenshots` (array of `{src, label}` for lightbox navigation). Schema is backward-compatible — nodes without these fields show a placeholder.
- **Placeholders**: Nodes without screenshots show the approach ID in large monospace text + "No screenshot yet" hint. Only F (Client Tabs Row) still has no screenshot (needs dev server running).
- **Bug fix**: `lbNav()` was using implicit `event` global — fixed to accept `(dir, e)` parameter.

### Screenshots Captured
- **Approaches A-D**: Already had prototype screenshots from earlier sessions (approach-a-v1-grid.png, etc.)
- **Mockups 5-10**: Newly screenshotted from the HTML mockup files served via port 3333:
  - `mockup-05-command-palette.png` — Command Palette
  - `mockup-06-floating-pill.png` — Floating Pill
  - `mockup-07-tab-groups.png` — Tab Groups
  - `mockup-08-sliding-drawer.png` — Sliding Drawer
  - `mockup-09-recent-favorites.png` — Recent + Favorites Bar
  - `mockup-10-avatar-row.png` — Avatar Row
- **Missing**: F (Client Tabs Row) — needs `npm run dev` on port 3001 to capture

### Font Size Bump — COMPLETE
All font sizes increased across the entire decision tree UI. Nothing is below 12px anymore:
- Title: 20→28px, subtitle: 13→16px
- Stats bar: 12→14px, counts: 13→15px, dots: 7→9px
- Filter hint: 11→14px
- View toggle buttons: 12→14px, toggle label: 12→14px
- Section labels: 10→13px
- Card names: 13→16px (list), 14→17px (gallery)
- Card IDs: 10→13px, versions: 10→13px, status badges: 10→12px
- Card notes: 11→14px (list), 12→14px (gallery)
- Card links: 10→13px
- Spawn tags: 10→13px
- Lightbox caption: 13→16px
- Keyboard hints: 11→13px, kbd codes: 10→12px
- Save indicator: 12→14px
- Gallery shot count: 10→13px, placeholder ID: 32→40px, placeholder hint: 10→13px

### Commits
- `48f721d` — Add gallery view with screenshot thumbnails to decision tree
- Font size bump not yet committed

## Running Services
- **Decision tree server**: `node decision-tree-server.js` on **port 3333** — serves `decision-tree.html`, `decision-tree-data.json`, all PNG screenshots, mockup HTML files. Has POST `/save` endpoint for auto-save.
- **Next.js dev server**: NOT running (was on port 3001). Needed for live prototype screenshots.

## Files Owned by This Workstream
- `decision-tree.html` — The interactive UI
- `decision-tree-data.json` — The data store
- `decision-tree-server.js` — The Node server
- `mockup-*.png` — Newly captured mockup screenshots
- `decision-tree-v5-*.png` — Screenshot artifacts of the tree itself

## Sidequest Running
A separate Claude Code session was launched (via `/sidequest`) to evolve the decision tree into a **design decision history tool**. That session has its own brief in `SIDEQUEST.md`. Its scope: add reasoning capture, timeline/narrative, evidence links, decision moments, onboarding flow. It owns the same decision-tree files but is focused on the "why" layer, not the visual gallery.

## Next Steps
1. **Commit font size bump** — ready to go
2. **Capture F screenshot** — start dev server, screenshot Client Tabs Row approach
3. **Sidequest progress** — check what the design decision history session produced
4. **Consider merging gallery + decision history features** — the sidequest may have evolved the HTML/JSON in parallel

---

# INTENT — Visual Design Exploration

## Goal
Explore multiple visual design variants for the BambooHR consultant app. Each variant is a complete set of 3 files (dashboard-view, chat-list-panel, chat-view) that can be swapped via a floating toggle. The aim is to find the perfect aesthetic direction — warm, professional, and distinctive — before committing to a final design system.

## Current Direction
Building and comparing design variants side-by-side in the browser using a floating pill toggle (bottom-right corner). Each variant has a distinct aesthetic personality. Using the `/frontend-design` skill for high-quality, non-generic designs.

## What's Done
13 variants created and wired into the toggle system:

| Variant | Name | Mode | Accent | Fonts | Vibe |
|---------|------|------|--------|-------|------|
| OG | Original | Dark | Blue | System | Default shadcn |
| V1 | Bold & Classy | Dark | Gold/Amber | — | Luxury dark |
| V2 | Brutalist Industrial | Dark | Red | Monospace | Terminal/raw |
| V3 | Soft Editorial | Light | Warm tones | Serif | Magazine |
| V4 | Swiss Typography | Light | Red/Black | Sans | Poster |
| V5 | Liquid Glass | Dark | Glass | — | Frosted on black |
| V6 | Cyberpunk Neon City | Dark | Cyan/Magenta | — | Neon noir |
| V7 | Zen Garden | Light | Sage green | — | Calming (contrast fixed) |
| V8 | Obsidian & Champagne | Dark | Champagne gold | Playfair Display + Plus Jakarta Sans | Warm luxury |
| V9 | Soft Studio | Light | Dusty violet | Fraunces + Outfit | Pillowy lavender |
| V10 | Paper & Ink | Light | Salmon coral | Spectral + Karla | Notebook/ruled |
| V11 | Midnight Editorial | Dark | Burnt orange | Newsreader + Satoshi | Bloomberg meets Conde Nast |

Toggle system in `page.tsx`: `VARIANTS` array, `variantMap` object, `designVariant` state, floating toggle UI.

## Rejected Approaches
- V7 initially had poor contrast on the chats page — fixed by darkening all text colors significantly.

## Open Questions
- Which variant(s) to move forward with as the final design?
- Any more aesthetic directions to explore?
- When to stop exploring and commit to a direction?

## To-Do
- [ ] **Finish visual design exploration** — continue trying new variants or refining existing ones until we're ready to pick a winner

## Next Steps
- User to review all 13 variants in browser and identify favorites
- Potentially create more variants or refine top picks
- Eventually select a final design direction and remove the toggle system

---

# INTENT — Persistent Plan Panel

## Goal
HRCs need to see plan progress AND chat simultaneously. Currently ActionCard renders inline in chat and scrolls out of view. Building 3 mockup approaches (switchable via prototype switcher) to find the right UX pattern.

**User requirements:**
- Tiered visibility: milestones in chat, agent thinking expandable, everything auditable
- Auto + toggle: panel auto-appears on plan creation/execution, HRC can collapse
- Pause/stop/edit: HRC controls over running plans, gates on non-undoable actions (payroll)
- Plan history: mostly hidden, accessible as archive
- Cross-client: plans keep running when switching clients

## Current Direction
Three approaches built and wired into v5 design variant, switchable via Plan A/B/C toggle (bottom-right, above design variant toggle).

## What's Done

### Type changes (`src/types/chat.ts`)
- Added `"paused" | "stopped"` to `ActionPlan.status`
- Added `nonUndoable`, `completedAt`, `thinkingLog` to `ActionPlanStep`
- Added `pausedAt`, `pausedBy` to `ActionPlan`

### Shared components (`src/components/plan/`)
- `plan-step-timeline.tsx` — Reusable step list with progress bar, expandable thinking per step, non-undoable gate markers. Supports compact mode.
- `plan-controls.tsx` — Pause/Stop/Resume button group + `PlanStatusBadge` component. Compact mode for tight spaces.
- `plan-history.tsx` — Past plans list with status icons and summaries.

### Approach A: Right Rail (`plan-panel.tsx`)
- 420px resizable panel (320-600px) to right of chat, modeled on ArtifactPanel
- Header with plan title + status badge, close button
- Body with description, metadata stats, step timeline with expandable thinking
- Footer with pause/stop/resume controls + past plans toggle
- Collapsed state: floating pill at right edge with progress ring + step count
- Chat shows `ActionCardCompact` ("View in panel →") when panel is open

### Approach B: Sticky Dock (`plan-dock.tsx`)
- Collapsible bar pinned above chat messages, below header
- Collapsed (60px): status dot + title + active step + mini progress bar + controls + expand chevron
- Expanded: compact step list + agent log flyout + completion summary
- Zero horizontal space cost

### Approach C: Split View (`plan-split-view.tsx`)
- ChatView splits into two resizable panes internally
- Left: chat (relaxed max-width), Right: plan content (300-500px, default 380px)
- Resize handle between panes
- When no plan active, split doesn't exist

### State management (`page.tsx`)
- `planPanelOpen` + `planApproach` state
- `activePlanForChat` derived from current chat's messages
- Auto-open on plan execution start
- Pause/stop/resume handlers that update plan status in chat messages
- Plan approach switcher (A/B/C) in bottom-right, above design variant toggle, only visible on v5

### Mock data enhancements (`mock-data.ts`)
- Payroll plan steps enriched with `thinkingLog` arrays (agent reasoning per step)
- Steps 3-4 marked as `nonUndoable` (ACH transfers, tax filing)

### Build verification
- TypeScript: clean (`npx tsc --noEmit` passes)
- Next.js: production build succeeds

## How to Test
1. `npm run dev` in `/Users/mmorrell/CascadeProjects/ai_services_poc_1`
2. Select V5 design variant (bottom-right toggle)
3. Select a plan approach (A/B/C) from the Plan toggle above the variant toggle
4. Navigate to "January Payroll" chat (Black Mesa)
5. Click "Approve" on the payroll plan
6. Plan panel/dock/split should appear automatically
7. Test Pause/Stop/Resume controls
8. Collapse and re-expand (Approach A pill, Approach B chevron)
9. Click step thinking expandables to see agent reasoning

## Open Questions
- Which approach feels best for HRCs managing multiple clients simultaneously?
- Should the dock (B) auto-expand on step completions / non-undoable gates?
- How should Approach C interact with ArtifactPanel / WorkflowPanel?
- Cross-client persistence: when switching clients, should the plan panel stay for the previous client's plan?

## Next Steps
1. User reviews all 3 approaches in browser
2. Iterate on winner(s) based on feedback
3. Add non-undoable step gate UI (confirmation modal before proceeding)
4. Add cross-client plan indicators on home/client screens
5. Plan history populated with completed plans
