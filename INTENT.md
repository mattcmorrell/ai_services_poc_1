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
