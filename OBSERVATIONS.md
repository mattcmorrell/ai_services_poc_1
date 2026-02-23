# Client Selection UX — Observations & Discoveries

## Brainstorm: 10 Approaches to Client Selection

The problem: when a user navigates to the "Clients" tab, they need a way to select which client's workspace they're viewing. Currently hardcoded to Black Mesa. How should this selection work?

### 1. Client Cards Grid ("Home Screen")
A grid of client cards shown as the default landing. Each card shows name, unread count, last activity. Click a card to enter that client's tabbed workspace. Back button returns to the grid. **Familiar pattern from Figma, Notion, Linear.**

### 2. Tab Bar Dropdown ("Compact Switcher")
Client name shown inline in the tab bar, left of the Home tab. Click to open a dropdown with all clients. Dropdown shows names, unread badges, and search. Selecting switches the entire workspace. **Compact, always accessible, no mode change.**

### 3. Sidebar Client List ("Split Pane")
A narrow sidebar within the Clients view showing all clients as a persistent list. Always visible alongside the tab workspace. Click a client to switch. Current client is highlighted. **Like VS Code's file explorer or Slack's channel list.**

### 4. Breadcrumb Navigation ("Hierarchy")
A breadcrumb bar at the top: "All Clients > Black Mesa". Click "All Clients" to go back to a list/grid view. Provides clear spatial hierarchy. **Familiar from file managers and admin panels.**

### 5. Command Palette ("Keyboard First")
Cmd+K or search bar to find and switch clients. No persistent UI — triggered on demand. Fast for power users. **Like VS Code, Raycast, Linear.**

### 6. Floating Client Pill ("Ambient Switcher")
A floating pill in the corner showing current client avatar + name. Click to open a popover with full client list. Unobtrusive but always available. **Novel but potentially hidden.**

### 7. Tab Groups ("Multi-Client Tabs")
Multiple clients' tabs can be open simultaneously, grouped by client with visual headers/separators. No explicit "selection" — just open the tabs you need. **Like Chrome tab groups or Arc spaces.**

### 8. Sliding Drawer ("Progressive Disclosure")
A drawer that slides in from the left when triggered (hamburger menu or swipe). Shows full client list with details. Dismisses after selection. **Common in mobile-first UIs.**

### 9. Recent + Favorites Bar ("Quick Access")
A horizontal bar of recent and pinned/favorite client avatars above the tab bar. One click to switch. Overflow into a "more" dropdown. **Fast for repeat users with a small active client set.**

### 10. Avatar Row ("Visual Switcher")
A row of client initials/avatars directly in the tab bar as the leftmost elements. Click an avatar to switch contexts. Active client is highlighted. **Very compact, works well for <10 clients.**

---

## Top 4 Selected for Prototyping

| Approach | Name | Why Selected |
|----------|------|-------------|
| **A** | Client Cards Grid | Most visual, familiar "home" metaphor (Figma-like). Great for onboarding. Clear separation between "browsing" and "working". |
| **B** | Tab Bar Dropdown | Most compact, no mode switching. Stays in the workflow. Good for users who already know their clients. |
| **C** | Sidebar Client List | Persistent visibility, no hidden state. Best for multi-client workflows where you switch often. |
| **D** | Breadcrumb Navigation | Clearest hierarchy/wayfinding. Familiar from admin tools. Combines well with other patterns. |

