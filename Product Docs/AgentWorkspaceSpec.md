# AI Services Platform — Product Requirements Document

## Overview & Background

### Problem

BambooHR Services consultants manage 5–50 clients each, switching context frequently throughout the day. High-stakes HR tasks — running payroll, updating time-off policies, writing handbooks — require speed, accuracy, and safety. Today these tasks involve manual navigation across multiple tools and screens, leading to context-switch friction, missed urgency signals, and slow turnaround.

### Product

A chat-based AI assistant platform that gives consultants a single workspace to manage client HR tasks through specialized AI agents. Consultants select a client, choose an agent, and work through guided conversations that produce action plans, generate documents, and execute real BambooHR operations — all with human-in-the-loop approval gates.

### Target User

**HR Consultants (HRCs)** — internal BambooHR services staff who configure and manage BambooHR accounts on behalf of client companies. Key personas:

- **Frequent switchers** (5–15 clients/day) — need 1–2 click client switching, tab persistence
- **Scale operators** (35+ clients) — need search, filtering, urgency sorting
- **Triage-focused** — need urgency signals and overview before diving into work

### Current State

A working prototype (Next.js 16 SPA) validates the core UX patterns: streaming chat with Vercel AI SDK v6, action plans with approval gates, clarifying questions, artifacts, activity feed (status markers), and 15 design variants for exploration. All agent actions are simulated — no real BambooHR API calls.

### V1 Goal

Ship a production-ready platform with real BambooHR integrations, persistent storage, authentication, and five fully functional agents.

---

## V1 Requirements

### Agents

Five agents ship in V1. Each agent has a specialized system prompt, greeting, and set of BambooHR API tool bindings.

| Agent | Description | Key Capabilities |
|-------|-------------|------------------|
| **Payroll Runner** | End-to-end payroll processing | Multi-step gated workflow, anomaly detection, approval gates at each critical step, rollback support |
| **Company Handbook Writer** | Creates and updates employee handbooks | Pull settings from BHR, generate full handbook drafts, compare handbook vs. settings, consulting mode |
| **Time Off Policies** | Generates and manages PTO/leave policies | Policy creation, accrual configuration, carryover rules, multi-state compliance |
| **Performance Management** | Handles reviews and feedback cycles | Review cycle setup, template generation, feedback collection, calibration support |
| **Forms to Data** | Converts documents into structured BHR data | Document parsing, field mapping, data validation, batch import |

**Payroll Runner detail:** 8-step gated process — each step with `nonUndoable: true` pauses execution and requires explicit consultant approval before proceeding. Anomaly detection flags unusual values (e.g., salary changes >20%, new terminations) for review before submission.

### Chat Experience

- **Streaming responses** via Vercel AI SDK v6 with real-time activity feed
- **Activity feed**: compact status lines (tool call progress) with spinner/checkmark transitions — full response text collapsible behind "Show full response"
- **Per-client tab persistence**: switching clients preserves open chat tabs and scroll position
- **Multi-chat**: Chrome-style tab bar with "+" to create new chats, closeable tabs
- **Agent greeting**: each agent starts with a contextual greeting message

### Action Plans

Agents propose multi-step action plans that require consultant approval before execution.

- **Status lifecycle**: `pending` → `approved` → `executing` → `completed` / `paused` / `stopped` / `declined`
- **Sequential execution**: steps run one at a time with real-time progress
- **Safety gates**: steps marked `nonUndoable` pause execution and require explicit resume (for irreversible operations like submitting payroll)
- **Split-view plan panel**: resizable right-side panel showing plan details and step timeline alongside the chat
- **Anomaly detection**: flag unexpected values during execution for review

### Clarifying Questions

Agents can ask structured, multi-step clarifying questions before proceeding with a task.

- Tabbed question groups with selectable options
- Answers feed back into the conversation context
- Reduces back-and-forth by collecting multiple inputs at once

### Artifacts

Generated documents, code, tables, and checklists are surfaced as artifact cards.

- Type-specific icons and previews
- Side panel for viewing full artifact content
- Artifacts persist across the chat session and are accessible from the sidebar

### BambooHR API Integration

V1 replaces all simulated actions with real BambooHR API tool calls.

