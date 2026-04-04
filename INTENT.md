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

## Next Steps (Monday 2026-04-07)
1. Run Claude's reskin plan against V15/V16
2. Get screenshots + design tokens into Figma
3. Resolve dashboard layout
4. Resolve client nav question
5. Fix header height mismatch
6. Prepare for board presentation
