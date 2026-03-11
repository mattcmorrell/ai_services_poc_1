# Product Knowledge

Stable product principles, architectural understanding, and design decisions for Pandopticon. Unlike INTENT.md (active workstreams) or product-decisions.json (OST), this file captures durable knowledge that applies across all future work.

---

## What Pandopticon Is

An AI-powered workspace for BambooHR HR Consultants (HRCs). HRCs manage 5-50 clients each and spend their days switching between clients, prepping for meetings, running payroll, tracking compliance deadlines, and responding to issues. Pandopticon gives them AI agents that handle the mechanical work while the HRC stays in control of decisions.

## Current HRC Workflow (As-Is)

> **Source:** FigJam board `AI-Services` node 216:1103 — mapped from discovery research. This is how HRCs work TODAY, not the ideal state. Pandopticon's value comes from understanding this flow and eliminating the manual glue between steps.

### The End-to-End Flow

```
Assign Client → Receive Tasks → Build Profile Doc → Prep Discovery → Discovery Call
→ Post-Call Insights → Build Project Plan (~1hr) → Update Salesforce → Client Alignment Call
→ [Weekly Loop: Prep → Call → Summary → Update Profile Doc → repeat]
```

**Step by step:**

| Step | What happens | Tools used | Who |
|------|-------------|------------|-----|
| 1. Assign client | Katie (manager) assigns client to HRC after deal closes in Salesforce | Salesforce | Katie |
| 2. Receive project tasks | HRC gets ~50 task emails from Salesforce templates | Salesforce | HRC |
| 3. Build Customer Profile Doc | HRC creates the client's single source of truth doc | Google Docs | HRC |
| 4. Prep discovery questions | HRC prepares questions for first client call | ChatGPT | HRC |
| 5. Discovery call | First call with client | Attention (records) | HRC |
| 6. Post-call insights | Transcript + AI summary added to Customer Profile Doc | Google Docs, Attention | HRC |
| 7. Build project plan | HRC builds project plan spreadsheet (~1 hour per plan) | Google Sheets, ChatGPT | HRC |
| 8. Update Salesforce tasks | HRC updates Salesforce to match the plan | Salesforce | HRC |
| 9. Client alignment call | Review project plan, confirm pain points + timeline | Attention (records) | HRC |
| 10. **Weekly loop** | Prep talking points → Client call → Pull AI summary → Update Profile Doc → repeat | Google Docs, Attention, ChatGPT | HRC |

### The Customer Profile Doc Is the Real Source of Truth

A single Google Doc per client that tracks:
- Customer info
- Discovery call notes
- Every subsequent call, with transcription highlights from Attention

**This is the real source of truth** — not Salesforce, not a spreadsheet. HRCs live in this doc. It accumulates the full history of the client relationship. Pandopticon's Client Home page should aspire to replace or augment this doc.

### What Salesforce Actually Does (vs. What We Assumed)

Salesforce's role is narrower than expected — it's a **task template engine and billing trigger**, not the day-to-day planning tool.

**What it does well:**
- When an HR Services deal closes, billing is triggered in Salesforce and Katie assigns the client to the HRC
- Pre-loaded task templates per project type (Onboarding, Offboarding, HR Tech Stack, Performance Management, Handbook)
- HRCs track hours spent & hours saved per task (used to demonstrate value to clients)
- Hourly Consulting is the exception — doesn't get assigned tasks in Salesforce

**What Katie (manager) wants but doesn't have yet (as of March 2026):**
- Dashboard: insights and analytics tracking progress across projects, seeing who's falling behind on due dates
- Client portal: clients could log in and see progress against project plan

**Where Salesforce falls short (from HRC perspective):**
- **Collaboration**: Can't tag/assign people to specific tasks (e.g., "@Rachel, look at this"). No task-level collaboration — can only add comments. HRC/AHRC collaboration is much easier in spreadsheets.
- **Usability**: Not visually appealing. Not a good way to present a project plan to customers (one HRC builds plans in slide decks instead). Limited task customization.
- **Templates are outdated**: Pre-loaded templates are old, requiring heavy manual editing every time.
- **Duplicate work**: Consultants maintain the real plan in spreadsheets/slides, then update Salesforce separately. This is the core "work around the work."
- **File storage concerns**: Worries about retention policies (Salesforce may archive/delete after ~1 year). Fear of older cases getting archived and hard to find.

### Multiple Projects = Multiple Plans

If a client signs up for multiple projects (e.g., Onboarding + Performance Management), each gets a separate project plan spreadsheet. The data model must support multiple plans per client.

### Tools Already in the Workflow

HRCs already use AI — this isn't greenfield adoption:
- **Attention** — records all client calls, provides AI summaries and transcriptions
- **ChatGPT** — used for discovery question prep and project plan building
- **Google Docs** — Customer Profile Doc (the real source of truth)
- **Google Sheets** — project plan spreadsheets (shared with clients)
- **Salesforce** — task templates, billing, hours tracking

### What This Means for Pandopticon

