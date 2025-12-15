# AI Coding Agent Guide

This repo is a Vite + React + TypeScript app that adds a voice negotiation practice feature via Vapi. Use these conventions to be productive fast.

## Architecture & Data Flow
- **Routing:** `src/App.tsx` uses `react-router-dom` with routes for `/`, `/cases`, `/practice/:caseId`, `/leaderboard`, `/learn-more`. Add new pages here above the catch-all `*` route.
- **Pages:** See `src/pages/` for top-level views. Examples: `Index.tsx` (landing), `CaseSelection.tsx` (lists scenarios), `Practice.tsx` (runs voice session), `Leaderboard.tsx`, `LearnMore.tsx`, `NotFound.tsx`.
- **Voice Integration:** `src/components/VoiceInterface.tsx` is the custom voice UI using `@vapi-ai/web`. It:
  - Initializes `Vapi` with `VITE_VAPI_PUBLIC_KEY` and optional per-case `assistantId`.
  - Manages session state via event handlers: `call-start`, `call-end`, `speech-start`, `speech-end`, `volume-level`, `error`, `message`.
  - Starts calls with either a hosted assistant (`assistantId`) or a transient inline `assistant` payload (wrapped under `assistant: { ... }`).
  - Controls are rendered via shadcn `Button`, status shown with `use-toast`.
- **Widget Option:** `src/components/VapiWidget.tsx` wraps `<vapi-widget>` for a drop-in UI using `VITE_VAPI_PUBLIC_KEY` + `VITE_VAPI_ASSISTANT_ID`.
- **UI System:** `src/components/ui/*` are shadcn components; keep styling in Tailwind classes (see `tailwind.config.ts`). Global styles in `src/index.css`, app CSS in `src/App.css`.
- **State/Utils:** `@tanstack/react-query` is configured in `src/App.tsx` (`QueryClientProvider`). Toast via `src/hooks/use-toast`. Common utilities in `src/lib/utils.ts`.
- **Domain Data:** Negotiation scenarios live in `src/data/negotiationCases.ts` with fields like `id`, `title`, `description`, `systemPrompt`, `firstMessage`, `assistantId?`, `publicKey?`, and `scenario` subfields.

## Environment & Secrets
- Required env for voice features (place in `.env.local`):
  - `VITE_VAPI_PUBLIC_KEY`
  - `VITE_VAPI_ASSISTANT_ID` (only for widget or hosted assistant flows)
- Do not put private keys in the frontend. Public key only.
- Restart the dev server after adding/updating env vars.

## Developer Workflow
- **Install & Run:**
  - `npm i`
  - `npm run dev` (Vite server)
- **Build:** `npm run build` then `npm run preview` to locally serve the build.
- **Lint:** Check `eslint.config.js`; run `npm run lint` if present. Follow TypeScript strictness from `tsconfig*.json`.
- **Styling:** Use Tailwind utility classes. Update design tokens in `tailwind.config.ts`. Prefer existing shadcn components from `src/components/ui/*`.

## Patterns & Conventions
- **Routing additions:** Edit `src/App.tsx` to register new routes. Keep the catch-all `*` last.
- **Voice session control:** Use `VoiceInterface` for custom flows; pass a `NegotiationCase` from `CaseSelection` → `Practice`. Update case definitions in `src/data/negotiationCases.ts`.
- **Error handling:** Mirror existing toasts in `VoiceInterface` for user-facing errors (mic permissions, assistant not found, validation errors). Krisp-related warnings are logged and ignored.
- **External SDKs:**
  - Web SDK: `@vapi-ai/web` for custom voice.
  - Embed SDK: `<vapi-widget>` script from `https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js`.
- **Events to leverage:** Consider `vapi.on('message', ...)` in `VoiceInterface.tsx` to capture transcripts or metrics.

## Examples
- **Render the widget:**
  ```tsx
  import { VapiWidget } from "@/components/VapiWidget";
  <VapiWidget />
  ```
- **Start a transient assistant:** In `VoiceInterface.startCall`, payload must be `{ assistant: { model, voice, transcriber, ... } }` and not top-level.
- **Navigate to practice:** From `CaseSelection`, `navigate(`/practice/${negotiationCase.id}`)` pushes the selected case id.

## Integration Notes
- Audio capture requires HTTPS in production.
- Mic permission prompts are triggered before starting the call.
- When cleaning up, always call `vapi.stop()` on unmounts or route changes.

## Where to change what
- New scenario: `src/data/negotiationCases.ts`.
- New page/route: `src/pages/*` + `src/App.tsx`.
- Voice UI/logic: `src/components/VoiceInterface.tsx`.
- Styling tokens/utilities: `tailwind.config.ts`, `src/index.css`.
- Global nav/header: `src/components/Navigation.tsx`.

If anything here is unclear or missing, tell me which part you want expanded (e.g., transient assistant config details, routing, or UI conventions), and I’ll refine these instructions.