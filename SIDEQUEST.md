# SIDEQUEST — Decision Tree & Idea Tracking System

## Your Job

You're working on a **side quest**: building a visual decision tree tracker for UX design exploration. The main quest (prototyping client selection approaches in React) is happening in another terminal tab — **don't touch any React components, TypeScript files, or the prototype switcher**. Your scope is the tracking/visualization system only.

## Context

We're building a "Clients" view for a BambooHR consultant app. The core UX problem: how does a consultant select which client they're working with? We brainstormed 10 approaches, prototyped the top 4 in React (with v1→v2→v3 iterations), then expanded to prototype 2 more based on user feedback. The user wants a way to visually track all these branching ideas — which are alive, which are dead, which spawned other ideas.

## What Exists

### `decision-tree.html` — The Main Deliverable (v2)
An interactive HTML page showing a branching tree of all ideas. Features:
- Dark themed (#0a0a0f background), inline CSS, no dependencies
- **Data-driven** — reads from `decision-tree-data.json`, so updates are just JSON edits
- **Summary stats bar** — auto-computed counts per status + total
- **Click-to-filter** — click any status in stats bar to dim non-matching cards, Esc to clear
- **Prototype links** — each card has "Mockup" and "Prototype" link buttons
- Tree structure with connector lines, color-coded status dots and cards
- Each card shows: ID, name, version chain (v1→v2→v3), status badge, description note
- Status types: **exploring** (blue), **new/untested** (purple), **filed for later** (amber), **parked** (gray), **abandoned** (dim)
- Branching shown: Approach C spawns Approach F (with "inspired by" label)
- Two sections: "Brainstorm → Prototype (Top 4)" and "Brainstorm → Not Initially Prototyped"
- Keyboard shortcut: `Esc` clears active filter

### `decision-tree-data.json` — The Data File
All tree data in one place. Edit this to update the tree — no need to touch HTML.
- Status definitions with colors/glow settings
- Full tree structure with IDs, names, notes, versions, mockup/prototype links
- `lastUpdated` field for the header timestamp

### User Feedback on v1
- "This is really promising"
- Text was too dark — fixed by brightening all text colors, raising parked/abandoned opacity
- Notes overflowed card boxes — fixed by wrapping to second line with flex-basis: 100%
- Cards made wider (800px max) with more padding

### The Data (current state of all ideas)

**Active / Exploring:**
- **C: Sidebar Client List** — v1→v2→v3, EXPLORING. Favorite so far. Concern about horizontal space. Next step: try collapsed-by-default.
- **F: Client Tabs Row** — v1, NEW. Spawned from C's collapsed mode + idea #9. Horizontal avatar row above workspace. Just built, untested.
- **E: Tab Groups** — v1, NEW. Spawned from idea #7. All clients' tabs in one bar, grouped by client. Just built, untested.

**Filed for later:**
- **5: Command Palette** — Power user quick-switch (Cmd+K). User explicitly said "file that away, we'll come back to it."

**Parked (interesting but not pursuing now):**
- **A: Card Grid** — v1→v2→v3. Mode-switch friction (must leave workspace to switch). Good for onboarding, bad for daily use.
- **B: Dropdown Switcher** — v1→v2→v3. Compact and functional. User moved on to other concepts.
- **D: Breadcrumb Navigation** — v1→v2→v3. Best triage/data tool. Too many clicks for daily switching.
- **8: Sliding Drawer** — User said "interesting but not the most interesting."
- **9: Recent + Favorites Bar** — Concept evolved into Approach F.

**Abandoned:**
- **6: Floating Pill** — Too hidden for primary navigation.
- **10: Avatar Row** — Scales poorly, lacks context.

**Not explored (from original brainstorm, never made it past the cut):**
- Ideas 1-4 were the top 4 prototyped (A-D above). Ideas 5-10 are listed above.

## V2 Upgrades (COMPLETE)

Built 4 of the 6 possible directions in a single pass:

### 1. Data-driven (direction #4) — DONE
- Created `decision-tree-data.json` — all tree data, statuses, metadata in one JSON file
- `decision-tree.html` fetches the JSON at load time — to update the tree, just edit the JSON
- Status definitions (label, color, glow) are in the JSON too, so adding new statuses is trivial

### 2. Summary stats (direction #6) — DONE
- Stats bar at the top: `1 Exploring · 2 New/Untested · 1 Filed · 5 Parked · 2 Abandoned · 11 Total`
- Auto-computed from the data — never goes stale

### 3. Filtering (direction #5) — DONE
- Click any status in the stats bar to filter — non-matching cards dim to 20% opacity
- Click again or press `Esc` to clear
- Filter hint text updates dynamically ("Showing: Exploring · Click again or press Esc to clear")
- Stats bar highlights the active filter with the status color

### 4. Prototype links (direction #3) — DONE
- Each card now shows "Mockup" and "Prototype" link buttons
- Mockup links open the corresponding `mockup-*.html` file
- Prototype links point to `localhost:3001` (the dev server)
- Links appear as small pills below the note text

### Not yet done:
- **Expand/collapse branches** (direction #1) — would be nice but tree is small enough it's not needed yet
- **Timeline dimension** (direction #2) — could add `dateAdded`/`dateUpdated` fields to JSON later

## V3 Upgrades (COMPLETE) — Inline Editing

Made the decision tree a **living document** — all card content is editable directly in the browser.

### What was built:

1. **Double-click to edit name/note** — card names and notes become contenteditable on double-click. Enter commits, Esc reverts. Visual affordances: dashed underline on hover, blue underline + subtle blue background when focused.

2. **Click status badge to cycle** — clicking any status badge cycles through: exploring → new → filed → parked → abandoned. Stats bar, card styling, and status dots all update instantly. Tooltip says "Click to cycle status".

3. **localStorage persistence** — all edits are stored in `localStorage` under the key `decision-tree-edits`. Edits survive page refresh. Applied on top of the base JSON data on load.

4. **Save bar** — a bottom bar slides up when unsaved changes exist:
   - **Discard** — reverts all changes to original JSON data, clears localStorage
   - **Download JSON** — exports the full modified `decision-tree-data.json` with updated `lastUpdated` date. Clears localStorage after download (since the downloaded file IS the new source of truth).

5. **Keyboard hints updated** — bottom-right hints now show: `Esc` clear filter · `Double-click` edit text · `Click status` cycle

6. **Esc key scoping** — Escape only clears filter when not actively editing a field. During editing, Esc reverts the field text without clearing the filter.

### UX decisions made:
- **Always-editable** (no edit mode toggle) — the dashed underline on hover is subtle enough to not clutter the view, but clear enough to signal editability.
- **localStorage + download** (not auto-save to file) — browser can't write to the filesystem, so we persist in localStorage for session continuity and offer download when the user wants to commit changes to the JSON file.
- **Status badges use labels** from the JSON status definitions (e.g., "Exploring", "Filed for later") instead of raw keys.

## What the User Might Want Next

### Directions still on the table (lower priority):
1. **Expand/collapse branches** — click to hide children, useful as tree grows
2. **Timeline dimension** — add dates to JSON, show when decisions happened
3. **Search** — filter by name/note text
4. **Export as image** — download current tree as PNG/SVG for sharing

## Files You Own
- `decision-tree.html` — the interactive visualization (v2)
- `decision-tree-data.json` — the data file (edit this to update the tree)
- `SIDEQUEST.md` — this file (update it as you work)

## Files You Do NOT Touch
- Anything in `src/` — React components, that's the main quest
- `INTENT.md` — main quest tracking
- `OBSERVATIONS.md` — main quest UX review notes
- `mockup-*.html` — static mockups from earlier

## Reference Files (read-only, for context)
- `OBSERVATIONS.md` — full history of UX reviews, persona feedback, version notes
- `INTENT.md` — current project state and direction
