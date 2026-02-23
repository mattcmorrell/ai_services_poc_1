# INTENT — Client Tabs Feature

## Goal

Build a "Clients" view for the BambooHR AI consultant app with a tabbed workspace (like Figma's tab bar). The core UX problem being solved: **how does a consultant select which client they're working with?**

We're prototyping 4 different approaches to client selection, iterating each to production-ready quality, then the user will pick a winner. The feel should be fast, professional, and built for consultants who manage 5-50 clients and switch between them frequently throughout the day.

## Current Direction

**V3 of all 4 approaches is complete.** All built, screenshotted, UX-reviewed, and ranked. Ready for the user to pick a winner.

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
- **Tab bar**: Home tab (always present, not closeable), chat tabs (closeable, scrollable), "+" button with "New Chat" + unopened chats dropdown (`src/components/clients/client-tab-bar.tsx`)
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

### Orchestration
- `src/components/clients/clients-view.tsx` — Main orchestrator. APPROACHES array has `maxVersion: 2` for all.
- `src/app/page.tsx` — Renders `<ClientsView />` when `activeView === "clients"`

### Reviews Complete (V1 + V2)
- All approaches screenshotted via Playwright (v1 and v2)
- /personas skill run on v1 — 4 persona critiques (Hailey/Andrew/Katherine/Braxton)
- UX reviews written for both v1 and v2
- All findings documented in OBSERVATIONS.md with rankings

### Cross-Cutting Fixes Applied (V2)
- Home tab enriched with mock metadata per client (industry, employees, location, contact)
- Urgency labels ("Urgent"/"Needs attention") next to unread stat
- "New Chat" option added to tab bar "+" dropdown
- `suppressHydrationWarning` on time elements to fix SSR mismatch

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

## Rejected Approaches
- None rejected by user — all 4 approaches are active candidates.
- The brainstorm had 10 options; 6 were not prototyped (see OBSERVATIONS.md for reasoning).

## Open Questions
- How does client selection interact with the rest of the app? (e.g., if you're in Dashboard and click a client mention, should it navigate to Clients view for that client?)
- Should tab state persist across client switches? (Persona feedback says yes — planned for v3)
- The user hasn't yet decided which approach to go with — that's the whole point of this exercise.

## Next Steps
1. **User picks a winner** — all 4 approaches at v3, production-ready. See OBSERVATIONS.md for final rankings + recommendation.
2. **Merge winning approach** — strip the prototype switcher + unused approaches, ship clean.
3. **Build out chat view** — currently stub ("Chat view coming soon"). Wire up real chat UI.
4. **Consider hybrid** — if user wants, combine C (sidebar) with D (table view) for a triage mode.

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

### Product Decision Journal (Tool 2) — v1
- **`product-decisions.json`** — Structured as an Opportunity Solution Tree: outcomes, opportunities, solutions, experiments, decisions, open questions. Each node has id, title, status, reasoning, date, parentId, relatedIds, evidence[]. Seeded with the full brainstorm about how to build this tool (meta!).
- **`decision-journal.html`** — 4-view standalone HTML viewer served from `localhost:3333`:
  - **Tree view** (primary): OST hierarchy grouped by opportunity. Opportunities are collapsible sections with solutions nested underneath. Active/exploring items get colored left borders + emphasis. Experiments auto-collapsed. Status filter chips + "Active only" toggle.
  - **Graph view**: Node-and-edge diagram via dagre + d3. Zoomable/pannable. Hover tooltips. Click to jump to tree detail.
  - **Timeline view**: Chronological vertical timeline grouped by date.
  - **Reader view**: Full content, section by section.
- **CLAUDE.md updated** with instructions for Claude to read/maintain the journal across sessions.

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
