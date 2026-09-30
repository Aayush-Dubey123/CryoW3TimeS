# 🪐 CryoW3Times — Real-Time Web3 & Crypto News Platform

> **A high-performance, real-time, completely public Web3 news aggregator and market intelligence platform built with Next.js 14, TypeScript, and Tailwind CSS.**

---

## 📌 Problem Statement

The Web3 and cryptocurrency ecosystem moves at an overwhelming speed. Critical news, breaking market analysis, sentiment, and video insights are fragmented across disparate channels — Reddit subreddits, traditional RSS feeds, YouTube analysts, and market tickers.

### The Technical Challenge
* **Browser CORS & Rate-Limiting**: Fetching third-party feeds directly from client-side JavaScript triggers strict browser Cross-Origin Resource Sharing (CORS) blocks (`ERR_FAILED`), missing headers, and rate limits (HTTP 429).
* **UI Fragility**: In traditional frontend apps, a failure in a single external API often results in uncaught exceptions that break or blank out the entire user dashboard.
* **Frictionless Public Access**: Requiring users to authenticate or maintain database accounts creates unnecessary barriers for instant access to real-time market updates.

### The CryoW3Times Solution
**CryoW3Times** solves these challenges by providing:
1. **Public, Frictionless Access**: Zero accounts, zero authentication, zero tracking — immediate real-time news for every visitor.
2. **Unified Dashboard**: Aggregates breaking news, community discussions (Reddit), market prices (CoinGecko), RSS industry feeds, and YouTube video analytics into a single responsive interface.
3. **Server-Side Proxy Architecture**: Routes external requests through Next.js Server API endpoints (`/api/reddit`, `/api/news`) to bypass browser CORS restrictions and enforce secure server-to-server request headers.
4. **Isolated Feed Resilience**: Implements independent loading and fallback states for each feed source, ensuring that an outage in one third-party service never disrupts the rest of the platform.

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

---

## 📂 Project Folder Structure

```
cryow3times/
├── app/                        # Next.js 14 App Router Directory
│   ├── api/                    # Server-side API Proxy Routes
│   │   ├── news/               # Server proxy for NewsAPI
│   │   └── reddit/             # Server proxy for Reddit endpoints
│   ├── discover/               # Category discovery and search page
│   ├── globals.css             # Global Tailwind styles & dynamic utilities
│   ├── layout.tsx              # Root HTML layout & font providers
│   └── page.tsx                # Main dashboard page
├── components/                 # Reusable UI & Feature Components
│   ├── ui/                     # Radix UI primitives (badge, dialog, button, carousel)
│   ├── NewsFooter/             # Footer & Newsletter subscription components
│   ├── CryptoTicker.tsx        # Real-time price ticker component
│   ├── Icons.tsx               # Icon set definitions
│   └── SeachBox.tsx            # Global search input component
├── hooks/                      # Custom React hooks (e.g. use-toast)
├── lib/                        # Core utilities
│   ├── init-middleware.ts      # CORS middleware utility
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
# Ethereum & Web3 Network Configuration
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_ETHEREUM_NETWORK=sepolia
NEXT_PUBLIC_WALLET_NETWORK_ID=11155111

# News, Market & Media APIs
NEXT_PUBLIC_GNEWS_API_KEY=your_gnews_api_key
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
NEXT_PUBLIC_NEWS_DATA_API_KEY=your_newsdata_api_key
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key
NEWS_API_KEY=your_newsapi_org_key
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

* **Zero CORS Errors**: All cross-origin third-party fetches are executed on the server side via Next.js Route Handlers.
* **Defensive Rendering**: Price ticker and news lists incorporate safe fallback values to guarantee 100% uptime even under external API rate limits.
* **Zero Database Overhead**: Lightweight and fast public news aggregation without state persistence bottlenecks.

---

## 👤 Author

Developed solely by **[aayush-dubey123](https://github.com/Aayush-Dubey123)**.