The biggest opportunities are where HRCs do **manual glue work** between systems:
1. **Post-call update** — manually copying Attention insights into the Customer Profile Doc
2. **Project plan building** — ~1 hour of manual spreadsheet work per plan
3. **Salesforce sync** — maintaining plans in spreadsheets then duplicating into Salesforce
4. **Meeting prep** — manually reviewing the Customer Profile Doc, Salesforce tasks, and project plan before each call
5. **Weekly loop overhead** — prep → call → summarize → update, repeated for every client every week

Pandopticon doesn't need to replace these tools. It needs to **eliminate the manual steps between them**.

---

## Integration Landscape

> **Visual diagram:** `mockups/system-architecture.html` — open in a browser to see the full integration map with read/write connections.

Pandopticon is an **intelligence layer**, not a system of record. It reads from source systems, synthesizes context, and surfaces actionable insights. Source systems own the data.

| System | Role | Read | Write | Status |
|--------|------|------|-------|--------|
| **BambooHR** | HR Platform (employee, payroll, benefits, compliance) | Yes | Yes | Core |
| **Google Calendar / Outlook** | Schedule — trigger proactive prep, deadline awareness | Yes | No | Exploring |
| **Google Meet / Zoom** | Meeting intelligence — decisions, action items, unresolved questions | Yes | No | Exploring |
| **Attention.tech** | AI meeting recording — structured extracted intelligence, action items, CRM auto-sync | Yes | No | Exploring |
| **Salesforce** | Task/case management — deadlines, status updates | Yes | Yes | Exploring |
| **Google Docs** | Customer Profile Doc — the real source of truth per client; call notes, client context | Yes | Yes | Exploring |
| **Google Sheets** | Project plans — tasks, milestones, due dates (shared with clients) | Yes | Yes | Exploring |
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

## Attention.tech Integration

