# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Services POC - A Next.js 16 application for BambooHR consultants to manage client HR tasks through AI-powered agents. The app features a chat interface where AI assistants help with payroll, onboarding, benefits, and other HR operations.

## Commands

- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm start` - Start production server

## Architecture

### Single-Page App Structure

The app is a single-page React application with multiple views (dashboard, chats, agents) controlled by `src/app/page.tsx`. All state is managed in the root component.

### Key Flows

**Chat Flow:**
1. User sends message → `handleSendMessage` in page.tsx
2. Message posted to `/api/chat` with conversation history and optional agentId
3. API route loads agent-specific system prompt if agentId provided
4. OpenAI response is parsed for artifacts and action plans
5. Parsed content and extracted items stored in chat state

**Agent System:**
- Agents are defined in `src/data/agents-data.ts`
- Agent prompts are markdown files in `src/data/prompts/` with YAML frontmatter
- Map agent IDs to prompt files in `src/data/prompts/index.ts`
- `src/lib/prompt-loader.ts` loads and parses prompt files at runtime

### LLM Response Parsing

The app extracts structured content from LLM responses:

**Artifacts** (`src/lib/artifact-parser.ts`): Content wrapped in `<artifact title="..." type="code|table|list|document">` tags is extracted and displayed in a side panel.

**Action Plans** (`src/lib/action-plan-parser.ts`): High-stakes operations use `<action_plan>` tags with YAML-like syntax (title, description, steps). Plans require user approval before simulated execution.

### Directory Structure

- `src/app/api/` - API routes (chat, agent-greeting)
- `src/components/` - React components organized by feature (chat, dashboard, agents, workflow, artifacts, ui)
- `src/data/` - Mock data and agent prompts
- `src/lib/` - Utilities and parsers
- `src/types/` - TypeScript interfaces

### Environment Variables

Requires `OPENAI_API_KEY` in `.env.local`

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json)
