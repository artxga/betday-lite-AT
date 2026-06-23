# BetDay Lite ⚡

Mini aplicación web de apuestas deportivas simuladas construida con Next.js 15 y React 18.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-%2338B2AC?style=flat-square&logo=tailwind-css)
![Jest](https://img.shields.io/badge/Jest-Unit_Testing-%23C21325?style=flat-square&logo=jest)
![Cypress](https://img.shields.io/badge/Cypress-E2E_Testing-%2317202C?style=flat-square&logo=cypress)

## 🎯 Features

- **Timeline View**: Eventos de apuestas del día organizados por hora.
- **1X2 Betting**: Apuestas simuladas con mercado 1X2 (Home, Draw, Away).
- **Authentication**: NextAuth v5 con Credentials y Google OAuth.
- **i18n (Internacionalización)**: Soporte completo multi-idioma (Inglés / Español) vía `next-intl`.
- **Liquid Glass UI**: Diseño inmersivo y vanguardista basado en un sistema de utilidades CSS _Liquid Glass_, con gradientes y fondos translúcidos en Tailwind v4.
- **Animations**: Framer Motion + micro-interacciones.
- **Testing Exhaustivo**: Suites unitarias y e2e configuradas nativamente.
- **Validación Continua**: Hooks de pre-commit nativos de Git protegiendo el código.

## 🛠️ Tech Stack

| Tecnología              | Propósito                         |
| ----------------------- | --------------------------------- |
| Next.js 15 (App Router) | Framework, SSR, Rutas dinámicas   |
| React 18                | Componentes UI                    |
| TypeScript              | Tipado estricto                   |
| Tailwind CSS v4         | Utilidades de estilo y diseño     |
| NextAuth v5 (Auth.js)   | Autenticación                     |
| next-intl               | Internacionalización / Rutas i18n |
| Framer Motion           | Animaciones                       |
| Jest & React Test Lib   | Unit Testing                      |
| Cypress                 | End-to-End Testing (E2E)          |
| Oxc (`oxlint`/`oxfmt`)  | Linter y Formateador ultra-rápido |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ o superior
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

Crea un archivo `.env.local` con la siguiente información:

```env
# Required
AUTH_SECRET=your-secret-key-here

# Optional (for Google OAuth)
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# App
NEXTAUTH_URL=http://localhost:3000
```

> **Note:** Para el Credentials provider, usa un email válido (ej: `demo@betday.com`) y el password `"password"`.

### Comandos Disponibles

```bash
npm run dev           # Levanta el servidor de desarrollo en http://localhost:3000
npm run build         # Compila el build de producción
npm start             # Inicia el build de producción compilado

npm run lint          # Corre el linter rápido mediante oxlint
npm run format        # Formatea la sintaxis en los archivos usando oxfmt
npm run test          # Ejecuta los tests unitarios con Jest
npm run cypress:open  # Abre la UI interactiva de pruebas E2E con Cypress
npm run cypress:run   # Corre los tests E2E silenciosamente en la terminal
```

## 📁 Project Structure

```
├── cypress/                 → Pruebas E2E automatizadas
├── messages/                → Diccionarios JSON de idiomas (en, es)
├── src/
│   ├── app/
│   │   ├── api/             → Backend Next.js API Routes
│   │   └── [locale]/        → Rutas de la UI con sufijo de idioma (/en, /es)
│   ├── components/
│   │   ├── __tests__/       → Suites unitarias de Jest
│   │   └── ...              → Componentes compartidos de React
│   ├── i18n/                → Configuración global de enrutamiento next-intl
│   └── lib/                 → Datos pre-cargados e interfaces TypeSCript
```

## 🛡️ Git Hooks (Pre-commit)

El proyecto incluye de manera nativa comprobaciones _pre-commit_. Al hacer `git commit`, el sistema verifica automáticamente:

1. El código está formateado (`oxfmt`).
2. Pasa los estándares y reglas de código (`oxlint`).
3. Todos los unit tests pasan exitosamente (`jest`).

## 🏗️ Architecture Decisions

### Server vs Client Components

| Componente         | Tipo   | Razón                                     |
| ------------------ | ------ | ----------------------------------------- |
| `page.tsx` (Home)  | Server | Obtiene datos desde Supabase              |
| `profile/page.tsx` | Server | Verificación de Auth + obtención de datos |
| `Timeline`         | Client | Animaciones con Framer Motion             |
| `EventCard`        | Client | Interacción del usuario (apuestas)        |
| `Navbar`           | Client | Estado de sesión + toggle del menú        |

### Data Flow

1. **Matches**: Carga asíncrona desde Supabase (`matches` table).
2. **Bets**: Almacenamiento persistente en Supabase (`bets` table) manejado por funciones de servidor y APIs.
3. **Auth**: NextAuth v5 con Middleware Edge-safe en `/profile` y sincronización con tabla `users` de Supabase.
4. **i18n**: Interceptado por `next-intl` a nivel de App Router.