### Why not the others?
- **Command Palette (#5)**: Great as a supplement but too hidden as primary selection.
- **Floating Pill (#6)**: Too novel/hidden for primary navigation.
- **Tab Groups (#7)**: Interesting but complex to implement and cognitively heavy.
- **Sliding Drawer (#8)**: Feels mobile-first, heavy for desktop.
- **Recent Bar (#9)**: Good as enhancement, not strong enough as primary.
- **Avatar Row (#10)**: Scales poorly, lacks context.

---

## Approach A: Client Cards Grid

### V1 — UX Review

**My observations:**
- Cards render well at 6 clients but will need scrolling at ~12+. No sorting or filtering on the grid itself.
- The "← All Clients" back button works but creates a mode-switch: you leave the workspace entirely to see the grid. Every client switch is a round-trip.
- Card hover states are clean. Badge positioning (top-right of card) is clear.
- Cards don't indicate urgency — "4 unread" and "0 unread" get equal visual weight beyond the badge. No color coding by status.
- The workspace transition is abrupt — no animation or breadcrumb trail showing where you came from.

**Persona feedback (summary):**
- Katherine: "4+ clicks round-trip to switch clients. No." — too many clicks for frequent switchers.
- Andrew: "Breaks at 35 clients. No sorting, no filtering on the grid." — scalability concern.
- Hailey: Appreciates the overview but wants urgency indicators on cards.

**V2 plan:**
1. Add search/filter bar to the card grid
2. Sort cards: urgent/unread first, then alphabetical
3. Add urgency color accent to cards with high unread counts
4. Add subtle status bar on each card (green=all good, amber=needs attention, red=urgent)
5. Smoother transition animation when entering workspace

### V1 — Personas Verdict: **Triage is good, daily switching is bad**

---

## Approach B: Tab Bar Dropdown

### V1 — UX Review

**My observations:**
- The dropdown is compact and always accessible. "Black Mesa ▾" in the tab bar is clean.
- Auto-selects a client on load — good default behavior.
- Dropdown has search, which is critical for scale.
- Two stacked bars (client selector + tab bar) creates some visual density at the top. Works but tight.
- The dropdown opens below the trigger — could overlap with tab bar content on smaller screens.
- No "overview" mode — you can't see all clients' status at a glance without opening the dropdown.

**Persona feedback (summary):**
- Andrew: "Dropdown with search is exactly what you'd want at scale." Wants smart defaults (most recent? most urgent?).
- Katherine: "6 clicks with keyboard acceleration. Workable." — not the fastest but functional.
- Hailey: Misses the triage overview — can't see who needs attention without opening dropdown.

**V2 plan:**
1. Add unread badges visible in the dropdown rows (already there, keep them)
2. Sort dropdown: most recent activity first, with unread pinned to top
3. Add keyboard shortcut hint in the dropdown (Cmd+K to search)
4. Show a subtle "3 clients need attention" indicator next to the dropdown trigger
5. Widen dropdown slightly and add last-activity timestamps to each row

### V1 — Personas Verdict: **Best for power users, lacks overview**

---

## Approach C: Sidebar Client List

### V1 — UX Review

**My observations:**
- Strongest for daily switching: 1 click to change clients. Sidebar is always visible.
- "Tyrell Corporati..." truncation is a real problem — long client names get cut off.
- The sidebar + global sidebar creates a "double sidebar" effect (64px + 224px = 288px eaten). Content area feels narrower.
- Client avatars and unread badges are clear and scannable.
- Blue highlight on active client is clear. Left border accent is a nice touch.
- The search icon is visible but untapped — no actual search UI yet.
- No indication of client urgency or priority in the sidebar rows.

**Persona feedback (summary):**
- Katherine: "2 clicks round-trip. Best." — wins on switching speed.
- Andrew: Concerned about horizontal space consumption.
- Braxton: "Feels like client folders visible on their desk." — good mental model.
- Hailey: Wants collapsibility and urgency indicators.

**V2 plan:**
1. Add collapsible sidebar (toggle button, collapse to just avatars at ~40px)
2. Fix truncation — add tooltips on hover for long names
3. Wire up search functionality (filter as you type)
4. Add subtle urgency dot (amber/red) next to clients that need attention
5. Consider a "collapsed" mode showing just avatars + unread badges

### V1 — Personas Verdict: **Daily workflow winner, needs space optimization**

---

## Approach D: Breadcrumb Navigation

### V1 — UX Review

**My observations:**
- The table/list view is the most data-rich: Client name, Active Chats, Unread, Last Activity. Excellent for triage.
- Breadcrumb is clear and familiar. "All Clients > Black Mesa" is unambiguous.
- Filter input works for finding clients by name.
- Same problem as Approach A: switching clients requires going back to the table, finding, clicking. Round-trip.
- The breadcrumb bar + tab bar creates 2 rows of navigation chrome at the top — that's a lot of header.
- Table rows are well-spaced and scannable. Column headers are clear.
- Table is alphabetically sorted — could benefit from sort-by-column.

**Persona feedback (summary):**
- Hailey: "Table view is quite nice for morning triage." Wants sortable columns.
- Andrew: "Table gives data I can act on. That's a dashboard, not just a picker."
- Katherine: "Same as A — too many clicks." — poor for frequent switching.

**V2 plan:**
1. Add sortable columns (click header to sort by unread, activity, etc.)
2. Combine breadcrumb and tab bar into a single row to reduce vertical chrome
3. Add a quick-switch dropdown to the breadcrumb itself (click client name to get a dropdown, avoiding full table navigation)
4. Add row-hover actions (e.g., "Open" button that appears on hover)
5. Consider adding a "Recently Viewed" section above the table

### V1 — Personas Verdict: **Best triage/overview tool, worst for switching speed**

---

## Cross-Cutting Issues (All Approaches)

1. **Home tab is too sparse.** "BambooHR Client" is generic. Needs: industry, employee count, primary contact, urgency summary.
2. **Tab state resets on client switch.** If you're in Black Mesa's payroll tab and switch to Aperture, your tabs reset when you come back. Needs tab persistence per client.
3. **No "New Chat" action.** The "+" menu only shows existing unopened chats. Need a "Start New Chat" option.
4. **Employees stat is a dash (—).** Looks broken, not intentional. Use realistic placeholder data.
5. **No urgency/priority signals.** Unread count != urgency. Need visual severity indicators.

---

## Key Insight

The approaches divide into two camps:
- **Overview-first** (A, D): Great for triage, bad for frequent switching
- **Switch-first** (B, C): Great for daily workflow, bad for overview

The production solution may need to **combine** elements: a compact always-available switcher (B or C) with access to a richer overview/triage view (A or D) when needed.

---

## V2 Review (All Approaches)

### Cross-Cutting Fixes Applied
- **Home tab enriched**: Industry, location, primary contact, employee count (mock data per client). Urgency label ("Urgent"/"Needs attention") next to unread stat. No more dash for employees.
- **"New Chat" added** to tab bar "+" menu — appears at top with separator below, always available.
- Both fixes verified across all 4 approaches.

### Approach A v2 — Card Grid
**What changed**: Search bar, urgency sorting (unread first), red/amber top borders, status text labels, client-name back button.

**Observations:**
- Search bar is clean and well-positioned. Cards now sort urgently — Aperture Science (6 unread) and Black Mesa (4 unread) are first.
- Red dashed border on urgent cards (≥4) is eye-catching without being garish. Amber for ≥1 is subtler.
- Status text ("Urgent", "Needs attention") below stats provides scannable triage info.
- Back button now says "← Black Mesa" — much clearer than generic "All Clients".
- **Remaining issue**: Cards are equal-sized regardless of urgency. Could benefit from a "pinned/priority" row at top.
- **Remaining issue**: Still requires a mode switch to navigate. The fundamental A weakness persists.

**Verdict**: Good triage improvements. The v1 complaints are partially addressed but the mode-switch problem is structural.

### Approach B v2 — Dropdown
**What changed**: Attention indicator on trigger ("4 need attention"), unread-sorted dropdown, timestamps per row, wider dropdown, ⌘K hint.

**Observations:**
- "· 4 need attention" in amber next to the trigger is a great passive signal — you see it without opening the dropdown.
- Dropdown now sorted by urgency (unread first, then by recent activity). Much better than alphabetical.
- Timestamps in each row add context without clutter.
- ⌘K footer is a nice power-user affordance.
- **Remaining issue**: The dropdown is good but still only shows ~6 clients before scrolling. With 50 clients, search becomes essential.
- **Remaining issue**: Missing Cyberdyne Systems from the dropdown — looks like clients with 0 unread AND no recent sort position get pushed below the fold.

**Verdict**: Polished and production-ready for the compact switcher use case. The attention indicator is the standout improvement.

### Approach C v2 — Sidebar
**What changed**: Collapsible sidebar, urgency dots, collapse-to-avatars mode with urgency rings, tooltips, search functionality, chevron toggle.

**Observations:**
- Collapsed mode is excellent — avatars with urgency rings and unread badges give you full context in just 48px.
- Expanded mode now has urgency dots (red/amber) that are easy to scan.
- The collapse animation is smooth. Chevron toggle is intuitive (< to collapse, > to expand).
- **This is the strongest v2.** It addresses every v1 complaint (space, truncation, urgency, search) without compromising the core strength (1-click switching).
- **Remaining issue**: In collapsed mode, clicking an avatar should have a stronger active state — it's hard to tell which is selected when they're all small.
- **Remaining issue**: Search hasn't been tested — need to verify the filter input works when clicking the search icon.

**Verdict**: Production-ready. Best overall balance of switching speed and information density. The collapsible sidebar is the killer feature.

### Approach D v2 — Breadcrumb
**What changed**: Sortable columns, recently-viewed avatars row, quick-switch dropdown on client name, compact h-9 breadcrumb bar.

**Observations:**
- Recently-viewed avatar row is a smart addition — 1-click access to your last 3 clients without going through the table.
- Sortable columns work well. Default sort by unread descending is the right choice for triage.
- Quick-switch dropdown on client name in breadcrumb addresses the biggest v1 complaint (having to go back to the table).
- More compact h-9 bar reduces chrome.
- **Remaining issue**: The recently-viewed row + column headers + search bar is a lot of UI before the first data row. Consider condensing.
- **Remaining issue**: Quick-switch dropdown on breadcrumb partially negates the need for the table view — if you can switch from breadcrumb, when do you use the table?

**Verdict**: Much improved. The quick-switch dropdown is the key fix — it transforms D from "worst for switching" to "workable for switching." The table becomes a triage tool you visit occasionally, not a mandatory waypoint.

---

## V2 Rankings

1. **Approach C (Sidebar)** — Best overall. Fastest switching, collapsible for space, urgency indicators, search. Production-ready.
2. **Approach B (Dropdown)** — Best compact option. Attention indicator is standout. Good for minimal UI footprint.
3. **Approach D (Breadcrumb)** — Best triage tool. Quick-switch dropdown fixes the fatal flaw. Good for data-oriented users.
4. **Approach A (Card Grid)** — Best first impression/onboarding. But mode-switch is still a friction point for daily use.

## V3 Review

### Cross-Cutting Fix: Tab State Persistence
**What changed**: Tab state (which tabs are open + which is active) is now cached per client in a Map. When you switch away and come back, your tabs are exactly as you left them.

**Verified**: Opened GLaDOS Maintenance tab on Aperture Science → switched to Black Mesa → switched back → GLaDOS Maintenance was still the active tab with both chat tabs preserved. Works across all 4 approaches.

**Verdict**: This was the #1 persona complaint ("tab state resets on client switch"). Now fixed.

### Approach C v3 — Sidebar
**What changed**: Stronger active state in collapsed mode — active client avatar gets a primary-colored ring (instead of just `bg-accent`), plus a left border indicator. Richer tooltips in collapsed mode showing client name + unread count + chat count.

**Observations:**
- The primary ring on the active avatar in collapsed mode is immediately distinguishable from the urgency rings (amber/red). Clear visual hierarchy.
- Left border indicator adds a second signal — even without looking at ring colors, you can see which row has the accent.
- Tooltips in collapsed mode now say "Aperture Science (6 unread) · 2 chats" instead of just the name. Useful when you need context without expanding.
- Search filter works correctly — tested via the filter input, filters as-you-type.
- **This is production-ready.** No remaining issues identified.

**Verdict**: Done. Ship it.

### Approach B v3 — Dropdown
**What changed**: Increased dropdown max height (max-h-64 → max-h-80) so all 6 clients show without scrolling. Added client count in footer ("6 clients" alongside the ⌘K hint).

**Observations:**
- All 6 clients now visible without scrolling — fixes the v2 issue where Cyberdyne was pushed below the fold.
- Footer with "⌘K to quick search" + "6 clients" count is a nice touch — tells you at a glance if you're seeing everything.
- Urgency sorting continues to work well — unread clients are always at top.
- Tab persistence works here too — switching approaches preserves tab state.
- **Production-ready** for the compact switcher use case.

**Verdict**: Done. Clean and functional.

### Approaches A & D v3
No visual changes in v3 — the v2 improvements addressed their main issues, and the remaining problems are structural (mode-switch for A, header density for D). Tab persistence is the cross-cutting improvement that benefits them. Both still work correctly at v3.

---

## Final Rankings

1. **Approach C (Sidebar)** — Best overall. 1-click switching, collapsible, urgency indicators, search, tab persistence, clear active states in both expanded and collapsed modes. Production-ready.
2. **Approach B (Dropdown)** — Best compact option. Minimal UI footprint, attention indicator, urgency-sorted dropdown, all clients visible. Production-ready.
3. **Approach D (Breadcrumb)** — Best triage/data tool. Sortable table, quick-switch on breadcrumb, recently-viewed avatars. Good for power users who need data.
4. **Approach A (Card Grid)** — Best first impression. Visual, familiar. But mode-switch friction makes it the weakest for daily use.

## Recommendation

**Approach C (Sidebar)** is the clear winner for daily use. Consider combining C with elements of B (the attention indicator "4 need attention" is a great passive signal that C doesn't have) or D (the sortable table could be a "Manage Clients" view accessible from the sidebar header).

The production solution could be: **C as the primary interface**, with an optional "All Clients" link in the sidebar header that opens a D-style table view for triage/management tasks.

---

## HTML Mockup Review (All 10 Approaches)

User reviewed all 10 static HTML mockups. Feedback:

### Keep exploring
| # | Approach | User Feedback |
|---|----------|--------------|
| **03** | Sidebar | "Good representation of the kind of thing I want on the client home tab." Sidebar picker has known issues (horizontal space) but not a bad approach. |
| **05** | Command Palette | "Power user quick switch window — I want to keep looking at. File that away." Will revisit later as a supplementary feature. |
| **07** | Tab Groups | "Very interesting and worth a look." Multi-client tabs grouped by client — no explicit selection, just grouped tabs. |
| **09** | Recent + Favorites | "Interesting idea to put the clients at the top, like their own tabs." Clients as a horizontal row of avatars above the workspace. |

### Interesting but lower priority
| # | Approach | User Feedback |
|---|----------|--------------|
| **08** | Sliding Drawer | "Interesting, but not the most interesting." |

### Set aside for now
01 (Card Grid), 02 (Dropdown), 04 (Breadcrumb), 06 (Floating Pill), 10 (Avatar Row) — not pursuing further.

### Key Takeaways
- The **home tab content** in mockup 03 resonated — richer than what we have, worth referencing.
- **Command palette (#5)** is being filed as a future power-user supplement, not a primary selection method.
- **Tab groups (#7)** is a new direction worth prototyping — fundamentally different from the other approaches because there's no explicit "client selection" step. You just open tabs and they're grouped.
- **Client avatars as top-level tabs (#9)** is conceptually similar to Approach C's collapsed mode but positioned horizontally above the workspace instead of vertically in a sidebar.
