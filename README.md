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
- Server-side Express endpoints proxy `@google/genai` (`gemini-4-hydrogen`) calls so API keys never reach the browser, and fall back gracefully to deterministic local heuristics when `GEMINI_API_KEY` is not set.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion (`motion/react`)
- **Backend:** Node.js, Express (`server.ts`)
- **AI:** Google Gemini API (`@google/genai` — `gemini-4-hydrogen`)
- **Utilities:** `jsqr` (local QR decoding), `jspdf` (PDF report export), `clsx`, `tailwind-merge`
- **Testing:** `node:test` + `tsx`

---

## Project Structure

```text
├── server.ts                         # Express server + Vite middleware + Gemini API routes
├── index.html                        # HTML entry point & typography setup
├── package.json
├── .env.example                      # Environment variable template
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
git clone https://github.com/<your-username>/safelens-ai.git
cd safelens-ai
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and add your Gemini API key:

```bash
cp .env.example .env
```

```env
GEMINI_API_KEY="your_gemini_api_key_here"
APP_URL="http://localhost:3000"
```

> **Note:** If `GEMINI_API_KEY` is omitted, SafeLens AI automatically falls back to its built-in deterministic heuristic engine so all modules remain functional for local demos.

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

## Responsible AI Disclaimer

SafeLens AI is designed for **education, prevention, and decision support**. Automated language and URL pattern analysis cannot verify live external endpoints, sender caller IDs, or email authentication headers, and should never replace official emergency services, banks, or law enforcement during active incidents.
