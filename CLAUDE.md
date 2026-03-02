# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Services POC - A Next.js 16 single-page application for BambooHR consultants to manage client HR tasks through AI-powered agents. Features a chat interface with action plans (require approval), artifacts (code/tables/documents), clarifying questions, and workflow visualization.

## Commands

- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm start` - Start production server

No test framework is configured.

## Architecture

### Single-Page App (src/app/page.tsx)

All state lives in the root `Home` component (~890 lines). Views are switched via `activeView` state (dashboard/chats/agents). Design variants are switched via `designVariant` state using a `variantMap` that maps to variant-specific component sets.

### Design Variant System

15 design variants (original + v1-v14, where v14 re-exports v13) exist for design exploration. Each variant has 3 component files:
- `chat-view-{variant}.tsx` - Chat interface
- `chat-list-panel-{variant}.tsx` - Sidebar chat list
- `dashboard/dashboard-view-{variant}.tsx` - Dashboard view

**Chat views use a shared `MessageList` component** (`src/components/chat/message-list.tsx`) with a `MessageListTheme` config for per-variant styling. This means functional changes to message rendering (action plans, clarifying questions, artifacts, thinking toggle, etc.) only need to be made once. Each chat-view file keeps its own header, input area, and decorative elements.

Chat-list-panel and dashboard-view variants are NOT yet consolidated — changes to those still need manual replication across all variants.

### Chat Message Flow

1. User sends message → `handleSendMessage` in page.tsx
2. POST to `/api/chat` with message history, clientName, and optional agentId
3. API route loads agent-specific system prompt via `loadAgentPrompt()` if agentId provided
4. Response parsed through three-stage pipeline:
   - `parseArtifacts()` → extracts `<artifact>` tags, replaces with `[ARTIFACT:id]` placeholders
   - `parseClarifyingQuestions()` → extracts `{"clarifyingQuestions":[...]}` JSON blocks
   - `parseActionPlan()` → extracts JSON `{"plan":{...}}` or XML `<action_plan>` blocks
5. Each parser cleans its content before passing to the next
6. Parsed items stored on the Message object; new action plans auto-open the plan panel

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
| `chat/clarifying-questions-card.tsx` | Tabbed multi-step question form with selectable options |
| `artifacts/artifact-card.tsx` | Artifact list items with type-specific icons |
| `artifacts/artifact-panel.tsx` | Side panel for viewing artifact content |
| `plan/plan-panel.tsx` | Resizable right-side panel for plan details and controls |
| `workflow/workflow-panel.tsx` | XYFlow-based workflow visualization |
| `sidebar.tsx` | Main navigation sidebar |

### Radix ScrollArea

The app uses Radix `ScrollArea`. To programmatically scroll, query the viewport child element: `scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]')` — do NOT use the root ref directly.

## Tech Stack

- **Next.js 16** with App Router, React Compiler enabled
- **React 18**, TypeScript strict mode
- **Tailwind CSS 4** (`@import "tailwindcss"` syntax, oklch colors)
- **shadcn/ui** (New York style, CSS variables)
- **OpenAI SDK** — model: `gpt-5.2`, 2000 max completion tokens
- **@xyflow/react** for workflow diagrams
- **@tremor/react** for dashboard charts
- **lucide-react** for icons

## Environment Variables

Requires `OPENAI_API_KEY` in `.env.local`

## Path Alias

`@/*` maps to `./src/*`

## Product Decision Journal

`product-decisions.json` is a living Opportunity Solution Tree. Read it first when resuming work or answering project history questions.

**Rules:** Never delete entries — change `status` instead. Always capture `reasoning`. Use `relatedIds`/`parentId` for hierarchy. This file is separate from the Design Iteration Tracker (`decision-tree-data.json`).
