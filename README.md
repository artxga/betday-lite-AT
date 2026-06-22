# BetDay Lite ⚡

Mini aplicación web de apuestas deportivas simuladas construida con Next.js 15 y React 18.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)

## 🎯 Features

- **Timeline View**: Eventos de apuestas del día organizados por hora
- **1X2 Betting**: Apuestas simuladas con mercado 1X2 (Home, Draw, Away)
- **Authentication**: NextAuth v5 con Credentials y Google OAuth
- **Profile**: Historial de apuestas con estadísticas
- **Bet Details**: Vista detallada de cada apuesta
- **Responsive**: Diseño mobile-first adaptativo
- **Animations**: Framer Motion + micro-interacciones CSS
- **Dark Theme**: Diseño premium con glassmorphism

## 🛠️ Tech Stack

| Tecnología              | Propósito                  |
| ----------------------- | -------------------------- |
| Next.js 15 (App Router) | Framework, SSR, API Routes |
| React 18                | UI Components              |
| TypeScript              | Type safety                |
| NextAuth v5 (Auth.js)   | Authentication             |
| Framer Motion           | Animations                 |
| Sonner                  | Toast notifications        |
| Vanilla CSS Modules     | Styling                    |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd betday-lite

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

### Environment Variables

Create a `.env.local` file with:

```env
# Required
AUTH_SECRET=your-secret-key-here

# Optional (for Google OAuth)
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# App
NEXTAUTH_URL=http://localhost:3000
```

> **Note:** Para Credentials provider, usa cualquier email con password `"password"` para login.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  → NextAuth route handler
│   │   ├── events/              → GET events grouped by hour
│   │   └── bets/                → GET/POST user bets
│   │       └── [betId]/         → GET bet detail
│   ├── auth/signin/             → Custom login page
│   ├── bets/[betId]/            → Bet detail page
│   ├── profile/                 → Protected profile page
│   ├── globals.css              → Design system
│   ├── layout.tsx               → Root layout (Server Component)
│   └── page.tsx                 → Home page (Server Component)
├── components/
│   ├── Navbar                   → Navigation with auth state
│   ├── Timeline                 → Hourly event timeline
│   ├── EventCard                → Match card with bet buttons
│   ├── BetButton                → Individual 1/X/2 button
│   ├── BetCard                  → Profile bet history card
│   ├── StatusBadge              → PENDING/WON/LOST badge
│   ├── EmptyState               → No bets placeholder
│   └── Providers                → SessionProvider + Toaster
├── lib/
│   ├── data/
│   │   ├── matches.ts           → Match data loader
│   │   └── bets-store.ts        → In-memory bet store
│   └── types.ts                 → TypeScript interfaces
├── auth.config.ts               → NextAuth config (Edge-safe)
├── auth.ts                      → NextAuth exports
└── middleware.ts                → Route protection
```

## 🏗️ Architecture Decisions

### Server vs Client Components

| Component               | Type   | Reason                      |
| ----------------------- | ------ | --------------------------- |
| `page.tsx` (Home)       | Server | Fetches data from API route |
| `profile/page.tsx`      | Server | Auth check + data fetch     |
| `bets/[betId]/page.tsx` | Server | Auth check + data fetch     |
| `Timeline`              | Client | Framer Motion animations    |
| `EventCard`             | Client | User interaction (betting)  |
| `Navbar`                | Client | Session state + menu toggle |

### Data Flow

1. **Matches**: Loaded from `matches.today.50.json` → served via `/api/events`
2. **Bets**: Seeded from `bets.me.50.json` → managed in-memory via `/api/bets`
3. **Auth**: NextAuth v5 with Credentials (simulated) + Google OAuth
4. **Protection**: Middleware protects `/profile` and `/bets/*` routes

## 📄 License

MIT
