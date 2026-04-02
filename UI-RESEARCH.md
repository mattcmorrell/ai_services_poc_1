# UI Research — Visual Design Direction

Research conducted April 2, 2026. Reference for the visual design overhaul of the AI Services POC.

---

# THE DIRECTION: Mercury

We looked at the full landscape of gold-standard B2B SaaS design (Linear, Stripe, Vercel, Attio, Superhuman, Clerk, Raycast, etc.) and they all converge on the same Stripe-derived template: clean sidebar, white cards on light gray, blue accent, Inter font, data tables with generous padding. Mercury is the standout — it took Stripe's *craft ethos* without copying the *visual language*.

**We are building a "Mercurial" UI.** Everything below this line is the design brief. The archive section at the bottom has the broader research for context.

---

## Reference Screenshots

All in `screenshots/mercury/` — open these to see what we're targeting:

| File | What It Shows |
|------|---------------|
| `mercury-section2.png` | **Dark mode dashboard** — the product shot with sidebar, accounts, chart. The dark surface treatment we're after. |
| `mercury-features.png` | **Generative art sphere + Swiss grid** — wireframe sphere, 2-column feature layout, automations flow card. The design language. |
| `mercury-dark-stats.png` | **Premium surface treatments** — security section with concentric rings, 3D lock, toggle switches on dark slate cards. The craft level we want. |
| `mercury-dark-section.png` | **Feature grid with art** — the sphere + automations + light blue accent cards. Light/dark contrast in the same section. |
| `mercury-cards-grid.png` | **Accounts table** — data presentation in dark context. Clean typography, indigo accent on links. |
| `mercury-stats-section.png` | **Light mode cards** — the credit card, bill pay, invoicing cards. Shows their lighter treatment (less distinctive than dark). |
| `mercury-banking-hero.png` | **404 page** — even their error page has the generative art (abstract icon tiles in indigo). |

---

## Design North Star: Mercury (mercury.com)

Mercury is the primary inspiration. Not their product UI (which is vanilla in light mode), but their **marketing page** — the level of craft, surface treatment, and visual confidence we want to bring into the actual product.

### What We're Drawing From

