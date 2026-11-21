# SafeLens AI

**Understand Risk Before You Trust.**

SafeLens AI is an AI-powered personal safety companion built for **SafeSpace Hacks** that helps people identify, understand, and prevent everyday digital and real-world safety risks. Instead of alarmist "SAFE / DANGER" banners, SafeLens AI explains *why* something may be risky, *what warning signs* are present, and *what safer step* to take next.

---

## Key Features

- **Message Analyzer** — Analyze SMS, WhatsApp messages, and emails for urgency, fear tactics, OTP/credential harvesting, upfront fee scams, and suspicious links. Includes an **"Explain Like I’m 10"** mode and calibrated confidence notes.
- **QR Code Safety Scanner** — Decodes QR code images locally in the browser using `jsQR` and holds destinations in a **Safe Preview** without ever auto-launching URLs or payment prompts.
- **URL Safety Checker** — Checks HTTPS status, suspicious keywords, subdomain depth, and Levenshtein/homoglyph typosquatting (e.g., `amaz0n-login.com` imitating `amazon.com`) with a `0–100` Trust Score.
- **Permission Translator** — Upload a mobile app permission screenshot (or test with a sample prompt) to translate permissions like Camera, Contacts, and Location into **Plain English**, **Child Friendly** explanations, and risk levels.
- **"Before You Click" Consequence Educator** — Every analysis includes an interactive breakdown showing *What could go wrong if I ignore this warning?*, warning signs, and a safer alternative.
- **Daily Life Safety Advisor** — 22 structured 5-step safety guides across **Digital Safety**, **Physical Safety**, **Family Safety**, and **Emergency Preparedness**, complete with search, category filters, and interactive topic Q&A.
- **Safety Academy & Personal Safety Score** — 8 interactive lessons with real-world examples and graded quick quizzes that dynamically calculate a local `0–100` Safety Score across Digital Awareness, Privacy Protection, Scam Resistance, and Preparedness.
- **Trust & Responsible AI** — Transparent breakdown of what AI can and cannot verify, model limitations, zero-database privacy, and calibrated uncertainty phrasing (`Potential Risk`, `Possible Concern`, `Cannot Verify`, `May Indicate`).
- **PDF Report Export & Dual Theme** — Export individual analysis reports or your Safety Score summary to PDF via `jsPDF`, with full Dark Mode / Light Mode support.

---

## Privacy-First Architecture (No Database)

SafeLens AI intentionally runs **without** any external database, user accounts, or authentication:

- Analysis history, Safety Academy progress, quiz scores, and theme preferences are stored exclusively in browser `localStorage`.
- QR code decoding happens locally on an HTML5 `<canvas>` via `jsQR`.
- On local/Render hosting, the Express server provides API routes; on Vercel, the same routes run as on-demand functions in `api/`, backed by `app.ts`. The Gemini API key stays server-side. The current Gemini model name in `app.ts` is `gemini-4-hydrogen`; check that your key can access this model. When AI is not configured or an AI call fails, some routes return heuristic or sample guidance instead of AI output.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion (`motion/react`)
- **Backend:** Express API (`app.ts`), traditional Node.js entrypoint (`server.ts`), and Vercel HTTP functions (`api/`)
- **AI:** Google Gemini API (`@google/genai`); model currently configured in `app.ts` as `gemini-4-hydrogen`
- **Utilities:** `jsqr` (local QR decoding), `jspdf` (PDF report export), `clsx`, `tailwind-merge`
- **Testing:** `node:test` + `tsx`

---

## Project Structure

```text
├── app.ts                            # Express app with API handlers and Gemini integration
├── server.ts                         # Traditional local/Render server with Vite middleware
├── api/                              # Vercel function entrypoints (6 endpoints)
│   ├── health.ts
│   ├── analyze/                      # message, url, qr, permissions
│   └── advisor/                      # ask
├── vercel.json                       # Vite build and SPA fallback
├── index.html                        # HTML entry point & typography setup
├── package.json
└── src/
    ├── App.tsx                       # Root application & section routing
    ├── index.css                     # Tailwind CSS v4 & dark mode variant
    ├── types/
    │   └── safety.ts                 # Shared TypeScript interfaces
    ├── lib/
    │   ├── prompts.ts                # Reusable Gemini prompt builders
    │   ├── safetyEngine.ts           # Deterministic heuristics, scoring & heatmap logic
    │   ├── safetyEngine.test.ts      # Unit tests (node:test)
    │   ├── qrEncoder.ts              # Pure-TS QR matrix generator for sample QRs
    │   ├── pdfExport.ts              # jsPDF report generator
    │   ├── storage.ts                # Safe localStorage persistence wrapper
    │   └── utils.ts                  # Classname merge helper
    ├── hooks/
    │   └── useSafeLensStore.ts       # State hook for history, score, progress & theme
    ├── data/
    │   ├── dailyAdvisorData.ts       # 22 Daily Life Safety Advisor guides
    │   ├── academyData.ts            # 8 Safety Academy lessons & quizzes
    │   └── sampleInputs.ts           # Demo messages, URLs, tips & sample permission image
    └── components/
        ├── LandingPage.tsx
        ├── WorkspaceShell.tsx
        ├── DashboardOverview.tsx
        ├── MessageAnalyzer.tsx
        ├── QrScanner.tsx
        ├── UrlChecker.tsx
        ├── PermissionTranslator.tsx
        ├── DailySafetyAdvisor.tsx
        ├── SafetyAcademy.tsx
        ├── SafetyScoreView.tsx
        ├── TrustTransparencyView.tsx
        ├── BeforeYouClickPanel.tsx
        ├── RiskSignalHeader.tsx
        └── ui/
            └── Primitives.tsx
```