> See also: [Integration Map](#integration-landscape), [Meeting Intelligence](#meeting-intelligence), and product-decisions.json (S17, Q9, Q11)

### Summary

Attention.tech (now attention.com) is an AI meeting recording and intelligence platform that records calls on Zoom/Meet/Teams, transcribes them, and produces structured `extractedIntelligence` — action items, next steps, decisions, competitor mentions — pre-labeled and CRM-mapped. BambooHR already runs Attention — the data is already flowing, no new licensing or adoption required. Pandopticon just needs API access to what's already there. Integration is straightforward: Attention has a well-documented REST API (`api.attention.tech/v2/`, API key auth) and an open-source MCP server. Pandopticon's job remains connection, not extraction — but Attention makes the extraction dramatically richer. Testing is done against BHR's production Attention instance (read-only, no risk).

### What Attention Is

An AI-native meeting intelligence platform, primarily built for revenue teams but applicable to any meeting-heavy workflow. Core capabilities:
- **Recording & transcription** — Zoom, Google Meet, Microsoft Teams, plus dialers. 100+ languages, speaker identification, sentiment analysis.
- **Structured extraction** — Every conversation produces an `extractedIntelligence` object: action items, next steps, decisions, competitor mentions, objections, key topics. These are CRM-field-mapped and can be human-confirmed (`confirmedExtractedIntelligence`).
- **CRM auto-update** — After each call, automatically populates Salesforce/HubSpot fields from the transcript. Supports both one-click and fully automatic sync.
- **Follow-up generation** — Contextual follow-up emails within 60 seconds post-call.
- **Natural language search** — "Ask Attention Anything" queries across all transcripts, emails, and CRM data.
- **Coaching scorecards** — Scores calls against frameworks (MEDDIC, BANT, or custom).

### Key Context

BambooHR already runs Attention — the data is already flowing. No new licensing or adoption required. Pandopticon just needs an API key from BHR's Attention admin.

### Why It Fits

Attention produces exactly what the [Meeting Intelligence](#meeting-intelligence) pipeline needs. The existing design says "our job is connection, not extraction" — Attention handles extraction at a much higher quality than basic Google Meet/Zoom summaries. The `extractedIntelligence` field is pre-structured with labeled action items, decisions, and next steps, which maps directly to Pandopticon's connection work (linking meeting outputs to existing action plans, resolving open questions, creating tasks).

### No Attention → Salesforce Auto-Sync

Attention offers auto-sync to Salesforce (pushes meeting action items as tasks/activity records). We don't want this. If Pandopticon reads from Attention directly AND reads from Salesforce separately, auto-sync creates duplicates — the same action item appears from both sources. The cleaner architecture: Attention owns meeting intelligence, Salesforce owns HRC-managed tasks, Pandopticon connects the two. Auto-sync makes sense for teams without an intelligence layer; with Pandopticon, it's unnecessary indirection.

### API

**REST API (V2):**
- Base URL: `https://api.attention.tech/v2/`
- Auth: API key via `Authorization` header (generated in app.attention.tech → Settings → API Keys)
- OpenAPI spec available

**Key endpoints:**

| Endpoint | What it returns |
|----------|----------------|
| `GET /v2/conversations` | List/filter conversations by date, participant, team, opportunity. Paginated. |
| `GET /v2/conversations/:id` | Full conversation: transcript, extractedIntelligence, attendees, duration, CRM links, scorecard results |
| `GET /v2/calendar` | Upcoming calendar events |
| `POST /v2/ask` | Natural language query across all conversations and deals |
| `GET /v2/scorecards` | Coaching scorecard templates and results |

**Conversation object fields:** uuid, title, transcript, createdAt, finishedAt, mediaDuration, attendees, participants, extractedIntelligence, confirmedExtractedIntelligence, scorecardResults, labels, linkedCrmRecords, externalAccounts, externalContacts, externalOpportunity, transcriptStatus, videoStatus.

**MCP server:** Official open-source at github.com/rory-attention/attention-mcp-server — 17 read-only tools for Claude. Requires Claude as the model (Pandopticon currently uses GPT). See Q11 in product-decisions.json for the model choice question.

### Existing Integrations

Attention has 200+ integrations. Key overlaps with Pandopticon's integration landscape:
- **CRM:** Salesforce, HubSpot
- **Video/Call:** Zoom, Google Meet, Microsoft Teams
- **Email:** Gmail, Outlook
- **Collaboration:** Slack, Asana, Confluence
- **Automation:** Zapier (triggers: new recording, finalized transcript, deal activity)

### Data Flow

**Read path** — Pandopticon pulls from Attention via REST API:
- Recent conversations per client (filter by participant email or linked CRM account)
- `extractedIntelligence` for each: action items, decisions, next steps
- Full transcript when needed for deeper context

**Surface** — In existing views, no Attention tab:
- **Client Home**: Meeting History section — past meetings with AI-extracted summaries
- **Prep Briefs**: Meeting Prep Agent includes last meeting's decisions, open action items, and unresolved topics
- **Dashboard**: "3 action items from yesterday's meetings need follow-up"
- **Post-meeting flow**: After a meeting, Pandopticon reads Attention's extraction, proposes updates to action plans, creates tasks, resolves open questions

**The upgraded meeting loop:**
1. **Before**: Prep Agent synthesizes client data + Attention's past meeting intelligence into a brief
2. **During**: Attention records, transcribes, extracts structured intelligence
3. **After**: Pandopticon reads `extractedIntelligence`, connects to client state — updates action plans, creates tasks, resolves open questions, flags discrepancies
4. **Next meeting**: Prep includes last meeting's decisions and open action items. Each cycle gets smarter.

### Implementation

**POC approach:**
- `src/data/attention-data.ts` — mock conversation objects with realistic extractedIntelligence, tied to past calendar events and client IDs
- Add Meeting History section to Client Home (past meetings with extracted summaries)
- Feed extractedIntelligence into Meeting Prep Agent context
- "Post-meeting review" flow: agent reads Attention data, proposes action plan updates

**Production additions:**
- `/api/attention` route — API key auth, conversation list/detail endpoints
- Client-to-participant mapping (match Attention conversations to Pandopticon clients by attendee email)
- Polling or Zapier webhook for new conversation notifications
- Consider MCP server if agents switch to Claude (see Q11)

### Testing

**Layer 1 — Mock data (CI, demos):** `attention-data.ts` with realistic extractedIntelligence objects across different meeting types (check-ins, project kickoffs, escalation calls). Validates UI rendering and prep brief integration. Toggle via `ATTENTION_MODE=mock|live`.

**Layer 2 — API against BHR's production Attention instance:** BambooHR already runs Attention with real meeting data. Testing against production is the right call — there's no sandbox concept, and the API is read-only from Pandopticon's perspective (we never write to Attention). The risk profile is low: we're reading data that already exists, not creating or modifying anything. Steps: (1) Get an API key from BHR's Attention admin (Settings → API Keys). (2) Test conversation listing with filters (date range, participant). (3) Validate extractedIntelligence structure against what we expect. (4) Verify client-to-meeting matching by attendee email. (5) Check latency — how soon after a meeting ends does extractedIntelligence become available.

**Layer 3 — Intelligence validation:** Does the prep brief improve with real meeting history? Does the post-meeting flow correctly propose updates based on real extractedIntelligence? Test with a few real client meetings to verify the connection logic works — "this action item from Tuesday's meeting relates to this open task in Salesforce."

**Why production data is fine:** Pandopticon is read-only against Attention. No writes, no side effects, no risk of corrupting meeting data. The worst case is a bad API call that returns an error. Using real data also validates the matching logic against real attendee patterns (external consultants on calls, group meetings with multiple clients, etc.), which mock data can't fully capture. One thing to coordinate: make sure the API key has access to the right subset of conversations (HRC client meetings, not internal-only calls).

---

## Google Docs Integration (Customer Profile Doc)

> See also: [Current HRC Workflow](#current-hrc-workflow-as-is), [Integration Map](#integration-landscape), [Attention.tech Integration](#attentiontech-integration), and product-decisions.json (S19, OP9)

### Summary

The Customer Profile Doc (Google Docs) is the real source of truth for each client relationship — not Salesforce, not spreadsheets. It's a single Google Doc per client that accumulates customer info, discovery call notes, and transcription highlights from every subsequent Attention call. HRCs live in this doc. The Google Docs API supports full read/write (OAuth 2.0, shared with Sheets/Calendar/Gmail). The highest-value integration: auto-appending Attention call summaries after every meeting, eliminating the most repetitive step in the weekly HRC workflow. Reading the doc also makes Pandopticon's prep briefs dramatically richer — it's the deepest source of accumulated client context.

### Key Context

Discovery research revealed the Customer Profile Doc is more important than any other single data source. It's where HRCs do their real thinking about clients. Every other system (Salesforce, Sheets, Attention) feeds into or gets updated from this doc. Pandopticon's Client Home page serves the same job ("tell me everything about this client") but currently lacks the accumulated call history and HRC notes that make the Profile Doc invaluable.

### API

**Google Docs API (v1):**
- Base URL: `https://docs.googleapis.com/v1/documents`
- Auth: OAuth 2.0 (same token covers Docs, Sheets, Calendar, Gmail, Drive)
- `documents.get` — returns full doc as structured JSON (paragraphs, headings, tables, formatting, inline objects)
- `documents.batchUpdate` — applies changes via an array of requests

**Key request types:**
| Request | What it does |
|---------|-------------|
| `insertText` | Add text at a specific position or end of document |
| `insertTable` | Add a table |
| `createParagraphBullets` | Convert paragraphs to bullet/numbered lists |
| `updateParagraphStyle` | Apply heading levels, alignment |
| `updateTextStyle` | Bold, italic, font size, color |
| `replaceAllText` | Find and replace across the doc |

**Appending:** Use `endOfSegmentLocation: { segmentId: "" }` to append to the end of the document. This is the safest write operation — doesn't require understanding the existing doc structure.

### What It Solves

**The #1 repetitive task in the HRC workflow:** updating the Customer Profile Doc after every client call.

Current flow (every client, every week):
1. Finish call
2. Open Attention, review summary
3. Open Google Doc
4. Copy/paste highlights, format them
5. Save

With Pandopticon (Attention + Google Docs API):
1. Finish call
2. Pandopticon proposes: "Add these call insights to the Customer Profile Doc?"
3. HRC approves → done

For an HRC with 20 clients, that's ~20 manual copy-paste sessions eliminated per week.

### Read Path

The Customer Profile Doc is the richest source of client context — richer than Salesforce, richer than any single system. Reading it enables:

- **Better prep briefs** — include the HRC's own accumulated notes, not just structured API data
- **Pattern detection** — "the client mentioned concerns about their dental plan provider in the last 3 calls"
- **New HRC onboarding** — if an HRC takes over a client, Pandopticon has already ingested the Profile Doc and can brief them conversationally
- **Agent context** — agents reference real client history, not just task status

### Write Path

**Primary use case:** auto-append post-call summaries from Attention.

**Format:** Append a consistently structured "Call Summary" section at the end of the doc:
- Date + attendees
- Key decisions
- Action items
- Open questions
- Notable quotes or concerns

Same approval model as all write-backs: agent proposes, HRC approves. The doc is the HRC's space — Pandopticon never writes without permission.

### Challenges

- **Position-based model**: The API uses character indices, not named sections. Appending to the end is easy and reliable. Inserting into the middle (e.g., under a specific heading) requires parsing the doc structure first to find the right index.
- **Formatting complexity**: Constructing nicely formatted content (headings, bullets, bold) requires multiple `batchUpdate` requests with explicit style instructions. Not hard, but verbose compared to pasting formatted text.
- **No standard template**: Every HRC structures their Profile Doc differently. LLM-powered parsing handles reads (same pattern as Sheets — send doc content to LLM, extract structured information). For writes, append-to-end is the safest approach.
- **Concurrent editing**: If the HRC is editing the doc while Pandopticon writes, character indices can shift. Mitigated by using append-to-end and writing during low-contention moments (post-call, before next call).

### Implementation

**POC approach:**
- `src/data/profile-doc-data.ts` — mock Customer Profile Doc content per client (customer info, call history with Attention-style summaries)
- Add "Client Notes" or "Profile Doc" section to Client Home showing accumulated call history
- Mock the auto-append: after a simulated meeting, agent proposes adding call summary
- Toggle via `DOCS_MODE=mock|live`

**Production additions:**
- `/api/google-docs` route — OAuth 2.0 (shared auth with Sheets/Calendar/Gmail)
- Doc-to-client linking (store doc URL per client, or auto-discover via Drive API search by doc name)
- Read pipeline: `documents.get` → LLM extraction of structured client context
- Write pipeline: build `batchUpdate` requests for formatted call summaries → append to end
- Trigger: post-meeting (after Attention data is available), manual "update profile doc" agent action

### Testing

**Layer 1 — Mock data (CI, demos):** `profile-doc-data.ts` with realistic Profile Doc content across different client types and project stages. Validates Client Home rendering and prep brief enrichment. Toggle via `DOCS_MODE=mock|live`.

**Layer 2 — Real Google Doc (integration):** Create a test Customer Profile Doc in a BHR Google Workspace account. Test OAuth, read (parse doc structure), and write (append formatted call summary). Verify formatting survives round-trip. Test with multiple doc structures to validate LLM parsing robustness.

**Layer 3 — End-to-end with Attention:** After a real meeting, verify: Attention produces extractedIntelligence → Pandopticon reads it → agent proposes Profile Doc update → write appends formatted summary to the correct doc → doc renders correctly in Google Docs.

### The Transition Path

The Customer Profile Doc and Pandopticon's Client Home page serve the same JTBD: "tell me everything about this client."

1. **Now**: Pandopticon reads the Profile Doc + auto-appends call summaries (eliminates manual copy-paste, enriches prep briefs)
2. **Soon**: Client Home shows everything the Profile Doc has, plus more (Salesforce tasks, project plan status, cross-system insights, pattern detection across calls)
3. **Eventually**: HRCs stop opening the Profile Doc because Client Home is better. The doc becomes auto-generated from Pandopticon's data rather than the other way around.

This is Pandopticon's strongest path to becoming indispensable — it starts by serving the doc HRCs already depend on, then gradually becomes the better version of it.

---

## Google Sheets Integration (Project Plans)

> See also: [Integration Map](#integration-landscape), [Meeting Intelligence](#meeting-intelligence), [Attention.tech Integration](#attentiontech-integration), and product-decisions.json (S18, OP5, Q8)

### Summary

HRCs build project plans in Google Sheets and share them with clients. These plans contain due dates and milestones that drive agent prioritization and meeting prep. Dates change frequently based on client conversations. A one-time import goes stale immediately — Pandopticon needs a live link. The Google Sheets API supports full read/write, enabling a closed loop: Attention captures "let's push open enrollment to April 15th" from a meeting → Pandopticon matches it to the project plan → agent proposes the update → HRC approves → Pandopticon writes the new date back to the shared Google Sheet. The client sees the change immediately.

### Key Context

HRCs do most of their actual work in Google Docs/Sheets. Spreadsheets are the primary tool for building project plans. These plans are **shared with clients** — they're living documents, not internal artifacts. This means: (1) the data matters for AI prioritization (due dates, milestones), (2) the data changes constantly (client conversations shift timelines), and (3) write-back is visible to clients (precision matters).

### Why Live Linking, Not Import

The existing Project Plan Import (S13) uses a paste/extract model — HRC pastes plan text, AI extracts dates and milestones. This works for demos but breaks in production because:
- Plans change after import (dates shift based on client conversations)
- HRCs won't re-import after every change
- The AI agent can't prioritize work correctly with stale dates
- There's no write-back path to update the source document

A live Google Sheets link solves all four problems.

### Architecture

**Read path** — Google Sheets API (`spreadsheets.values.get`):
- Read cell data from linked project plan spreadsheets
- LLM-powered parsing: send raw headers + rows to LLM, extract tasks, due dates, owners, status
- Handles varied formats — every HRC structures plans differently (no rigid template required)
- Compare extracted structure against previous extraction to detect changes

**Write-back** — Google Sheets API (`spreadsheets.values.update`):
- Update specific cells (due dates, status, notes) after HRC approval
- Same approval model as Salesforce write-back — agent proposes, HRC approves
- Precision matters: update the right cell, don't corrupt formatting or formulas
- **Client-visible**: the Google Sheet is shared, so writes appear to the client immediately

**Auth:** OAuth 2.0 — same flow as Calendar/Gmail (BHR is a Google Workspace shop). One auth grants access to Sheets, Calendar, Gmail, and Drive.

### Freshness Strategy (How to Stay Current)

| Approach | How it works | Best for |
|----------|-------------|----------|
| **Post-meeting re-read** | After every client meeting, re-read the linked plan. If dates changed in conversation, Attention captured it, and the plan likely changed too. | Catching conversation-driven changes (highest value) |
| **Daily full sync** | Pull all linked spreadsheets once per day (e.g., overnight). Diff against last known state. | Catching async edits (client updates sheet independently) |
| **Drive push notifications** | `files.watch` API — webhook fires when file changes. Then pull and diff. | Real-time awareness (production optimization) |
| **Recommended: hybrid** | Post-meeting re-read + daily sync. Add push notifications later if needed. | Balances coverage with simplicity |

Google Sheets API has generous quotas (300 requests/min/project), so polling every 5-10 min per active client is also viable as a simpler alternative.

### LLM-Powered Parsing

Spreadsheets are semi-structured — different HRCs format plans differently. Columns might be "Task | Owner | Due Date | Status" or "Milestone | Target | Notes" or something else. Rather than requiring a rigid template:

1. Read raw sheet data (headers + rows)
2. Send to LLM: "Extract tasks, due dates, owners, and status from this project plan"
3. LLM handles varied formats, merged cells, color-coded status, notes columns
4. Run on every sync, compare extracted structure against previous extraction to detect changes
5. Cost: one LLM call per sheet per sync (manageable)

A structured template is a nice-to-have later ("use this template and we'll track it automatically") but not required. Pandopticon meets HRCs where they are.

### The Closed Loop (Attention → Sheets)

The most powerful flow combines Attention and Google Sheets:

1. HRC meets with client
2. Attention captures "let's push open enrollment to April 15th" in `extractedIntelligence`
3. Pandopticon reads Attention's output, matches "open enrollment" to a row in the linked project plan
4. Agent proposes: "Update open enrollment deadline from March 31 → April 15 in the project plan?"
5. HRC approves
6. Pandopticon writes the new date back to the Google Sheet via API
7. Client sees the updated date immediately in the shared sheet

This eliminates a manual step HRCs do today: finish a meeting, remember what dates changed, open the spreadsheet, update the cells, hope you didn't miss one.

### Change Detection and Surfacing

When Pandopticon detects a change in a linked plan:
- **Dashboard**: "Acme Corp's implementation timeline shifted — 3 dates moved out"
- **Client Home**: Updated milestones with change indicators ("Due date moved from 3/15 → 3/22")
- **Prep Brief**: "Since last meeting, the open enrollment deadline was pushed back a week"
- **Agent awareness**: Agents factor current due dates into prioritization, flag conflicts ("Benefits enrollment due Friday but compliance audit also due Friday — which takes priority?")

### Implementation

**POC approach:**
- Extend `src/data/project-plans-data.ts` with mock "linked sheet" data — same structure as imported plans but with a `sourceType: 'google-sheets'` and `sheetUrl` field
- Add "Link Google Sheet" button to Client Home project plans section (alongside existing import)
- Mock the sync: show "Last synced 5 min ago" with a refresh button
- Mock write-back: agent proposes date change, approval triggers a simulated sheet update

**Production additions:**
- `/api/google-sheets` route — OAuth 2.0 (shared with Calendar/Gmail auth)
- Sheet-to-client linking (store sheet URL + range per client)
- LLM extraction pipeline: raw cells → structured plan → diff against previous
- Write-back with cell-level precision (track which cell maps to which date/field)
- Freshness: post-meeting trigger + daily sync + optional Drive push notifications
- Conflict handling: if sheet changed externally between syncs, show diff to HRC before overwriting

### Testing

**Layer 1 — Mock data (CI, demos):** Mock linked sheets with realistic project plan structures. Test LLM extraction against varied formats. Toggle via `SHEETS_MODE=mock|live`.

**Layer 2 — Real Google Sheet (integration):** Create a test spreadsheet in a BHR Google Workspace account. Test OAuth flow, read/write, change detection. Verify write-back doesn't corrupt formatting. Test with multiple plan formats to validate LLM parsing robustness.

**Layer 3 — End-to-end with Attention:** After a real meeting, verify the full loop: Attention extracts a date change → Pandopticon reads it → agent proposes update → write-back lands in the correct cell in the sheet.

---

## Client-Facing Project Plan

> See also: [Google Sheets Integration](#google-sheets-integration-project-plans), [Current HRC Workflow](#current-hrc-workflow-as-is), and product-decisions.json (OP10, S20–S25)

### The Problem

HRCs need to share project plans with clients. The plan must be: (1) easy to edit, (2) easy to share, (3) looks good. No current tool hits all three:

- **Google Sheets**: easy to edit, easy to share, but doesn't look good. Not client-presentable.
- **Google Slides**: looks better, easy to share, but hard to maintain. Static — HRC must manually rebuild after every change. One HRC (Thomas) uses slides because "it's not a good way to present a project plan to customers" in Sheets.
- **Neither** connects to the rest of the workflow. Changes from meetings don't flow into the plan automatically. The HRC is the manual sync layer.

### The Direction: Conversational Editing → Sheet Backend → Rendered Client View

The strongest approach separates three concerns:

1. **Editing happens in Pandopticon chat.** HRC says "push the open enrollment deadline to April 15th." The agent says "sounds good, I'll update the project plan." No spreadsheet opened, no cells clicked.
2. **Google Sheets is the backend.** The agent writes the change to the sheet via API. Sheets remains the source of truth and the persistence layer. But nobody needs to look at it directly.
3. **The client sees a beautiful rendered view.** A branded, always-current web page generated from the sheet data. Client has a bookmarked URL. When the sheet updates, the view updates.

**One sentence from the HRC → three surfaces update:**
- Google Sheet (source of truth)
- Pandopticon views (Client Home, dashboard, prep briefs)
- Client-facing site (the URL the client bookmarked)

This also connects to the Attention loop: client says "let's push enrollment to April 15th" in a meeting → Attention captures it → agent proposes the update → HRC says "yeah do it" → same cascade. The HRC may stop opening Google Sheets entirely — it becomes an invisible persistence layer.

### Requirements for the Client-Facing View

- **Always current** — reads from the sheet (or Pandopticon's parsed plan data), no manual refresh
- **Looks professional** — clean timeline, color-coded phases, progress indicators, BambooHR branding
- **Mobile-friendly** — clients check on phones
- **Shareable via URL** — no app install, no login (or optional simple auth)
- **Read-only for clients** — clients view, HRCs edit (via agent or directly in Sheets)

### Approaches Considered

**A. Pandopticon-hosted rendered site (recommended)**

A read-only web page generated from the Google Sheet plan data. Client gets a URL (e.g., `plan.pandopticon.app/t/abc123`). Pandopticon reads the sheet, renders a polished timeline/milestone view, keeps it current.

- *Pros:* Full design control. Always live. URL sharing. Could grow into a client portal. Creates a BambooHR-branded client touchpoint. No workflow change for HRC (edits via chat or Sheets).
- *Cons:* Needs hosting infrastructure (but Pandopticon is already a web app). Security via unguessable token URLs or simple auth. Pandopticon must be reliable if clients depend on the URL.
- *Why it's strongest:* Solves all three requirements. The HRC edits conversationally (easy), the client sees a rendered page (looks good), sharing is a URL (easy to share). The pitch: "Keep editing your spreadsheet — or just tell the agent. Your client sees this instead."

**B. Auto-generated Google Slides from Sheets data**

Pandopticon reads the Sheets plan, generates a polished Slides deck via the Google Slides API. HRC edits in Sheets, client sees Slides. Pandopticon re-generates after changes.

- *Pros:* Stays in Google Workspace. Clients already know Slides. No new infrastructure.
- *Cons:* Slides API is fiddly for layout. Static snapshots — need to re-generate after every change. Not truly live. Slides aren't great on mobile. Still feels like a document, not an always-current view.

**C. Branded PDF auto-generated after each update**

Every time the plan changes, Pandopticon generates a polished PDF and drops it in a shared Drive folder or emails it to the client.

- *Pros:* PDFs look professional and are universally accessible. Easy to attach to emails. Creates a paper trail.
- *Cons:* Static — stale the moment it's generated. Clients accumulate versions. No interactive elements. Can't check current status on demand.

**D. Client portal within Pandopticon**

A stripped-down, authenticated view where clients log in and see their project plan, milestones, recent updates. Not the full Pandopticon workspace — just the plan and progress.

- *Pros:* The fullest vision. Could include progress tracking, document links, meeting summaries. Exactly what Katie said she wants ("clients could log in and see progress against project plan").
- *Cons:* Big scope. Needs client auth, permissions, user management. This is a product, not a feature. Too much for now — but this is the long-term direction that the rendered site (Approach A) naturally grows into.

**E. Notion page (auto-synced)**

Pandopticon pushes plan data to a Notion page per client. Beautiful out of the box, shareable via URL, clients can comment.

- *Pros:* Notion handles rendering, mobile, and sharing. Easy to set up.
- *Cons:* Adds Notion as a dependency. Another tool in the stack. BHR may not want to adopt Notion org-wide. Doesn't brand as BambooHR.

**F. Email digest after each milestone or meeting**

Instead of a persistent URL, send the client a beautiful HTML email: "Here's where your project stands." Visual timeline, what's done, what's next.

- *Pros:* Meets clients where they are (inbox). No URL to remember. Creates a communication touchpoint.
- *Cons:* Not interactive. Client can't check status on demand. Complements a live view but doesn't replace it.

### Recommended Path

**Start with Approach A** (rendered site). It's the minimum viable version that solves all three requirements. The HRC edits via agent chat (or Sheets directly), the sheet is the backend, the client sees a beautiful URL.

**Grow toward Approach D** (client portal) over time — add meeting summaries, document links, progress history. The rendered site is the seed of the portal.

**Use Approach F** (email digests) as a complement — notify clients when the plan changes, link them back to the live URL.

### The Edit Flow (How It Works End-to-End)

```
HRC in Pandopticon chat: "Push open enrollment to April 15"
        ↓
Agent: "I'll update the project plan — open enrollment moves from March 31 → April 15."
        ↓
    ┌───────────────────────────────────────────┐
    │  Google Sheet updated (source of truth)    │
    ├───────────────────────────────────────────┤
    │  Pandopticon Client Home updated           │
    │  Pandopticon Dashboard updated             │
    │  Pandopticon Prep Brief updated            │
    ├───────────────────────────────────────────┤
    │  Client-facing site updated (same URL)     │
    └───────────────────────────────────────────┘
```

Also triggered automatically via Attention:
```
Client in meeting: "Let's push enrollment to April 15"
        ↓
Attention captures in extractedIntelligence
        ↓
Pandopticon reads Attention → matches to plan row
        ↓
Agent proposes update → HRC approves → same cascade
```

---

## Information Architecture Principles

- **Dashboard** = orient. "What's happening across all my clients today?"
- **Client Home** = prep. "Tell me everything about this client right now."
- **Chat** = act. "Let's work on this specific thing."
- **Agents** = delegate. "Which specialist do I need?"

Each view answers a different question. Calendar/schedule data should surface at the right level, not be crammed into one place.

---

## Salesforce Integration

> See also: [Integration Map](#integration-landscape), `mockups/system-architecture.html`, and product-decisions.json (S16, OP8, Q10)

### Summary

Salesforce integration is straightforward if we stay in the intelligence layer. BambooHR uses a single Salesforce org with a known schema — no multi-org complexity. Pandopticon reads tasks, deadlines, and case status via the Salesforce REST API, surfaces them in existing views (dashboard, client home, prep briefs), and writes back simple updates through AI agents ("mark complete," "log note"). The integration follows the same read→synthesize→surface pattern already established for BambooHR and Calendar. POC can be built with mock data in 1-2 days; production adds OAuth and field mapping against BHR's specific Salesforce schema. Testing requires one free Salesforce Developer Edition org.

### Architecture

**Principle: intelligence layer, not replacement.** Same as calendar — Pandopticon reads and reacts, doesn't become the system of record. Rebuilding Salesforce's CRUD functionality is a maintenance trap.

**Single org simplification.** All BambooHR HRCs use the same Salesforce org with the same objects, fields, and permission model. There is no multi-org mapping problem. The field mapping is built once against BHR's specific schema. The variation is in the *data* (different project types have different task shapes), not the *configuration*.

### Data Flow

**Read path** — Pandopticon pulls from Salesforce via REST API:
- Tasks: what's open, what's overdue, what's due soon, per client
- Cases: status, priority, recent updates
- Deadlines: due dates tied to project milestones

**Surface** — No new Salesforce tab. Data appears in existing views:
- **Dashboard**: "3 overdue tasks across clients" urgency signal
- **Client Home**: Tasks & Deadlines section alongside project plans and meeting prep
- **Prep Briefs**: Meeting Prep Agent includes open/overdue Salesforce tasks in context
- **Chat**: Agents reference task status when relevant ("the compliance filing is due Friday per Salesforce")

**Write-back** — Simple updates via agents, not full CRUD:
- "Mark this task complete" → PATCH task status in Salesforce
- "Log this meeting note" → create a note/activity on the Salesforce record
- "Push this deadline to next Friday" → update due date
- HRC stays in Pandopticon; agent handles the Salesforce API call

**Never own the data.** Salesforce remains source of truth for tasks/cases.

### Implementation

**POC approach:**
- `src/data/salesforce-data.ts` — mock tasks/cases per client, same pattern as calendar-data.ts
- Toggle via env var: `SALESFORCE_MODE=mock|live`
- Add Tasks & Deadlines section to Client Home
- Feed task data into Meeting Prep Agent's context
- Add agent write-back capabilities (simulated in POC)

**Production additions:**
- `/api/salesforce` route — OAuth 2.0 connected app flow (BHR's Salesforce org)
- Field mapping against BHR's specific custom objects/fields (built once, not per-org)
- Polling or webhook-based sync for near-real-time task updates
- Token refresh handling, rate limit awareness

### Testing

**Layer 1 — Mock data (CI, demos):** `salesforce-data.ts` with realistic task shapes across different project types (HRIS migration, benefits enrollment, performance management). Validates UI rendering and agent context injection.

**Layer 2 — Developer Edition org (integration):** Free Salesforce Developer Edition (developer.salesforce.com) populated with HRC-realistic data. Tests OAuth flow, API reads/writes, error handling (expired tokens, permission denials, field validation). One org is sufficient since BHR is a single-org integration.

**Layer 3 — Intelligence validation:** Does the prep brief correctly incorporate Salesforce tasks? Does the dashboard surface the right urgency signals? Does agent write-back correctly update the Salesforce record? Does a task completed in Salesforce reflect in Pandopticon? Test with multiple project types to ensure task variety is handled.

### Two Buckets of Pain (from discovery — see [Current HRC Workflow](#current-hrc-workflow-as-is))

1. **CRUD pain** — "too many clicks to log a task," "confusing views," "forget to update it." This is Salesforce being bad at UX. Not our problem to solve.
2. **Intelligence pain** — "can't see what's urgent across clients," "don't know what to prep," "miss deadlines because nothing connects." This is exactly what Pandopticon solves.
3. **Duplicate work pain** (newly identified) — HRCs maintain the real plan in spreadsheets/slides, then update Salesforce separately. Templates are outdated and require heavy manual editing. This is a third bucket: it's not Salesforce being hard to use (CRUD), it's Salesforce being a redundant step in the workflow.

**Key insight from discovery:** Salesforce is more of a billing/assignment trigger and hours tracker than a daily planning tool. The Customer Profile Doc (Google Docs) is the real source of truth. This means Pandopticon's Salesforce integration should focus on reading task templates/deadlines and writing back status — not trying to make Salesforce the center of the workflow, because it already isn't.

### Interview Questions
- "Walk me through how you start your day — where do you look first?"
- "When you're prepping for a client meeting, what tabs do you have open?"
- "What falls through the cracks, and why?"
- "If Pandopticon could pull in your Salesforce data, what would you want to *see*? What would you want it to *do*?"
- "What do you track in Salesforce vs. what you track in your head / spreadsheets / sticky notes?"

---

## Pull Context, Don't Host Files

> See also: product-decisions.json (D10, Q12)

Pandopticon links to files in their source systems rather than hosting copies. Files already have homes — Google Sheets for plans, Google Docs for profile docs, Google Drive for policies. Uploading creates stale copies (the exact anti-pattern that led to live Sheets integration over one-time import). The value isn't the file — it's the intelligence about the file.

**Fallback:** If API access is blocked (OAuth approval, IT gatekeeping), manual import is a degraded mode. S13 (project plan import) already exists for this. The architecture should prefer live integration and fall back to import if needed — not the other way around.

**The UX will feel like file hosting.** HRCs need to manage what's linked to each client — which Sheets are the project plans, which Doc is the profile doc, which Drive folder has the policies. This looks like "uploading files to a project" from the HRC's perspective, but the underlying operation is linking and reading, not uploading and storing.

**The bigger frame: agent context management.** File linking is one instance of a general problem — HRCs need a way to manage what data the scheduling, prioritization, and project management agents can see and reason about. Which files, which Salesforce tasks, which Attention recordings, which Google Docs. This is an open design question (Q12).

---

## Action Plan Execution Model

Plans have a lifecycle: `pending → approved → executing → completed/paused/stopped/declined`. Steps execute sequentially. Steps marked `nonUndoable: true` pause execution and require explicit approval — this is the safety gate for irreversible operations (payroll processing, tax filing, sending notices).

The HRC is always in control. The AI proposes, the human approves. This is non-negotiable for HR work where mistakes affect real people's paychecks and benefits.
