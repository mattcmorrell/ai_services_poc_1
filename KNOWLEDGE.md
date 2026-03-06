# Product Knowledge

Stable product principles, architectural understanding, and design decisions for Pandopticon. Unlike INTENT.md (active workstreams) or product-decisions.json (OST), this file captures durable knowledge that applies across all future work.

---

## What Pandopticon Is

An AI-powered workspace for BambooHR HR Consultants (HRCs). HRCs manage 5-50 clients each and spend their days switching between clients, prepping for meetings, running payroll, tracking compliance deadlines, and responding to issues. Pandopticon gives them AI agents that handle the mechanical work while the HRC stays in control of decisions.

## Integration Landscape

> **Visual diagram:** `mockups/system-architecture.html` — open in a browser to see the full integration map with read/write connections.

Pandopticon is an **intelligence layer**, not a system of record. It reads from source systems, synthesizes context, and surfaces actionable insights. Source systems own the data.

| System | Role | Read | Write | Status |
|--------|------|------|-------|--------|
| **BambooHR** | HR Platform (employee, payroll, benefits, compliance) | Yes | Yes | Core |
| **Google Calendar / Outlook** | Schedule — trigger proactive prep, deadline awareness | Yes | No | Exploring |
| **Google Meet / Zoom** | Meeting intelligence — decisions, action items, unresolved questions | Yes | No | Exploring |
| **Salesforce** | Task/case management — deadlines, status updates | Yes | Yes | Exploring |
| **Google Drive** | File context — policies, SOWs, checklists | Yes | No | Exploring |
| **Gmail** | Conversation monitor — client email threads, draft replies | Yes | Yes | Exploring |
| **Slack** | Team communication — monitor channels, post updates | Yes | Yes | Exploring |

## Core JTBD

**"Help me prep for my next meeting."** This is the highest-value job. Everything else (payroll, compliance, benefits) feeds into this — an HRC's day is structured around client meetings, and the quality of those meetings determines client retention.

---

## Calendar Integration

### Principles
- **Calendar is the source of truth.** Google Calendar / Outlook owns the schedule. Pandopticon reads and reacts — it's a smart layer on top, not a replacement.
- **No dedicated calendar page.** HRCs already have a calendar app. Pandopticon shows what matters in context, not a month grid.
- **No schedule tab in the chat list.** The chat list shows conversations. Mixing in calendar events breaks the mental model. "What's next on my plate?" is a dashboard question, not a chat-list question.

### Where Calendar Data Surfaces
| Surface | What | Why |
|---------|------|-----|
| **Dashboard** | Today's Schedule, Upcoming Deadlines, proactive agent banner | HRCs orient themselves here at the start of the day |
| **Client Home** | Next meeting, client-specific deadlines, AI prep brief | The prep surface — everything about one client before a meeting |
| **Chat View** | Agent proactively offers meeting prep | Contextual, in the flow of work |

### Why No Schedule Tab in Chat List
- Chat list shows conversations; a schedule tab would show events — breaks the mental model
- Duplicates the dashboard's schedule widget in a narrower column
- "What's next on my plate?" is a dashboard-level question, not a chat-level one

### Why No Dedicated Calendar Page
- HRCs already have a calendar app. Pandopticon doesn't need to replicate a month grid.
- The value is contextual awareness, not calendar management.

### Key Insight: Chats Don't Map 1:1 to Meetings
An HRC might have 4 chats with one client about different topics. Meeting prep cuts across all of them. The **Client Home page** is the right abstraction level for prep, not individual chats or a sorted chat list. The JTBD is "help me prep for my next meeting" — sorting chats by meeting time doesn't solve that.

### Implementation
- `src/data/calendar-data.ts` — mock events with relative dates, linked to client IDs
- `src/components/dashboard/todays-schedule.tsx` — schedule card with inline AI prep
- `src/components/dashboard/upcoming-deadlines.tsx` — deadline card with urgency badges
- `src/components/dashboard/proactive-prep-banner.tsx` — "meeting in 2h" banner
- Client Home Tab (`src/components/clients/client-home-tab.tsx`) enhanced with Next Meeting + Deadlines sections
- Branch: `enhancements-project-task-calendar`

---

## Meeting Intelligence

### Transcript Pipeline
1. **Primary**: Use Google Meet / Zoom structured summaries (decisions, action items, key topics). They've already solved the hard extraction problem.
2. **Fallback**: Raw transcript — only parse if the structured summary is missing or thin.
3. **Our job is connection, not extraction.** Take Google's "Action item: send compliance report by Friday" and link it to the existing action plan in Pandopticon. Take "Decision: go with tier 2 dental" and resolve the open question in the benefits chat.