---

## Getting Started

### 1. Clone the repository & install dependencies

```bash
git clone https://github.com/abhigoud0008/SafeLensAI.git
cd SafeLensAI
npm install
```

### 2. Configure environment variables

Create a local `.env` file in the repository root (never commit the real key):

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

The app can run in heuristic/demo mode without a Gemini API key. Note that the configured model must be available to your key for live Gemini-generated answers.

> **Note:** Without a valid `GEMINI_API_KEY`, message, URL, and QR analysis use heuristics. Some features such as permission interpretation may display sample/fallback data rather than a real AI interpretation.

### 3. Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build & run in production

```bash
npm run build
npm start
```

---

## Testing & Verification

Run TypeScript type-checking and unit tests:

```bash
npm run lint
npx tsx --test src/lib/safetyEngine.test.ts
```

---

## API Endpoints

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check and AI key configuration status |
| `/api/analyze/message` | `POST` | Analyzes SMS, WhatsApp, or email text |
| `/api/analyze/url` | `POST` | Evaluates URL structure, HTTPS, and typosquatting |
| `/api/analyze/qr` | `POST` | Evaluates decoded QR payload (URL, UPI, Wi-Fi, text) |
| `/api/analyze/permissions` | `POST` | Translates uploaded permission screenshots and notes |
| `/api/advisor/ask` | `POST` | Answers follow-up questions in the Safety Advisor |

---

## Deploy to Vercel (Vite + Serverless APIs)

Vercel deploys the React/Vite frontend as static files and the six API entrypoints in `api/` as on-demand functions. **Do not configure `npm start` as the Vercel start command.** That script is for the traditional local/Render server, not Vercel Functions.

1. Visit [Vercel New Project](https://vercel.com/new), sign in with GitHub, and import [abhigoud0008/SafeLensAI](https://github.com/abhigoud0008/SafeLensAI).
2. Use the **Vite** framework preset, project root `./`, build command `npm run build`, output directory `dist`, and a supported Node.js version (22.x is suitable for this project).
3. In **Project Settings → Environment Variables**, add `GEMINI_API_KEY` as a server-side variable for Production. Do not expose it as a `VITE_` variable or commit it to Git.
4. Deploy the latest `main` branch. Future GitHub commits can trigger new deployments if automatic deployment is enabled.
5. Verify `https://YOUR-PROJECT.vercel.app/api/health` returns JSON with `ok: true`. The `aiConfigured` field only indicates that an API key is present; it does not prove the model call will succeed.
6. Open the website, then test **Message Analyzer**, **URL Checker**, **QR Scanner**, **Permission Translator**, and **Safety Advisor** using actual requests.

The relevant Vercel files are `vercel.json`, `api/health.ts`, `api/analyze/*.ts`, `api/advisor/ask.ts`, and `app.ts`. The Node.js Functions are **not permanently running web servers**; usage, duration, and request-size limits apply. Vercel Hobby is intended for personal, non-commercial use within its limits. The Gemini Developer API has separate availability, quotas, and potential charges.

### Troubleshooting

- **Frontend works, API fails with 500:** Check **Vercel → Project → Logs** for a function exception. A build marked `Ready` does not verify runtime API behavior.
- **`ERR_MODULE_NOT_FOUND` referencing `/var/task/app` or `/var/task/server`:** Check that the latest committed Vercel API entrypoints use explicit `.js` imports. Avoid importing the local Vite server entrypoint inside functions.
- **`Unexpected token ... is not valid JSON`:** An API request likely received an HTML/plain-text error response. Check the HTTP status, response body, and corresponding function logs.
- **`aiConfigured: false`:** Add `GEMINI_API_KEY` in Vercel and redeploy. If true but Gemini calls fail, inspect the logs for an invalid model, API key permissions, or quota exhaustion.
- **Deep SPA route reload gives 404:** Check the fallback rewrite in `vercel.json`.

Official deployment reference: [Vercel's Vite guide](https://vercel.com/docs/frameworks/frontend/vite).

---

## Responsible AI Disclaimer

SafeLens AI is designed for **education, prevention, and decision support**. Automated language and URL pattern analysis cannot verify live external endpoints, sender caller IDs, or email authentication headers, and should never replace official emergency services, banks, or law enforcement during active incidents.
