# RAPTOR AI 🦅 - Emergency Response System

RAPTOR AI (formerly RoadSOS Magnus) is a next-generation, AI-powered emergency response and first aid assistant web application. It acts as a real-time emergency co-pilot, providing instant triage, geolocation, swipe-to-call integrations, and highly structured, step-by-step first-aid guidance. 

## ✨ Key Features

- 🚨 **One-Touch SOS & Swipe-to-Call**: A giant, highly visible circular SOS button that opens a panic-proof "Swipe-to-Call" interface using `framer-motion`, drastically reducing accidental dials during high-stress situations. It prioritizes Ambulance (108), Police (100), and Universal (112) helplines.
- 🧠 **AI First-Aid Paramedic**: An integrated Large Language Model (configured to act like an expert paramedic) capable of parsing frantic, voice-to-text inputs and returning concise, prioritized, numbered action steps.
- 📍 **Automatic IP-Geolocation**: On clicking "Get Help Now", the backend dynamically extracts the user's IP, pings `ip-api.com` (with an `ipinfo.io` fallback), and injects the user's specific Country and Emergency Numbers directly into the AI's system prompt.
- 🔒 **Local Authentication**: Seamless custom modal-based signup and login flow (replaces heavy OAuth implementations for rapid local testing and development).
- 📱 **Mobile-First Design**: Fully responsive, dark-mode prioritized UI built with TailwindCSS and `shadcn/ui`, perfectly suited for use in the field on mobile devices.
- 💻 **Database Mocking Strategy**: Built to run entirely without friction. The application automatically falls back to an in-memory database store if a MySQL `DATABASE_URL` is not provided in `.env`, preventing crashes during local development.

## 🛠️ Technology Stack

**Frontend:**
*   React 18 + Vite
*   Tailwind CSS + `shadcn/ui` (Radix Primitives)
*   `framer-motion` (Advanced Swipe-to-Call gestures)
*   `wouter` (Lightweight routing)

**Backend:**
*   Node.js + Express
*   tRPC (End-to-end typesafe API)
*   Drizzle ORM (MySQL + Local Mocking Store)
*   Custom LLM Invocation wrapper (`_core/llm`)

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm/yarn/pnpm installed.

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory. At a minimum, if you wish to use a database, you can supply:
```env
DATABASE_URL=mysql://username:password@localhost:3306/raptor_db
```
*(Note: If `DATABASE_URL` is omitted, the app will safely fall back to an in-memory mock database so you can test immediately without setup!)*

### 3. Start the Application
To run both the frontend and backend concurrently via the Vite middleware:
```bash
npm run dev
# OR for direct execution:
$env:NODE_ENV="development"; node --import tsx server/_core/index.ts
```

The application will be accessible at: **`http://localhost:3000`**

## 🏗️ Project Structure

```
raptor-bot/
├── client/                 # React Frontend
│   ├── index.html          # Main HTML template
│   ├── src/
│   │   ├── components/     # Reusable UI (AuthModal, SosModal, shadcn)
│   │   ├── pages/          # Route Pages (Home, EmergencyChat, ChatHistory)
│   │   └── lib/            # tRPC client and utilities
├── server/                 # Express Backend
│   ├── _core/              # System internals (trpc, llm sdk, env)
│   ├── routers/            # API endpoint logic (ai, incidents)
│   ├── utils/              # Geolocation tracking
│   ├── db.ts               # Drizzle database & Local Mock configurations
│   └── index.ts            # Entry point
└── drizzle/                # Database schema
```

## ⚖️ Disclaimer
*RAPTOR AI is an experimental AI application. While designed to mimic emergency response logic, it is an AI and not a licensed doctor. Always prioritize calling official emergency services (911, 112, etc.) in a real life-threatening scenario.*
