# 🪐 CryoW3Times — Real-Time Web3 & Crypto News Platform

> **A high-performance, real-time Web3 news aggregator and market intelligence platform built with Next.js 14, TypeScript, and Tailwind CSS.**

---

## 📌 Problem Statement

The Web3 and cryptocurrency ecosystem moves at an overwhelming speed. Critical news, breaking market analysis, sentiment, and video insights are fragmented across disparate channels — Reddit subreddits, traditional RSS feeds, YouTube analysts, and market tickers.

### The Technical Challenge
* **Browser CORS & Rate-Limiting**: Fetching third-party feeds (like Reddit or News APIs) directly from client-side JavaScript triggers strict browser Cross-Origin Resource Sharing (CORS) blocks (`ERR_FAILED`), missing headers, and rate limits (HTTP 429).
* **UI Fragility**: In traditional frontend apps, a failure in a single external API (e.g., Reddit throttling requests) often results in uncaught exceptions that break or blank out the entire user dashboard.
* **Exposed Credentials**: Calling third-party APIs directly from frontend client code risks leaking private environment keys in client-side JS bundles.

### The CryoW3Times Solution
**CryoW3Times** solves these challenges by providing:
1. **Unified Dashboard**: Aggregates breaking news, community discussions (Reddit), market prices (CoinGecko), RSS industry feeds, and YouTube video analytics into a single responsive interface.
2. **Server-Side Proxy Architecture**: Routes external requests through Next.js Server API endpoints (`/api/reddit`, `/api/news`) to bypass browser CORS restrictions and enforce secure server-to-server request headers.
3. **Isolated Feed Resilience**: Implements independent loading and fallback states for each feed source, ensuring that an outage in one third-party service never disrupts the rest of the platform.

---

## 🏗️ Architecture & Data Flow

```
                                  ┌───────────────────────────┐
                                  │      Client Browser       │
                                  └─────────────┬─────────────┘
                                                │
                                                ▼
                                   ┌─────────────────────────┐
                                   │ Next.js App Router UI   │
                                   │  (page.tsx / discover)  │
                                   └────────────┬────────────┘
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 │                              │                              │
                 ▼                              ▼                              ▼
      ┌────────────────────┐         ┌────────────────────┐         ┌────────────────────┐
      │   /api/reddit      │         │     /api/news      │         │   CoinGecko / RSS  │
      │  (Server Proxy)    │         │  (Server Proxy)    │         │    (Client/Direct) │
      └──────────┬─────────┘         └──────────┬─────────┘         └──────────┬─────────┘
                 │                              │                              │
                 ▼                              ▼                              ▼
      ┌────────────────────┐         ┌────────────────────┐         ┌────────────────────┐
      │   Reddit API       │         │     NewsAPI        │         │ Third-Party Feeds  │
      │   (search/hot)     │         │   (v2/everything)  │         │ (Crypto Data/RSS)  │
      └────────────────────┘         └────────────────────┘         └────────────────────┘
```

---

## ✨ Features

* **⚡ Real-Time Crypto Ticker**: Live continuous price bar monitoring **BTC, ETH, XRP, DOGE, SHIB, SOL, ADA** with 24h percentage updates and defensive fallback handling.
* **🔥 Reddit Highlights Feed**: Server-proxied community posts from `/r/CryptoCurrency` formatted into structured article cards with pagination.
* **📰 Multi-Source RSS Aggregation**: Live news feed fetching from leading Web3 outlets (*NewsBTC, Bitcoin Magazine, CryptoPotato*).
* **🎬 YouTube Analytics Carousel**: Video insights and analytical media directly embedded into the main news section.
* **🔍 Category Filtering & Search**: Instant search capability across crypto news, NFTs, DeFi, and market updates.
* **🔐 Authentication System**: Integrated NextAuth with MongoDB adapter supporting Google OAuth and Email/Password authentication.

---

## 📂 Project Folder Structure

```
cryow3times/
├── app/                        # Next.js 14 App Router Directory
│   ├── api/                    # Server-side API Proxy Routes
│   │   ├── auth/[...nextauth]/ # NextAuth authentication endpoint
│   │   ├── news/               # Server proxy for NewsAPI
│   │   └── reddit/             # Server proxy for Reddit endpoints
│   ├── discover/               # Category discovery and search page
│   ├── login/                  # Login page
│   ├── signup/                 # Registration page
│   ├── globals.css             # Global Tailwind styles & dynamic utilities
│   ├── layout.tsx              # Root HTML layout & font providers
│   └── page.tsx                # Main dashboard page
├── components/                 # Reusable UI & Feature Components
│   ├── ui/                     # Radix UI primitives (badge, dialog, button, carousel)
│   ├── NewsFooter/             # Footer & Newsletter subscription components
│   ├── CryptoTicker.tsx        # Real-time price ticker component
│   ├── Icons.tsx               # Icon set definitions
│   ├── Menu.tsx                # Main navigation header
│   └── SeachBox.tsx            # Global search input component
├── hooks/                      # Custom React hooks (e.g. use-toast)
├── lib/                        # Core utilities & database configuration
│   ├── auth.ts                 # NextAuth configuration options
│   ├── db.ts                   # MongoDB MongoClient connection singleton
│   └── utils.ts                # Class merging & utility helpers
├── public/                     # Static assets (logos, fallback images)
├── .env                        # Local environment variables (ignored in Git)
├── .gitignore                  # Git ignore rules for security
├── components.json             # Shadcn UI component settings
├── next.config.js              # Next.js configuration
├── package.json                # Project dependencies & scripts
├── tailwind.config.ts          # Tailwind CSS styling design system
└── tsconfig.json               # TypeScript compiler configuration
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### 1. Installation

Clone the repository and install project dependencies:

```bash
git clone https://github.com/Aayush-Dubey123/CryoW3Times.git
cd CryoW3Times
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database & Auth Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/cryow3times?retryWrites=true&w=majority
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# API Keys (Optional / Server-Side)
NEWS_API_KEY=your_news_api_key
NEXT_PUBLIC_GNEWS_API_KEY=your_gnews_api_key
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
```

### 3. Running Development Server

Launch the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🛠️ Production Build & Verification

To verify TypeScript compilation and build the production bundle:

```bash
# Type check without emitting files
npx tsc --noEmit

# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 🛡️ Security & Quality Guarantees

* **No Leaked Secrets**: All sensitive database URIs and private API keys are kept strictly inside `.env` (ignored by Git).
* **Zero CORS Errors**: All cross-origin third-party fetches are executed on the server side via Next.js Route Handlers.
* **Defensive Rendering**: Price ticker and news lists incorporate safe fallback values to guarantee 100% uptime even under external API rate limits.

---

## 👤 Author

Developed solely by **[aayush-dubey123](https://github.com/Aayush-Dubey123)**.
