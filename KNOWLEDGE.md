# Product Knowledge

Stable product principles, architectural understanding, and design decisions for **Panda Command** (formerly Pandopticon). This file captures durable knowledge that applies across all future work.

---

## Naming & Identity

### Product Name
**Panda Command** — full name. **PanCom** — short form for compact UI. Renamed from Pandopticon on 2026-04-02. Preserves the Panda lineage for insiders, board-friendly for everyone else. Board presentation week of 2026-04-07.

### Logo Direction
**PNDA\CMD** in Geist is the leading treatment. The backslash is a terminal/path separator — reads as "going deeper into a system." Visually distinctive, creates a natural break between the two halves. Works boxed (for sidebar/favicon/loading) or unboxed. The `\` is intentionally chosen over `/` which reads too much like a URL route.

---

## Visual Direction — Mercury + Mission Control

### Summary
Mercury-inspired aesthetic (Swiss grid, restrained cool palette, dark-mode-first, typographic confidence) with **mission control** flavor layered on top — not replacing it. The space/mission control references must be functional, not decorative. No floating planets or star backgrounds. The metaphor earns its place by mapping to real product concepts.

### Natural Mappings (Space → Product)
| Mission Control | Product Concept |
|----------------|-----------------|
| Telemetry log | Activity feed (already looks like this) |
| Go/no-go gate | Action plan approval |
| Mission status | Agent status |
| Callsign | PanCom header/logo |
| "Houston, we have a problem" | Safety gates on non-undoable steps |

### Open Door
Orbital/relationship diagrams are fair game if they're the right visualization for actual data (agent dependencies, client relationship maps). Not as decoration.

### The Vibe
Marketing-page-level craft meets mission control — restrained, high-end, and every space reference pulls its weight.

### 3 Colorway Themes (Decided April 2026)

| Theme | Vibe | Dark BG | Light BG | Accent (dark) | Accent (light) |
|-------|------|---------|----------|---------------|----------------|
| **Inkwell** | Warm earthy, craft | `#111617` Abyss | `#EBE8E0` Linen | Sage `#7A9A78` | `#5A7A58` |
| **Mercury** | Cool indigo, institutional | `#101214` | `#F3F4F6` | `#6878B8` | `#506098` |
| **Orbital** | Blue-steel, technical | `#161C22` Deep Space | `#E8EFF4` Sky Wash | Powder `#8AAEC4` | `#4A7A98` |

**All themes share:** Orange alert (`#D4875A` dark / ~`#C06828` light), semantic status colors (success green, warning yellow, danger red), and 10 themed client avatar colors.

**Inkwell accent history:** Originally Brulee (`#A27B5B`, warm brown) — changed to Sage because Brulee was too close to the alert orange. Evaluated 4 candidates (Sage, Patina, Brass, Mauve) via side-by-side mockup. Sage won for its earthy green clarity.

**Implementation:** CSS custom properties on `<html>` element. Classes like `.inkwell.dark`, `.mercury.light` switch all shadcn variables at once. The OG components already use Tailwind theme classes (`bg-background`, `text-foreground`) so theming is CSS-only. A theme switcher in the sidebar lets users pick colorway + light/dark mode.

**Design reference mockups:**
- `public/mockups/geist-palette.html` — interactive palette explorer (all 3 colorways × dark/light)
- `public/mockups/accent-compare.html` — Sage vs Patina side-by-side
- `public/mockups/prometheus-references.html` — Weyland Industries design reference board
- `public/mockups/figma-thumbnail.html` — PNDA\CMD branded thumbnail

---

## Typography & Agent Voice System

### Summary
The product uses a deliberate sans/monospace font pairing where **monospace signals the agent's work** and **sans-serif is the human/conversational layer**. This is a core design principle, not a cosmetic choice — it gives consultants an instant visual cue for what the machine did vs. what's written for them.

### The Rule
If the agent computed it, extracted it, or is actively doing it — mono. If a human wrote it, would say it, or it's UI chrome — sans. The font signals **who produced this**, not what data type it is. Numbers don't automatically earn mono just by being numbers.

### Where Mono Appears (Agent Layer)
- **Activity feed lines** — the agent narrating its own work in real time
- **Agent thinking/reasoning blocks** — the machine showing its logic (collapsed by default)
- **Tool call outputs** — structured data from API calls the agent made
- **Anomaly evidence blocks** — the data behind a flag (not the explanation prose)
- **Inline data callouts in chat** — agent-extracted values within conversational text (e.g., `58 OT hrs`)
- **Execution status badges** — Done, Running, Gate (agent reporting its state)

### Where Sans Stays (Human Layer)
- Headings, titles, navigation, buttons
- Chat message body text (even from the agent — it's talking to you)
- Action plan step descriptions and step numbers
- Anomaly explanation prose (the agent explaining, not showing data)
- Timestamps, labels, UI chrome — these serve the reader, not the machine
- **Numbers in UI chrome** — stat cards, dashboard values, table columns, step counts. A dollar amount in a stat card is UI presenting data (sans). The same dollar amount inside a tool call output is the agent showing what it found (mono). Context determines the font, not the data type.

### Font Family: Geist (Decided)
**Geist Sans + Geist Mono** — Vercel's typeface. Clean, technical, free. Geist Mono is unusually readable at body sizes. Loaded via `next/font/google` in `layout.tsx` as `--font-geist-sans` and `--font-geist-mono`.

Mockups: `public/mockups/font-mono-intent.html`, `public/mockups/font-mono-deep-dive.html`, `public/mockups/font-comparison.html`

### HRC Persona Feedback (Katy — Agent Trust & Oversight Focus)

Katy validated the mono/sans split as a strong trust signal. Three required changes from her review:

1. **Timestamp agent thinking data** — Consultants need to know *when* the agent pulled numbers, not just what they are. Stale data in a payroll context is dangerous. The thinking block must show data freshness.

2. **Collapse tool call outputs by default** — Show that a call happened and succeeded/failed, but raw API responses are opt-in. Consultants aren't debugging APIs — they're running payroll. Don't make them scroll past data they don't need.

3. **Add "who ran this" to the activity feed** — If a junior consultant triggered an agent run, the senior needs to see that immediately. Agent work without human attribution is a trust gap. Every activity feed should show who initiated the run.

### Rejected Approaches
- Mono for timestamps, step numbers, and labels — rejected as "UI chrome, not agent work." These serve the reader, not the machine.
- Single-font approach (no mono) — rejected because the agent/human distinction is too important to lose.
- Mono on all agent chat text — rejected. When the agent is *explaining* something conversationally, that's sans. Mono is for structured/computed output, not prose.

---
