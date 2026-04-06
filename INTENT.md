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

- [ ] **Stopped/Declined badges use full danger instead of desaturated**
  - `plan-controls.tsx:134-136` — uses `--color-danger-muted` bg + `--color-danger` text
  - Spec: `color-mix(in srgb, var(--color-danger) 8%, transparent)` bg, `color-mix(in srgb, var(--color-danger) 50%, var(--muted-foreground))` text
  - Hierarchy: danger = "act now", stopped/declined = "ended negatively but resolved"

- [x] **Card border-radius 8px → 12px** *(fixed 2026-04-06)*
  - gate-approval-card, approval-request-card, clarifying-questions-card, artifact-card

- [ ] **Chat user bubble padding and asymmetric radius**
  - `message-list.tsx:289` — `px-4 py-2` (16px 8px) → spec: 14px 18px
  - `message-list.tsx:289` — `rounded-lg` (8px uniform) → spec: 12px with bottom-right 4px

### Medium — Component-Level Fixes

- [ ] **Badge padding** — `plan-controls.tsx:143` uses `px-2 py-0.5` (8px 2px), spec: 3px 10px
- [ ] **Badge dot size** — `plan-controls.tsx:148` uses `w-1.5 h-1.5` (6px) — correct per spec
- [ ] **Status label font weight** — `font-medium` (500) throughout, spec says 600
  - `gate-approval-card.tsx:58,75,97`
  - `approval-request-card.tsx:51,66,85`
  - `action-card.tsx:123`
- [ ] **Button font size** — approve/decline buttons use `text-[12px]`, spec says 14px (or 13px small)
  - `action-card-compact.tsx:82,91`
  - `approval-request-card.tsx:101,108`
  - `gate-approval-card.tsx:117,124`
- [ ] **Button border-radius** — `rounded-md` (6px), spec says 8px (`rounded-lg`)
  - Same files as above + `clarifying-questions-card.tsx:288,300`
- [ ] **Button padding** — `py-2.5` only, spec says 8px 20px
- [ ] **Inline data chip** — `globals.css:427-440`
  - Padding: 2px 8px → spec: 1px 6px
  - Border-radius: 6px → spec: 3px
  - Extra border not in spec
- [ ] **Chat input padding** — `chat-view.tsx:161` uses `p-3` (12px), spec: 14px 16px
- [ ] **Label letter-spacing** — `action-card.tsx:123` uses `tracking-wide` (0.025em), spec: 0.06em

### Low — Missing Implementations

- [ ] **Anomaly card** — fully spec'd in design system, no component exists yet
- [ ] **Alert pills** — spec defines urgent/attention variants (4px radius, sans), not formally built
- [ ] **Activity feed font size** — code uses 14px, spec has internal inconsistency (type scale says 14px for `.type-feed`, component specimen CSS says 13px for `.feed-line`)

### Notes
- Design system spec: `public/mockups/design-system.html#patterns`
- Design system badge hierarchy: danger (act now) > warning (paused) > stopped/declined (desaturated red, resolved) > muted (pending, neutral)
- Voice rule: mono = agent produced, sans = human space. The font signals *who produced this*.

## Next Steps (Monday 2026-04-07)
1. Work through design system alignment checklist above
2. Get screenshots + design tokens into Figma
3. Resolve dashboard layout
4. Resolve client nav question
5. Fix header height mismatch
6. Prepare for board presentation