- Agents execute via Vercel AI SDK tool bindings (structured `inputSchema`, validated parameters)
- Tool calls stream progress through the activity feed (replacing prototype's `[STATUS: ...]` markers)
- Read and write operations against BHR APIs: employee data, payroll, time-off policies, benefits settings, company settings
- Error handling and retry logic for API failures

### Persistence

- Database-backed storage for: chat history, message content, parsed extras (action plans, artifacts, clarifying questions), plan execution state
- Client context preserved across sessions
- Chat search and history browsing

### Authentication & Multi-User

- User accounts with BambooHR SSO integration
- Role-based access control (admin, consultant, read-only)
- Audit trail for all agent-executed actions

### Client Management

- Sidebar-based client navigation (validated as best approach in prototype)
- Urgency indicators: unread count badges, color-coded borders (red >= 4 unread, amber >= 1)
- Search and filter across client list
- Client metadata display: industry, location, employee count, primary contact
- Urgency-sorted ordering (clients needing attention surface to top)

### Dashboard

- Agent attention alerts (pending approvals, paused plans, anomalies)
- Quick-start suggested actions → launch new chat with pre-selected agent
- Todo list of outstanding items across clients

### Design System

Finalize a single design direction from the 15 prototype variants explored. The shared `MessageList` component with `MessageListTheme` config carries forward — variant-specific styling is theme configuration, not code duplication.

Key UX patterns validated in prototype:
- Collapsible sidebar navigation
- Split-view chat + plan panel
- Activity feed with collapsible full text
- Structured cards for action plans, clarifying questions, artifacts

---

## Out of Scope (V1)

- **Mobile / responsive design** — desktop-only for V1
- **Agents beyond the initial 5** — additional agents are post-V1
- **Cross-client analytics and reporting** — aggregate dashboards across clients
- **Public API / third-party integrations** — only BambooHR APIs in V1
- **Workflow visualization editor** — read-only workflow diagrams only

---

## User Flows

### Starting a New Conversation

1. Consultant selects a client from the sidebar
2. Clicks "+" on the tab bar or selects an agent from the agents panel
3. Agent sends contextual greeting
4. Consultant describes their task
5. Agent streams response with activity feed progress

### Action Plan Lifecycle

1. Agent proposes a multi-step action plan
2. Plan appears as a card in chat + detail in the split-view plan panel
3. Consultant reviews steps, approves or declines
4. On approval, steps execute sequentially with real-time progress
5. At safety gates (`nonUndoable` steps), execution pauses — consultant reviews and explicitly resumes
6. On anomaly detection, execution pauses with flagged values highlighted
7. Completion summary with artifacts generated (if applicable)

### Dashboard Quick-Start

1. Consultant opens the dashboard
2. Sees attention alerts: "3 plans awaiting approval", "Payroll anomaly for Client X"
3. Clicks a suggested action
4. App navigates to the relevant client + chat with context pre-loaded

### Client Switching

1. Consultant clicks a different client in the sidebar
2. Previous client's tabs and scroll positions are preserved
3. New client's workspace loads with their existing tabs (or empty state)
4. Urgency indicators update in real-time

---

## Technical Architecture

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Next.js (App Router), React, TypeScript | Single-page app with client-side routing |
| Styling | Tailwind CSS v4, shadcn/ui | CSS variables, oklch colors |
| AI | Vercel AI SDK v6, `streamText`/`useChat` | Real tool calls replace status markers |
| LLM | TBD (currently GPT-5.2) | Model selection may change for V1 |
| Diagrams | @xyflow/react | Workflow visualization |
| Charts | @tremor/react | Dashboard analytics |
| Database | TBD | Chat history, plan state, client context |
| Auth | TBD | BambooHR SSO integration |
| APIs | BambooHR REST API | Real tool execution |

### Streaming Architecture (V1 upgrade)

The prototype uses LLM-emitted `[STATUS: ...]` text markers parsed client-side into an activity feed. V1 replaces these with real Vercel AI SDK tool calls — each tool invocation naturally produces structured progress events, eliminating the need for marker parsing.

### Key Architectural Decisions

- **Per-chat session layer**: each chat gets its own streaming session (`useStreamingChatSession` hook) keyed by `chatId`, preventing state bleed when switching chats mid-stream
- **Five-stage parsing pipeline**: status → artifacts → clarifying questions → action plan → approval request (runs in `onFinish`)
- **ParsedExtras ref + parseVersion counter**: parsed data stored in a `Map<messageId, ParsedExtras>` ref, with a counter state bumped to force React re-derivation
- **Shared MessageList**: all design variants use one `MessageList` component with a `MessageListTheme` config object

---

## Roadmap (Post-V1)

| Phase | Items |
|-------|-------|
| **V1.1** | Mobile / responsive layout, chat search, bulk actions |
| **V2** | Additional agents (CX Oracle, Benefits, Time Tracking, Culture Consultant), cross-client analytics dashboard |
| **V3** | Advanced workflow automation (agent-to-agent handoff), custom agent builder, third-party integrations |
| **Future** | Public API, white-label support, multi-language |

---

## Open Questions

| Question | Context | Impact |
|----------|---------|--------|
| Database / persistence strategy | Need to store chat history, plan state, artifacts, client context | Blocks backend development |
| Auth provider | BambooHR SSO vs. standalone auth | Blocks multi-user support |
| Which design variant to finalize | 15 variants explored; need to select one direction | Blocks design system finalization |
| Client switching UX | Sidebar (leading), dropdown, or tab groups | Validated sidebar in prototype but final decision needed |
| LLM model for V1 | Currently GPT-5.2; evaluate alternatives | Affects cost, latency, capability |
| BHR API access scope | Which endpoints are available for tool execution | Defines agent capability boundaries |
