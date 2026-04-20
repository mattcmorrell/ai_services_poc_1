# Global Nav (v7c) — Build Plan ✅ IMPLEMENTED

## Context

The chosen global-nav direction (per `memory/project_global_nav_direction.md`) is **v7c** from `public/mockups/global-nav-exploration-v2.html` — a pinned-by-default sidebar that collapses to a 56px rail, with a **Chats popover** that pops out from the rail when collapsed. The mockup also folds **Recent** / **By Client** chat browsing *into* the sidebar, replacing today's separate `ChatListPanel`.

Current state:
- `src/components/sidebar.tsx` is a 64px icon rail only (Dashboard / Chats / Clients / Agents / Settings).
- `src/components/chat-list-panel.tsx` is a separate resizable panel rendered alongside `ChatView` when `activeView === "chats"`.
- `src/components/clients/clients-view.tsx` owns its own `selectedClientId` — there's no external API to programmatically select a client.

Goal: replace the rail + chat-list-panel with a single v7c sidebar, wire up collapse/expand, the By Client / Recent toggle, the chats popover, and two custom footer buttons (dark/light toggle + theme-picker opener). Sidebar becomes the only left-side chrome on every view.

## Scope Decisions (confirmed with user)

1. Replaces `components/sidebar.tsx` and removes `components/chat-list-panel.tsx` entirely.
2. **Clients** and **Agents** are dropped from top-level nav — the only nav rows are **Dashboard** and **Chats** (matches mockup). Client dashboard is reached by clicking a client name in the sidebar. *Open note: full Agents library only reachable via dashboard entrypoints.*
3. Clicking a client name navigates to that client's dashboard (`activeView = "clients"` with that client selected).
4. Default state = **open** (pinned). Persist collapse/filter/expanded-groups in `localStorage`.
5. Footer wordmark is plain text **"PandaCommand"** — not the SVG logo.
6. Reuse existing Phosphor icons from the current app (no new icon library).
7. `Cmd/Ctrl+B` toggles the sidebar.
8. Footer has two custom buttons (divergence from mockup): dark/light mode toggle + theme-picker opener. Theme-picker button shows icon+label when open, icon only when collapsed. Clicking opens the existing theme menu.

## v7c behavior spec

- **Pinned (default, 320px)** — header with "PandaCommand" wordmark + collapse button; Dashboard row; "Chats" heading with `By Client | Recent` segmented filter; chat tree or flat recent list; footer row with dark-mode toggle + theme-picker button.
- **Collapsed (56px rail)** — expand button at top, Dashboard icon, Chats icon, spacer, dark-mode icon, theme-picker icon. Active view icon highlighted.
- **Chats popover** — when collapsed *and* the Chats rail icon is clicked, a 320px popover slides out next to the rail showing *only* the Chats section (no wordmark, no Dashboard, no footer, no heading icon). Closes on: outside-click, Esc, selecting a chat, clicking another rail icon.
- **By Client tree** — chevron toggles group expansion; client name click navigates to client overview; inline "+" creates a new chat for that client; unread dot/badge per chat and per client.
- **Recent flat list** — chats sorted by `updatedAt` desc, each row shows title + client name + timeago.
- **Selection states** — rail/row active for current `activeView`; chat rows active for `selectedChatId`; client rows active when `activeView === "clients"` with matching id.

## File-by-file changes

### New files

**`src/components/sidebar/sidebar.tsx`** (replaces `components/sidebar.tsx`)
- Top-level shell. Owns `useSidebarState` hook. Renders either the expanded sidebar, the rail, or rail+popover based on state. Listens for `Cmd/Ctrl+B` to toggle collapsed.
- Props: `activeView`, `onViewChange`, `clients`, `chats`, `selectedChatId`, `onSelectChat`, `onNewChat`, `onSelectClient(clientId)`.

**`src/components/sidebar/sidebar-rail.tsx`** — 56px rail: expand button, Dashboard icon, Chats icon (active on `activeView === "chats"` or popover open), spacer, dark-mode icon, theme-picker icon. Uses existing shadcn `Tooltip`.