- **Swiss grid discipline** — strict 2-column layouts, generous gutters, content aligned to a visible underlying grid. Nothing floats arbitrarily.
- **Abstract generative art** — wireframe spheres, orbital lines, concentric rings, perspective grids. Mathematical and elegant. Signals precision without being literal. Replaces stock photos/illustrations.
- **Extremely restrained palette** — grayscale + one blue-purple accent (~indigo #6366f1 range). The restraint is what makes it feel high-end.
- **Dark mode via deep navy/slate** (not pure black) — the same cool-gray + indigo carries across both modes.
- **Large stat numbers as visual anchors** — scale and whitespace instead of decoration.
- **Premium surface treatments** — concentric-ring/glow illustrations on dark backgrounds. Luxury product photography feel.
- **Gradient-glow status states** — instead of flat colored badges, a warm gradient wash bleeds from the status text into the card background. The warning state *glows from within*. The card's visual language doesn't break; it modulates.
- **Quiet confident copy** — short, declarative, no exclamation marks. The design does the talking.

### Why Mercury's Product UI Falls Short

Their light mode dashboard is indistinguishable from dozens of other SaaS products. White background, light gray card borders, blue accent button, sidebar with icons. The surface depth, gradient glows, and cool-gray personality that make dark mode distinctive all flatten to generic `1px solid #e5e5e5` in light mode.

**Lesson:** Mercury's design system is optimized for dark. We need both modes to be strong portfolio pieces, which means solving the light mode problem they didn't.

---

## Mode Strategy

- **Build dark mode first** — this is where the Mercury-inspired design will shine
- **Both modes must be strong** — HR consultants have varied preferences
- **Glare concern:** Many HRCs sit in front of large windows. Pure dark (#0a0a0f) washes out with ambient light. Use elevated dark range (~#1a1c2e to #1e2030) for glare resilience. "Late evening" not "midnight."
- **Light mode needs its own identity:**
  - Cool-tinted off-white background (not pure white)
  - Cards with depth (soft shadows, subtle surface gradients — not just borders)
  - Accent color running slightly stronger to compensate for lost contrast
  - Generative art motifs adapted as subtle textures
- **Same palette DNA, two expressions** — not just color inversion

---

## Key Intent: Marketing-Page Craft in the Product UI

The specific differentiator: bring the premium details from Mercury's marketing page INTO the working product UI. This closes the gap most SaaS products have between their marketing site and their actual app.

- Gradient-glow card states for status (not flat badges)
- Abstract generative/mathematical visuals as agent avatars, empty states, loading moments
- Typographic confidence (large numbers, tight letter-spacing, generous whitespace) maintained in working views
- Surface depth on every card (subtle gradients, soft glow edges, material quality)
- Swiss grid discipline visible in product layout, not just "sidebar + content"

---

## ~~Gold Standard B2B SaaS Companies~~ (see Archive below)

*Moved to archive. Mercury is the direction.*

---

## ~~Design Inspiration Galleries~~ (see Archive below)

*Moved to archive.*

---

## Typography Strategy: Dual-Font Agent/Human Voice

Core concept: **monospace = agent, sans-serif = human.** The font itself signals who's acting — no labels, icons, or color needed. The shift in typeface is the typographic equivalent of Mercury's gradient-glow status states: the system communicates through material, not decoration.

### Font Pairing: Geist Sans + Geist Mono
Both from Vercel. Designed to work together. Free. Technical but not cold. Geist Mono is unusually readable at body sizes, which matters since activity feed and plan steps aren't tiny labels.

### Where Each Font Lives

**Geist Mono (agent voice):**
- Activity feed lines ("Pulling payroll data from BambooHR...")
- Action plan steps and status updates
- Thinking/reasoning logs
- Agent-generated code or structured output
- Streaming text while the agent is still working
- Status markers in chat

**Geist Sans (human space):**
- Chat input and user messages
- Dashboard metrics, navigation, headers
- Client names, sidebar, all chrome
- Clarifying question cards (these are prompting the human)
- Approval buttons and controls

### Why This Works
- Maps to a real conceptual boundary (agent vs. human), not arbitrary styling
- Monospace carries "machine working" associations from terminals, code editors, Claude Code
- Creates visual texture without adding color or weight — font shift alone creates hierarchy
- Scales to every surface in the app without needing a legend

### Watch Out For
- The mono must feel "precise machine" not "terminal emulator" — Geist Mono, Berkeley Mono, or JetBrains Mono, never Courier or system mono
- Agent messages at body text sizes need to stay readable — test at 14px+
- Transitions between agent and human content in the same view (e.g., a chat message with inline agent output) need clear boundaries

---

## Design Trends: Durable vs. Dated

### Durable (safe to build on)
- Warm neutral base (`#fafaf9` range) instead of pure white
- One strong brand accent (blue-purple range) at ~10% of surface
- Light mode default with polished dark mode (or dark-first for our case)
- Distinctive typography — NOT plain Inter (Geist Sans is free and signals technical credibility)
- 8-12px card radius, 6-8px inputs/buttons
- Generous whitespace (60%+ of layout)
- Cmd+K command palette as baseline expectation
- Streaming UI + activity feed (we already have this)
- Subtle gradient accents on key interactive elements
- 0.3s transitions, staggered list animations, skeleton loading
- Squircle corners (CSS `corner-shape: squircle` shipping in Chrome 139+)

### Already Dated (avoid)
- Plain Inter everywhere (invisible, undifferentiated — the new Arial)
- Neumorphism (soft-shadow embossed look)
- Rainbow dashboards with competing colors
- Heavy glassmorphism on every surface
- "Powered by AI" badges — embed AI invisibly
- Dense everything-visible-at-once layouts
- Pure flat design with no depth cues
- Stock photography
- Pure white (#fff) as the only background color
- Neon-everything without restraint
- Script fonts
- Pop-ups and modals for non-critical flows

### Specific Recommendations for This Project
- **Typography:** Geist Sans or similar (not Inter). Bold/large headings with tight letter-spacing. 14px body base.
- **Color:** Warm neutral base + indigo accent + semantic status colors. OKLCH/LCH for perceptual uniformity.
- **Surfaces:** Warm off-white (light) / elevated dark slate (dark). Subtle card elevation. Selective glassmorphism for depth on key panels.
- **Motion:** 0.3s standard transitions. Staggered list animations. Skeleton loading over spinners. Smooth streaming text appearance.
- **Layout:** Swiss grid for dashboard. Two-column chat layout (sidebar + main). Artifact/plan side panel.
- **Interaction:** Cmd+K command palette. Keyboard shortcuts with visible hints.
- **Craft signals:** Shimmer loading, smooth transitions, hover micro-states, staggered data load animations, gradient-glow status states.

---

## The Formula

> **Calm surface, powerful depth.** Clean minimalism with strong typography doing the visual work. Complexity revealed through progressive disclosure and command palettes. Personality through micro-moments (empty states, transitions, conversational copy) rather than visual maximalism. Marketing-page craft brought into the working product.

### Gradients
- **Light mode: YES** — subtle mesh gradient on page background. Sage green wash bottom-right, cream/white top-left. Layered radial-gradients (not linear). Cards sit on top as white/semi-transparent surfaces.
- **Dark mode: flat base by default.** Colored washes on dark surfaces are risky — multi-color ones look like a failing monitor, and even single-color washes (indigo corner) can be distracting at the opacity that makes them visible. *Maybe* a very faint single-color corner wash at ~half the opacity of the light mode gradient, pushed to the edge where content doesn't sit. Try later once real content is in place — not a foundation to build on. Richness in dark mode comes from card-level treatments instead (glow states, grain, subtle border gradients).
- Light mode gets character from the **background**. Dark mode gets character from the **cards**. Same DNA, different expression.
- Gradient text, gradient buttons as default, and full-screen mesh hero backgrounds are all played out. Our use is environmental lighting, not decoration.

### Grain / Texture
Subtle noise overlay on surfaces for tactile quality. Canvas-generated 256x256 noise PNG, tiled, `mix-blend-mode: overlay`.
- **Dark surfaces (#1a–#2a range): 12% opacity**
- **Light surfaces (#f0+ range): 3% opacity**
- Only noticeable when you compare side-by-side with a flat version — never distracting
- SVG filter approach is unreliable in browsers — use canvas-generated PNG (see `public/mockups/color-swatches.html` for working implementation)

### Tracked-Out Type (Superhuman Detail)
Wide letter-spacing on brand wordmarks / section labels only. Not on body text, not on nav items. All caps + thin weight + tracking = elegant. Use sparingly — one or two moments per view (e.g., agent name in status bar, product wordmark). The "luxury e-commerce every-label-tracked" look from 2018-2020 is dead, but a single tracked-out wordmark is a timeless Swiss typography move.

---
---

# ARCHIVE: Broader Research

Everything below is reference material from the initial research phase. The direction is Mercury (above). This section is kept for context, not as active guidance.

---

## Gold Standard B2B SaaS Companies

Most of these converge on the same Stripe-derived visual template. Listed here for reference — study their *interaction patterns* and *craft details*, not their color palettes (which are all variations of the same theme).

| Company | URL | Known For | Font | Study It For |
|---------|-----|-----------|------|--------------|
| **Linear** | [linear.app](https://linear.app) | "Linear-style" is a genre. Dark-mode-first, extreme polish. | Inter Display | Sidebar nav, command palette, status/activity patterns, LCH color system |
| **Stripe** | [stripe.com](https://stripe.com) | Obsessive micro-detail. Gradient accents on flat chrome. | Sohne (Klim) | Dashboard data presentation, progressive disclosure |
| **Vercel** | [vercel.com](https://vercel.com) | Performance as design. Zero-noise dashboards. | Geist Sans/Mono (free) | Developer-facing dashboards, clean information density |
| **Attio** | [attio.com](https://attio.com) | First CRM that feels modern. Rebuilt from first principles. | Poppins + Open Sans | Chat + data hybrid, onboarding, Notion-like flexibility |
| **Notion** | [notion.so](https://notion.so) | Made B2B feel human. Warm, approachable, personality-rich. | Inter + custom illus. | Empty states, playful microcopy, AI embedded invisibly |
| **Mercury** | [mercury.com](https://mercury.com) | Beautiful fintech. Trust through craft. Premium surfaces. | Custom | Dashboard with real numbers, card/surface treatments, dark mode |
| **Superhuman** | [superhuman.com](https://superhuman.com) | Speed as the design constraint. Keyboard-first email. | — | Command palette depth, zero-mouse workflows |
| **Raycast** | [raycast.com](https://raycast.com) | Native-feeling launcher. Feels like part of the OS. | System | Extension/plugin architecture UX, consistent component system |
| **Ramp** | [ramp.com](https://ramp.com) | Specificity over marketing fluff. Hard metrics everywhere. | TWK Lausanne | Data-forward dashboard design |
| **Figma** | [figma.com](https://figma.com) | Collaboration-first. Show-don't-tell product marketing. | Figma Sans (custom) | Real-time collaboration features, community integration |
| **Slack** | [slack.com](https://slack.com) | Broke the "B2B must be boring" rule. Celebration moments. | Larsseit + Circular Pro | Personality in B2B, unified command + search |
| **Arc Browser** | [arc.net](https://arc.net) | Radical rethink of familiar UI. Sidebar-first browsing. | — | Unconventional navigation patterns |
| **PostHog** | [posthog.com](https://posthog.com) | Developer analytics with personality. Open-source ethos. | IBM Plex Sans Variable | Personality in data-heavy interfaces |

---

## Design Inspiration Galleries

| Site | URL | What It Has | Best For |
|------|-----|-------------|----------|
| **SaaSUI** | [saasui.design](https://www.saasui.design/) | 3,500+ screenshots, 141+ products, 22 UI patterns | Side-by-side pattern comparison |
| **Nicelydone** | [nicelydone.club](https://nicelydone.club/) | 215K+ screenshots, 10K+ user flows (paid) | Specific patterns (approval flows, chat) |
| **Mobbin** | [mobbin.com](https://mobbin.com/explore/web/screens/dashboard) | 990+ web dashboards, 400K+ total | Breadth of real-world B2B examples |
| **SaaSFrame** | [saasframe.io](https://www.saasframe.io/) | 5,000+ real-world UI examples, 166 dashboards | Dashboard layout patterns |
| **Muzli Chat UI** | [muz.li/inspiration/chat-ui](https://muz.li/inspiration/chat-ui/) | 60+ chat UI designs | Chat interface specifically |
| **Muzli Dashboards** | [muz.li/inspiration/dashboard](https://muz.li/inspiration/dashboard-inspiration/) | 60+ dashboard designs | Dashboard moodboarding |
| **Refero** | [refero.design](https://refero.design/) | 128K+ screens, 9K+ user flows | Deep competitive research |
| **Layers.to** | [layers.to](https://layers.to/search/saas-dashboard) | Community-submitted SaaS designs | Polished individual shots |

---

## Articles Worth Reading

1. **[Linear: Design for the AI Age](https://linear.app/now/design-for-the-ai-age)** — Chat is "a weak and generic form" for AI. Validates our structured action plan approach.
2. **[Linear: How We Redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui)** — LCH color space, Inter Display headings, reduced noise.
3. **[Fuselab: UI Design for AI Agents](https://fuselabcreative.com/ui-design-for-ai-agents/)** — Agent dashboards, transparency patterns, multi-agent coordination.
4. **[Vercel Geist Design System](https://vercel.com/geist/introduction)** — Our font family's design system docs.
5. **[LogRocket: The Linear Design Trend](https://blog.logrocket.com/ux-design/linear-design/)** — Warning: "Almost every SaaS website looks the same" from copying.
6. **[SaaS Typography Playbook](https://fullstop360.com/blog/insights/branding/saas-typography-playbook-what-leading-companies-use)** — Inter is on 182+ SaaS sites. Don't be one of them.
7. **[TheCrunch: 10 Best AI Agent Dashboards](https://thecrunch.io/ai-agent-dashboard/)** — AI agent management dashboards specifically.


