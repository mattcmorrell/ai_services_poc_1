# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⛔ Before finishing ANY HTML, CSS, or styled output — STOP AND CHECK:

- [ ] No text color below `#999` on dark backgrounds (#1a–#2a range)
- [ ] No text color lighter than `#666` on light backgrounds (#f0+)
- [ ] No `font-size` below `11px` anywhere. 13px floor for body text.
- [ ] No `opacity` below `0.6` on any text element
- [ ] "Muted" text is still clearly readable at a glance — not ghostly
- [ ] Body text defaults to 14px, not 13px (13px is compact exception only)
- [ ] Stat values / hero numbers are 16px+

**This is the #1 recurring issue. Grep your output for color declarations and font-size values before you're done. Every time.**

## Project Overview

AI Services POC - A Next.js 16 single-page application for BambooHR consultants to manage client HR tasks through AI-powered agents. Features a chat interface with action plans (require approval), artifacts (code/tables/documents), clarifying questions, and workflow visualization.

## Architecture

### Single-Page App (src/app/page.tsx)

All state lives in the root `Home` component (~890 lines). Views are switched via `activeView` state (dashboard/chats/agents). Design variants are switched via `designVariant` state using a `variantMap` that maps to variant-specific component sets.

### Shared Message Rendering

**Chat views use a shared `MessageList` component** (`src/components/chat/message-list.tsx`) with a `MessageListTheme` config for per-variant styling. This means functional changes to message rendering (action plans, clarifying questions, artifacts, thinking toggle, etc.) only need to be made once. Each chat-view file keeps its own header, input area, and decorative elements.

Chat-list-panel and dashboard-view variants are NOT yet consolidated — changes to those still need manual replication across all variants.

### Chat Message Flow (Streaming)

Uses Vercel AI SDK v6 for streaming responses. Per-chat session architecture:

1. User sends message → `useStreamingChatSession` hook calls `sendMessage`
2. `DefaultChatTransport` POSTs to `/api/chat` with `UIMessage[]`, `clientName`, `agentId`
3. API route uses `streamText()` + `toUIMessageStreamResponse()` (not raw OpenAI SDK)
4. During streaming: live `[STATUS: ...]` markers extracted and shown as activity feed
5. On `onFinish`, five-stage parsing pipeline runs on completed text:
   - `parseStatusUpdates()` → extracts `[STATUS: ...]` markers
   - `parseArtifacts()` → extracts `<artifact>` tags
   - `parseClarifyingQuestions()` → extracts `{"clarifyingQuestions":[...]}` JSON blocks
   - `parseActionPlan()` → extracts JSON `{"plan":{...}}` or XML `<action_plan>` blocks
   - `parseApprovalRequest()` → extracts gate approval patterns
6. Parsed extras stored in a `Map<messageId, ParsedExtras>` ref, synced back to `chats` state
7. `message-list.tsx` renders activity feed (collapsed text) + structured cards

**Key files:**
- `src/hooks/use-streaming-chat-session.ts` — per-chat streaming hook wrapping `useChat`
- `src/lib/ai/provider.ts` — `getModel()` returning `openai("gpt-5.2")`
- `src/lib/ai/message-adapter.ts` — `UIMessage` ↔ app `Message` conversion
- `src/lib/status-parser.ts` — `[STATUS: ...]` marker extraction (live + final)

**Gotcha:** After `onFinish` parses extras into a ref, the `useMemo` that converts messages won't re-run unless a `parseVersion` counter state is bumped. This forces React to re-derive messages with the parsed content.

### Action Plan Execution

Plans have a status lifecycle: pending → approved → executing → completed/paused/stopped/declined. Steps execute sequentially via `simulateExecutionForChat`. Steps with `nonUndoable: true` pause execution and require manual resume (safety gate for irreversible operations).

### Agent System

- Agent definitions: `src/data/agents-data.ts` (16 agents with icons, favorites)
- Agent prompts: Markdown files with YAML frontmatter in `src/data/prompts/`
- Prompt file mapping: `src/data/prompts/index.ts` (`agentPromptMap`)
- Loader: `src/lib/prompt-loader.ts` parses frontmatter for greeting + system prompt

**Adding a new agent:**
1. Create `src/data/prompts/agent-{name}.md` with YAML frontmatter (greeting field) and system prompt body
2. Add entry in `src/data/prompts/index.ts`
3. Add agent definition to `src/data/agents-data.ts`

### Key Components

| Component | Purpose |
|-----------|---------|
| `chat/message-list.tsx` | Shared message renderer with `MessageListTheme` — all functional rendering lives here |
| `chat/action-card.tsx` | Full action plan card with step timeline, approval buttons |
| `chat/action-card-compact.tsx` | Compact plan card (used in OG + v5 variants with split plan panel) |
| `chat/activity-feed.tsx` | Compact status lines with spinner/checkmark (Claude Code-style) |
| `chat/clarifying-questions-card.tsx` | Tabbed multi-step question form with selectable options |
| `artifacts/artifact-card.tsx` | Artifact list items with type-specific icons |
| `artifacts/artifact-panel.tsx` | Side panel for viewing artifact content |
| `plan/plan-panel.tsx` | Resizable right-side panel for plan details and controls |
| `workflow/workflow-panel.tsx` | XYFlow-based workflow visualization |
| `sidebar.tsx` | Main navigation sidebar |

### Radix ScrollArea

The app uses Radix `ScrollArea`. To programmatically scroll, query the viewport child element: `scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]')` — do NOT use the root ref directly.

### Activity Feed (Status Markers)

Agent prompts include instructions to emit `[STATUS: description]` markers during multi-step work. These are parsed into compact activity lines (Claude Code-style) with spinner → checkmark transitions. Full text is collapsible behind "Show full response". This is a hybrid approach — markers are LLM-generated text now, structured to be replaceable with real Vercel AI SDK tool calls later.

## Tech Stack

- **Next.js 16** with App Router, React Compiler enabled
- **React 18**, TypeScript strict mode
- **Tailwind CSS 4** (`@import "tailwindcss"` syntax, oklch colors)
- **shadcn/ui** (New York style, CSS variables)
- **Vercel AI SDK v6** (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`) — streaming via `streamText`/`useChat`
- **Model:** `gpt-5.2`, 2000 max output tokens
- **@xyflow/react** for workflow diagrams
- **@tremor/react** for dashboard charts
- **lucide-react** for icons

### Vercel AI SDK v6 Conventions
- `convertToModelMessages()` is async — must `await`
- `UIMessage` uses `.parts[]` (not `.content`) — use `getTextFromParts()` helper
- `useChat` config: `DefaultChatTransport({ api, body })` — no `input`/`handleSubmit`/`append`
- `onFinish` receives `({ message })` not `(msg)`
- `maxOutputTokens` not `maxTokens` in `streamText()`

## Environment Variables

Requires `OPENAI_API_KEY` in `.env.local`

## Path Alias

`@/*` maps to `./src/*`

## Product Decision Journal

`product-decisions.json` is a living Opportunity Solution Tree. Read it first when resuming work or answering project history questions.

**Rules:** Never delete entries — change `status` instead. Always capture `reasoning`. Use `relatedIds`/`parentId` for hierarchy. This file is separate from the Design Iteration Tracker (`decision-tree-data.json`).