**`src/components/sidebar/sidebar-expanded.tsx`** — 320px full sidebar: header (wordmark + collapse button), Dashboard row, Chats section, footer row. Accepts a `popoverMode` boolean that hides wordmark/Dashboard/footer when rendered inside the popover (matches the mockup's CSS pattern at lines 2076–2109 of the mockup HTML).

**`src/components/sidebar/chats-section.tsx`** — "Chats" heading + `By Client | Recent` segmented control. Renders `ChatTree` or `RecentList` based on filter.

**`src/components/sidebar/chat-tree.tsx`** — By Client tree: per-client rows with chevron, name (click → `onSelectClient`), unread badge, inline "+"; expanded children = chat rows (click → `onSelectChat`).

**`src/components/sidebar/recent-list.tsx`** — flat list of chats sorted by `updatedAt` desc. Each row: title, client name, relative time. Reuses the existing `formatTimeAgo` from `chat-list-panel.tsx` (lift to `src/lib/format-time.ts` since `chat-list-panel.tsx` is being deleted).

**`src/components/sidebar/chats-popover.tsx`** — positioning wrapper around `<SidebarExpanded popoverMode />`. Absolute-positioned next to the rail, handles click-outside and Esc.

**`src/components/sidebar/sidebar-footer.tsx`** — the two custom buttons:
- Dark/light toggle: calls `toggleMode()` from `useTheme()`. Rail mode = icon only; expanded = icon only (no label per user answer "two buttons").
- Theme-picker opener: opens the colorway dropdown from `theme-switcher.tsx`. Expanded = icon + label "Theme"; collapsed = icon only.
- Implementation approach: extract the colorway picker dropdown from `theme-switcher.tsx` into a reusable `ColorwayPicker` that accepts a trigger as children (render-prop or `asChild` pattern).

**`src/hooks/use-sidebar-state.ts`** — state + persistence:
```ts
{ collapsed: boolean, filter: 'by-client' | 'recent', expandedClientIds: Set<string>, popoverOpen: boolean }
```
Mirrors the `useResizable` localStorage pattern from `src/components/ui/resize-handle.tsx` (try/catch, init from storage, write on change). Keys: `sidebar-collapsed`, `sidebar-filter`, `sidebar-expanded-clients`. `popoverOpen` is not persisted.

**`src/lib/format-time.ts`** — extract `formatTimeAgo` from `chat-list-panel.tsx:19-31` so it survives the deletion.

### Modified files

**`src/app/page.tsx`**
- Remove `ChatListPanel` import + usage (the dual-panel layout for `activeView === "chats"` collapses to a single `ChatView`).
- **Lift `selectedClientId` from `ClientsView` to `Home`** so the sidebar can trigger a client selection. Pass `selectedClientId` + `onSelectClient` into `ClientsView`. Add a handler `handleSelectClient(id)` that sets `selectedClientId` and `activeView = "clients"` simultaneously.
- Pass `clients`, `chats`, `selectedChatId`, `onSelectChat`, `onNewChat`, `onSelectClient` to the new `Sidebar`.

**`src/components/clients/clients-view.tsx`**
- Accept `selectedClientId` + `onSelectClient` props. Keep internal tab-cache logic. Sync incoming `selectedClientId` with an effect that calls the existing `handleSelectClient`-equivalent behavior (preserving tab cache). Do not change tab/chat-selection internals.

**`src/components/theme-switcher.tsx`**
- Extract the colorway dropdown portion into a reusable `<ColorwayPicker>` (or export the menu so the new sidebar footer can mount it under its own trigger). Keep `ThemeSwitcher` working for backward compatibility until no one else uses it, then delete if orphaned.

### Deleted files

- `src/components/sidebar.tsx` (replaced by `src/components/sidebar/sidebar.tsx`)
- `src/components/chat-list-panel.tsx` (folded into sidebar; `formatTimeAgo` extracted first)

## Reused existing code

- `useTheme()` from `src/components/theme-provider.tsx` — `toggleMode()` + `setColorway()` + `colorway` + `mode`.
- Colorway list + dropdown UI from `src/components/theme-switcher.tsx` — extract into `ColorwayPicker`.
- localStorage pattern from `src/components/ui/resize-handle.tsx:31,73`.
- `Tooltip` primitives from `src/components/ui/tooltip.tsx`.
- Phosphor icons already in the app: `House`, `ChatDots`, `Gear`, `Sun`, `Moon`, `Palette` (or `PaintBrush`), `SidebarSimple` (or `List` for hamburger/collapse).
- `formatTimeAgo` from `src/components/chat-list-panel.tsx:19-31`.
- `Chat` / `Client` shapes from `src/types/chat.ts` — `hasUnread`, `updatedAt`, `clientId`, `unreadCount`.

## Styling

- Use existing Tailwind tokens (`bg-background`, `border-sidebar-border`, `text-muted-foreground`, `bg-primary/15 text-primary`, etc.) — **no raw hex**. Respect the CLAUDE.md contrast rules (≥13px body, ≥11px labels, no opacity <0.6, no dim text below `#999` on dark).
- Rail width: `w-14` (56px). Expanded width: `w-80` (320px). Popover uses the same 320px.
- Popover: `shadow-xl border rounded-lg`, animates in with `animate-in slide-in-from-left-2`.

## Verification

1. `pnpm dev` (or `npm run dev`) → open `http://localhost:3000`.
2. **Pinned default**: sidebar is 320px open on load; Dashboard view is active.
3. **Collapse**: click header toggle → sidebar becomes 56px rail; `Cmd+B` also toggles.
4. **Persistence**: reload → sidebar remembers collapsed state + filter + expanded clients.
5. **Chats popover**: collapse, click the Chats rail icon → 320px popover appears next to the rail showing only the Chats section. Click outside / Esc / pick a chat → popover closes.
6. **By Client tree**: expand a client group (chevron), click a chat → chat view loads; click the client name → lands on ClientsView with that client selected.
7. **Recent filter**: switch to Recent → flat list sorted by `updatedAt`; pick a chat → loads; switch back to By Client → expansion state preserved.
8. **Footer buttons**: dark/light toggle flips mode; theme-picker button opens the colorway menu and picking a theme applies it. Both buttons show icon-only when collapsed; theme picker shows icon + "Theme" label when expanded.
9. **Active states**: Dashboard / Chats row highlight matches `activeView`; selected chat row highlighted; selected client row highlighted when on ClientsView.
10. **Contrast sweep**: grep new files for raw hex or `opacity-\[0\.[0-5]\]` / `font-size: \d{1,2}px` below 11px — none should exist.

## Open notes (not blockers)

- With Agents dropped from top-level nav, the full Agents library (`AgentsView`) is reachable only via existing dashboard entrypoints. If that's insufficient we can add an Agents entry to the theme-picker menu or footer later.
- `ChatListPanel` also renders a `ClientSelectDialog` for the inline "+" new-chat flow; the sidebar's per-client "+" button bypasses this dialog and calls `onNewChat(clientId)` directly (client is already known).
