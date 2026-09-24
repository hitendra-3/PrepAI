# PrepAI – AI Study Assistant
> **Turn your notes into active learning.**  
> *AI-Powered Interactive Study Tool*

PrepAI is an interactive study assistant built with React and Node.js. It transforms free-form study notes or topics into structured learning materials using Google Gemini (`gemini-2.5-flash`). 

Instead of a generic chatbot, PrepAI enforces strict structured JSON schemas on both the client and server, turning raw model outputs into interactive **3D flip flashcards**, **multiple-choice quizzes with instant feedback**, and a **targeted in-memory wrong-answer retry engine**.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    User([User: Enters Topic / Notes]) --> Frontend[React Frontend: PromptInput & Options]
    Frontend -->|POST /api/generate| Backend[Node / Express Backend Proxy]
    Backend -->|Strict System Prompt & Schema| LLM[Google Gemini LLM: gemini-2.5-flash]
    LLM -->|Structured JSON Output| BackendValidator[Backend Response Validator]
    BackendValidator -->|Clean JSON Response| ClientValidator[Frontend Schema Validator]
    
    ClientValidator -->|Valid Data| State[React State: useStudySet]
    ClientValidator -->|Invalid / Error| ErrorUI[Error State with Retry]
    
    State --> Overview[Study Set Overview]
    Overview --> Flashcards[Interactive 3D Flashcards]
    Overview --> Quiz[Multiple-Choice Quiz]
    
    Quiz --> Results[Quiz Results Dashboard]
    Results --> WrongReview[Wrong Answers Review]
    WrongReview -->|In-Memory Retry No API Call| Quiz
```

---

## ✨ Features

- **Interactive 3D Flashcards**:
  - CSS 3D perspective flip between question and detailed answer with key takeaway callouts.
  - Full keyboard navigation (`Space` / `Enter` to flip, `←` / `→` for previous/next).
  - Bookmark difficult cards with the review star filter.
  - Shuffle deck order for randomized practice.

- **Multiple-Choice Quiz**:
  - 4 answer choices per question with zero hint exposure prior to submission.
  - Instant validation on submit with color-coded feedback and educational explanations.
  - Progress indicator and score tracking.

- **Targeted Wrong-Answer Retry**:
  - Review only missed questions side-by-side with your chosen answer vs correct answer.
  - Re-tests wrong questions **in-memory without making duplicate LLM API calls**, conserving tokens and reducing latency.

- **Local Storage History & Search**:
  - Automatically saves generated study sets locally in browser `localStorage`.
  - Search past study sets by topic, summary, or key concepts.
  - Favorite/bookmark sets for quick access.

---

## 🛡️ Failure Handling & Edge Cases

| Failure Mode | How PrepAI Handles It |
| :--- | :--- |
| **Malformed JSON** | Backend sanitizes markdown code blocks, attempts parsing, and catches syntax errors. Frontend displays a clean error banner with a retry action. |
| **Wrong Shape / Missing Fields** | Dual-layer validation on both server (`responseValidator.js`) and client (`validateResult.ts`) verifies required fields, array integrity, and exactly 4 quiz options. |
| **Empty AI Response** | Explicitly caught before parsing and routed to the user-facing error state. |
| **Stale Responses** | Guarded by `useRef` sequence tracking and `AbortController` cancellation to prevent older, slower responses from overwriting newer ones. |
| **Slow / Pending Requests** | Multi-step progress checklist (`LoadingState`) provides real-time visual feedback while the model generates content. |
| **API Key Security** | The Gemini API key is stored exclusively on the server and is never exposed to the browser client. |

---

## 💻 Tech Stack

- **Frontend**: React 18, TypeScript, Vite 6, Lucide React, Canvas Confetti, Vanilla CSS (Design Tokens inspired by Notion & Linear).
- **Backend**: Node.js, Express, `@google/generative-ai` SDK (`gemini-2.5-flash`), CORS, Dotenv, Concurrently.

---

## 📁 Project Structure

```
├── server/
│   ├── index.js                     # Express server & request logger
│   ├── routes/
│   │   └── generate.js              # POST /api/generate endpoint
│   ├── services/
│   │   └── llmService.js            # Gemini API integration
│   ├── prompts/
│   │   └── studyPrompt.js           # Strict system & user prompts
│   └── validators/
│       └── responseValidator.js     # Backend JSON sanitizer & validator
│
├── src/
│   ├── App.tsx                      # App root router & state manager
│   ├── index.css                    # Design tokens & layout styles
│   ├── main.tsx                     # React root DOM renderer
│   ├── types/
│   │   └── study.ts                 # Study set & quiz type definitions
│   ├── lib/
│   │   ├── api.ts                   # API client
│   │   ├── validateResult.ts        # Client schema validator
│   │   └── storage.ts               # LocalStorage persistence manager
│   ├── hooks/
│   │   ├── useLocalStorage.ts       # Storage hook
│   │   ├── useStudySet.ts           # Generation & stale request hook
│   │   └── useQuiz.ts               # Quiz state machine & retry hook
│   ├── components/
│   │   ├── layout/                  # AppShell, Sidebar, Header
│   │   ├── input/                   # PromptInput, GenerationOptions, GenerateButton
│   │   ├── states/                  # LoadingState, ErrorState, EmptyState
│   │   └── study/                   # FlashcardDeck, QuizView, WrongAnswerReview
│   └── pages/                       # Home, CreateStudySet, StudySet, History
│
├── .env.example                     # Environment variables template
├── package.json                     # Scripts for dev and start
└── tsconfig.json                    # TypeScript compiler config
```

---

## 🚀 Setup & Running Locally

### 1. Prerequisites
- Node.js `v18+` or `v20+`
- npm `v9+`

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the Application
```bash
npm start
```
*(Or `npm run dev` — runs the Express backend on `http://localhost:3001` and Vite client on `http://localhost:5173` concurrently)*

---

## 🤖 AI Usage Note

AI tools were used during development to accelerate initial boilerplate creation, prototype CSS design tokens, and explore structured prompt constraints. The core application logic, dual-layer validation schema, stale request mitigation with `AbortController`, quiz state transitions, and in-memory retry mechanism were reviewed, implemented, and verified.

---

## ⏳ Time Spent

- **Architecture & Prompt Design**: ~1.0 hr
- **Backend Proxy & Gemini Integration**: ~1.0 hr
- **React Components & Custom Hooks**: ~2.0 hrs
- **Failure Handling & Validation Pipeline**: ~1.5 hrs
- **UI/UX Polish & Responsiveness**: ~1.0 hr
- **Testing & Documentation**: ~0.5 hr
- **Total Time**: **~7.0 hours**

---

## 🔍 Known Limitations

1. **Full Generation before Render**: The application waits for the full structured JSON payload before rendering the study set. Future versions could support partial JSON stream parsing.
2. **Export Formats**: Currently saves to browser `localStorage`; direct export to Anki (`.apkg`) or PDF could be added.
