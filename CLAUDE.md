# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Services POC - A Next.js 16 application for BambooHR consultants to manage client HR tasks through AI-powered agents. The app features a chat interface where AI assistants help with payroll, onboarding, benefits, and other HR operations.

## Commands

- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint (configured in eslint.config.mjs)
- `npm start` - Start production server

## Architecture

### Single-Page App Structure

The app is a single-page React application with multiple views (dashboard, chats, agents) controlled by `src/app/page.tsx`. All state (chats, agents, selected views, artifacts, workflows) is managed in this root component (~580 lines). State flows down to view components as props, and callbacks flow up to handle user actions.

**Key State in page.tsx:**
- `chats` - All chat conversations
- `agents` - Agent definitions
- `activeView` - Current view (dashboard/chats/agents)
- `selectedChatId` - Active chat
- `selectedArtifactId` - Artifact being viewed in side panel
- `workflowPanelOpen` - Workflow visualization state

### Key Flows

**Chat Flow:**
1. User sends message → `handleSendMessage` in page.tsx
2. Message posted to `/api/chat` with conversation history and optional agentId
3. API route loads agent-specific system prompt if agentId provided (via `src/lib/prompt-loader.ts`)
4. OpenAI response is parsed for artifacts and action plans
5. Parsed content and extracted items stored in chat state

**Agent System:**
- Agents are defined in `src/data/agents-data.ts`
- Agent prompts are markdown files in `src/data/prompts/` with YAML frontmatter
- Map agent IDs to prompt files in `src/data/prompts/index.ts`
- `src/lib/prompt-loader.ts` loads and parses prompt files at runtime

**Adding a New Agent:**
1. Create agent prompt markdown file in `src/data/prompts/` (with YAML frontmatter)
2. Add mapping in `src/data/prompts/index.ts` (agentPromptMap)
3. Add agent definition to `src/data/agents-data.ts`

### LLM Response Parsing

The app extracts structured content from LLM responses:

**Artifacts** (`src/lib/artifact-parser.ts`): Content wrapped in `<artifact title="..." type="code|table|list|document">` tags is extracted and displayed in a side panel.

**Action Plans** (`src/lib/action-plan-parser.ts`): High-stakes operations use `<action_plan>` tags with YAML-like syntax (title, description, steps). Plans require user approval before simulated execution.

### Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Component library (New York style, configured in components.json)
- **Tremor React** - Dashboard and chart components
- **Lucide React** - Icon library
- UI components are in `src/components/ui/` (button, dialog, dropdown-menu, input, scroll-area)

### Directory Structure

- `src/app/api/` - API routes (chat, agent-greeting)
- `src/components/` - React components organized by feature (chat, dashboard, agents, workflow, artifacts, ui)
- `src/data/` - Mock data and agent prompts
- `src/lib/` - Utilities and parsers
- `src/types/` - TypeScript interfaces

### Tech Stack Notes

- **Next.js 16** with App Router
- **React 18** with React Compiler enabled (experimental optimization in next.config.ts)
- **TypeScript** with strict mode
- **OpenAI SDK** for LLM integration
- **XYFlow** (@xyflow/react) for workflow visualization

### Environment Variables

Requires `OPENAI_API_KEY` in `.env.local`

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json)
