# INTENT — Visual Design Overhaul

## Goal

Establish a cohesive visual design system for Panda Command (formerly Pandopticon) — the AI-agent platform for BambooHR HR consultants. This is a portfolio piece that needs to demonstrate visual design skill. The overhaul covers typography, color palettes, the mono/sans agent voice system, and component reskinning across all views.

**Board presentation week of 2026-04-07.** This work needs to be presentable by then.

## Current Direction

**Mercury dark is the leading colorway** for the board presentation. Orbital (powder blue) is the alternative. Inkwell (warm teal) is parked — Katy's persona feedback said it reads as "relaxed" not "mission control."

Working on branch `visual-design-overhaul`. V15 (Mercury) and V16 (Orbital) variants are built and switchable in the app.

## What's Done

### Typography System (Decided)
- **Geist Sans + Geist Mono** — decided after comparing 8 font families
- Mono = agent's voice (activity feed, thinking blocks, tool calls, anomaly evidence, status badges)
- Sans = everything else, including numbers in UI chrome
- The rule: "If the agent computed it, extracted it, or is actively doing it — mono. Everything else is sans."
- Mockups: `font-comparison.html`, `font-mono-deep-dive.html`, `font-mono-intent.html`

### Color Palettes (3 Colorways Built)
- **Inkwell** — warm teal/sage, earthy craft feel
- **Mercury** — cool desaturated steel blue, institutional (LEADING)
- **Orbital** — powder blue, technical, atmospheric
- All share orange alert color (#E08850), consistent semantic colors
- Interactive mockup with colorway tabs + dark/light toggle: `geist-palette.html`

### App Variants
- **V15** — Mercury dark applied to chat view, chat list panel, dashboard
- **V16** — Orbital dark applied to same components
- CSS variable override via `.theme-mercury` / `.theme-orbital` classes on root div — themes the sidebar and all Tailwind-token components without touching globals.css
- Dashboard cards use Graphite (#222428), removed double-border issue

### Naming & Logo
- **Panda Command** full name, **PanCom** short form, **PNDA\CMD** logo mark
- PNDA\CMD in Geist with thin backslash separator is the leading treatment
- Backslash chosen over forward slash (more distinctive, terminal/path energy)

### HRC Persona Feedback (Katy)
- Validated mono/sans split as trust signal
- 3 required changes: timestamp thinking data, collapse tool calls by default, add "who ran this" to activity feed
- Mercury preferred over Inkwell for daily use ("infrastructure, not a lounge")
- Anomaly card with orange alert glow validated as effective attention signal

### Documentation
- `KNOWLEDGE.md` — product knowledge, design decisions, typography system, colorway specs
- Mockup pages all cross-linked with navigation

## Rejected Approaches
- **Mono for all numbers** — rejected. Numbers don't earn mono just by being numbers. Context determines font.
- **Mono for timestamps/step numbers/labels** — rejected as "UI chrome, not agent work"
- **Single font (no mono)** — rejected. Agent/human distinction too important.
- **Inkwell light mode** — "screams lifestyle brand, not payroll operations" (Katy)
- **Modifying globals.css for V15** — broke all other variants. Reverted. Use scoped CSS class instead.
- **IBM Plex Mono at display sizes** — too wide, fixed-width gaps look awkward at 32px+
- **Mercury with saturated indigo accent** — too bright. Desaturated to steel blue for all-day use.

## Open Questions
- Dashboard layout — what goes where?
- Should "Panda Command" name appear in the UI? If so, where? (Subtle on dashboard?)
- Do clients belong in the global nav sidebar?
- Header height mismatch on recent chats — needs investigation
- Getting screenshots + variables into Figma (may need new file or variable updates)

## Active: Design System Alignment

Audit of codebase against `public/mockups/design-system.html` (2026-04-06). Reference spec is the single source of truth for tokens, typography, component styling.

### High — Systematic Drift

- [x] **Hardcoded Tailwind colors instead of design tokens** (~20 instances) *(fixed 2026-04-06)*
  - activity-feed.tsx — icon colors now use `--color-info`, `--color-danger`, `--color-success`
  - action-card.tsx — status icons, approved button, completion banner, step indicators all tokenized
  - gate-approval-card.tsx — approved/declined borders, approve/modify buttons tokenized
  - approval-request-card.tsx — same pattern as gate-approval
  - clarifying-questions-card.tsx — answered state border, check icon tokenized
  - message-list.tsx — approved button tokenized
  - Note: workflow/ (BambooHR brand green) and clients/ (prototypes) left as-is — not in design system scope

- [x] **Stopped/Declined badges use full danger instead of desaturated** *(fixed 2026-04-06)*
  - plan-controls.tsx — stopped/declined now use color-mix desaturated treatment
  - action-card.tsx, action-card-compact.tsx — status icons also desaturated

- [x] **Card border-radius 8px → 12px** *(fixed 2026-04-06)*
  - gate-approval-card, approval-request-card, clarifying-questions-card, artifact-card

- [x] **Chat user bubble padding and asymmetric radius** *(fixed 2026-04-06)*
  - message-list.tsx — padding now 14px 18px, radius 12px with bottom-right 4px

### Medium — Component-Level Fixes

- [x] **Badge padding** — *(fixed 2026-04-06)* now 3px 10px
- [x] **Badge dot size** — already correct (6px)
- [x] **Status label font weight** — *(fixed 2026-04-06)* font-medium → font-semibold (600)
  - gate-approval-card, approval-request-card, action-card
- [x] **Button font size, border-radius, and padding** *(fixed 2026-04-06)*
  - gate-approval-card, approval-request-card, action-card-compact, clarifying-questions-card
  - text-[12px] → text-sm (14px), rounded-md → rounded-lg (8px), py-2.5 → 8px 20px
- [x] **Inline data chip** — *(fixed 2026-04-06)* padding 1px 6px, radius 3px, border removed
- [x] **Chat input padding** — *(fixed 2026-04-06)* now 14px 16px
- [x] **Label letter-spacing** — *(fixed 2026-04-06)* now 0.06em

### Low — Missing Implementations

- [ ] **Anomaly card** — fully spec'd in design system, no component exists yet
- [x] **Alert pills** — *(fixed 2026-04-06)* agents-attention.tsx and card-grid.tsx now use spec styling (4px radius, sans 600, token colors)
- [x] **Activity feed font size** — *(fixed 2026-04-06)* 14px → 13px per component specimen (type scale says 14 but specimen renders 13)

### Notes
- Design system spec: `public/mockups/design-system.html#patterns`
- Design system badge hierarchy: danger (act now) > warning (paused) > stopped/declined (desaturated red, resolved) > muted (pending, neutral)
- Voice rule: mono = agent produced, sans = human space. The font signals *who produced this*.

## Session: 2026-04-06 — Type Audit & Figma Sync

### Completed
- **Type scale enforced**: 11px floor across all components (25 violations fixed), then full audit against 13-token type scale — fixed orphaned sizes (15px, 20px, 30px), weight mismatches (11px bold→medium, 12px/13px semibold→medium, 18px semibold→medium), font family mismatches (approval cards mono→sans, activity feed 13→14px)
- **Type token labels** added to design system page (.type-page-title through .type-stat-sm)
- **Inkwell/Orbital success green** saturated for Done vs Running distinction (Inkwell: #34D058, Orbital: #5BC870)
- **Mercury Dark contrast bump**: card #191B1F→#1D2024, inner #222428→#282A30 (before/after comparison in design system)
- **Inkwell accent fixed in Figma**: was warm brown A27B5B, corrected to sage green 7A9A78/5A7A58 via Plugin API
- **Figma variable sync**: added 9 new variables to PanCom Palette (sidebar, border, success, danger, info, 4 muteds), bound colors across 4 captured frames, fixed Arimo→Geist Sans font replacement (303 segments)
- **PandaCommand wordmark**: replaced Pandopticon PNG with text logo (48px/800 Geist Sans + 18px/600 mono subtitle)
- **Plan panel type alignment**: metadata labels now mono, badge weights fixed, timestamps to 13px meta
- **Chat header**: bg-muted (inner color) across all themes
- **Theme switcher dropdown**: fixed left-edge overflow
- **Agent description truncation**: fixed in agents-view

### Open Questions (updated)
- [ ] Anomaly card component — spec'd in design system, not built yet
- [ ] Dashboard layout — what goes where?
- [ ] Client nav sidebar question
- [ ] Header height mismatch on recent chats
- [ ] Push remaining code-only variables back to Figma (chart-*, avatar-*, ring, input)
- [ ] Type utility classes (.type-*) — labels are in the design system, CSS classes not yet in globals.css. Add when ready to refactor away ad-hoc Tailwind.