### What "Connection" Means (examples)
- Google says "Action item: send compliance report by Friday" → link to existing action plan for that client, create a deadline
- Google says "Decision: go with tier 2 dental" → resolve the open question in the benefits chat, update the action plan
- Google says "We also have 3 people going on parental leave in April" → flag for the benefits agent as a new issue
- Matching structured meeting outputs against existing client state = much simpler than raw transcript parsing
- The LLM is good at this matching/connection task

### The Meeting Loop
1. **Before**: AI preps a brief from all data sources (chats, action plans, deadlines, previous meeting summary)
2. **During**: Google Meet / Zoom records and produces structured summary
3. **After**: AI processes the summary, connects to client state, updates action plans, creates new items, flags discrepancies
4. **Next meeting**: Prep includes last meeting's summary. Each cycle gets smarter.

### Why This Is the Moat
Google Meet gives you "here's what was said." Pandopticon gives you "here's what it means for your work, and here's what you need to do about it." The value is understanding meeting outputs in the context of everything else Pandopticon knows: action plans, chat history, compliance deadlines, employee data. A generic transcript tool can't do that.

### AI Prep Brief Structure
| Section | What it answers |
|---------|----------------|
| **Status snapshot** | Where do things stand? (enrollment %, payroll status, headcount) |
| **Since last meeting** | What changed? What got done? What didn't? |
| **Open items** | Blocked action plans, unanswered questions from chat |
| **Risks / flags** | Compliance deadlines, anomalies, attention items |
| **Suggested talking points** | "Bring up dental plan tier selection — open for 2 weeks" |

### Data Sources for Prep
**Already in Pandopticon**: chat history across all client chats, action plan status, attention items, project plan phases.

**From BambooHR (production)**: employee change log, benefits/enrollment status, payroll history, compliance tracker, time-off/leave data.

**From Calendar + Meeting History**: previous meeting structured summary, meeting cadence (weekly vs quarterly changes emphasis).

### Prototype Approach
- Mock `meeting-transcripts.ts` with fake structured summaries tied to past calendar events
- "Prep Full Brief" button opens a chat with an agent pre-loaded with all client context
- Past calendar events show "Transcript" badge — click shows AI-extracted summary (decisions, action items, open questions)

---

## Information Architecture Principles

- **Dashboard** = orient. "What's happening across all my clients today?"
- **Client Home** = prep. "Tell me everything about this client right now."
- **Chat** = act. "Let's work on this specific thing."
- **Agents** = delegate. "Which specialist do I need?"

Each view answers a different question. Calendar/schedule data should surface at the right level, not be crammed into one place.

---

## Salesforce Integration (Open Question — Interviews Starting 2026-03-09)

> See also: [Integration Map](#integration-landscape) and `mockups/system-architecture.html`

### Context
HRCs use Salesforce for task tracking, deadline management, and basic project management. Discovery interviews starting Monday 3/9 to understand pain points and whether Pandopticon should handle these use cases.

### Working Hypothesis: Intelligence Layer, Not Replacement
Same principle as calendar — Pandopticon reads and reacts, doesn't become the system of record. Rebuilding Salesforce's CRUD functionality is a maintenance trap.

### Two Buckets of Pain (to validate in interviews)
1. **CRUD pain** — "too many clicks to log a task," "confusing views," "forget to update it." This is Salesforce being bad at UX. Not our problem to solve — Salesforce will always be better at being Salesforce.
2. **Intelligence pain** — "can't see what's urgent across clients," "don't know what to prep," "miss deadlines because nothing connects." This is exactly what Pandopticon solves. Adding Salesforce data to the intelligence pipeline (prep briefs, dashboard, client home) is a natural extension.

### Potential Integration Play
- **Read** from Salesforce: tasks, deadlines, case status → feed into dashboard, client home, prep briefs as another data source
- **Surface** in existing places: no new Salesforce tab, just richer context in the surfaces we've already built
- **Write back** via agents: "mark this task complete," "log this meeting note" → so HRCs don't context-switch to Salesforce for simple updates
- **Never own the data**: Salesforce remains source of truth for tasks/cases

### Interview Questions
- "Walk me through how you start your day — where do you look first?"
- "When you're prepping for a client meeting, what tabs do you have open?"
- "What falls through the cracks, and why?"
- "If Pandopticon could pull in your Salesforce data, what would you want to *see*? What would you want it to *do*?"
- "What do you track in Salesforce vs. what you track in your head / spreadsheets / sticky notes?"

### Key Risk
If interviews reveal that the CRUD pain is the dominant issue (not the intelligence pain), we have a harder decision — because solving CRUD means building a task manager, which is a different product.

---

## Action Plan Execution Model

Plans have a lifecycle: `pending → approved → executing → completed/paused/stopped/declined`. Steps execute sequentially. Steps marked `nonUndoable: true` pause execution and require explicit approval — this is the safety gate for irreversible operations (payroll processing, tax filing, sending notices).

The HRC is always in control. The AI proposes, the human approves. This is non-negotiable for HR work where mistakes affect real people's paychecks and benefits.
