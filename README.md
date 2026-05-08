# 🎮 SaveFile - Backend

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

**SaveFile** is a social platform for gamers, often described as "Letterboxd for games." It allows users to log their gaming activity, rate and review games, pamer achievements, and showcase their gaming collections. The backend is designed to integrate seamlessly with the Steam API for automated activity tracking.

---

## 🛠 Tech Stack

| Technology | Purpose | Badge |
| :--- | :--- | :--- |
| **NestJS** | Framework | ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) |
| **TypeScript** | Language | ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) |
| **PostgreSQL** | Database | ![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) |
| **Prisma 7** | ORM | ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) |
| **Docker** | Infrastructure | ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) |
| **Passport & OpenID** | Authentication | ![Steam](https://img.shields.io/badge/steam-%23000000.svg?style=for-the-badge&logo=steam&logoColor=white) |

---

## 🏗 System Architecture

The SaveFile backend follows a modular monolith architecture, leveraging NestJS's dependency injection system.

### High-Level Flow
```mermaid
graph TD
    User((User)) -->|Login| AuthModule[Auth Module]
    AuthModule -->|Verify| SteamOpenID[Steam OpenID]
    SteamOpenID -->|SteamID| AuthService[Auth Service]
    AuthService -->|Upsert| DB[(PostgreSQL)]

    subgraph Sync Engine
        Cron[Schedule Module] -->|Hourly| SyncService[Sync Service]
        SyncService -->|Get Recently Played| SteamAPI[Steam Web API]
        SteamAPI -->|Playtime Data| SteamService[Steam Service]
        SteamService -->|Lazy Import| DB
    end

    subgraph Background Worker
        Worker[Enrichment Cron] -->|Every 5m| GameService[Steam Service]
        GameService -->|Fetch Metadata| SteamStore[Steam Store API]
        SteamStore -->|Genres/Desc| DB
    end
```

### Module Breakdown
*   **Auth Module:** Handles the "Front Door." Manages sessions, passport strategies, and user identity persistence.
*   **Steam Module:** The "Engine Room." Contains logic for external API communication and data processing.
*   **Database (Prisma):** The "Source of Truth." Uses a Driver Adapter for high-performance PostgreSQL connections.
*   **Sync Engine:** A collection of automated tasks that keep the user's gaming history up-to-date without manual intervention.

---

*   **Steam OpenID Authentication:** Secure login via Steam account.
*   **Automated Sync Engine:** Background cron jobs to pull recently played games and playtime from Steam.
*   **Lazy Game Import:** Automatically creates "Stub" game records for new Steam games and enriches them with metadata (descriptions, genres, developers) in the background.
*   **Gaming Logs & Reviews:** Track playtime and write reviews with ratings (atomic `upsert` operations).
*   **Type-Safe Architecture:** Full TypeScript implementation with centralized types for external APIs (Steam Store & Player Service).

---

## 📂 Project Structure

```text
src/
├── auth/           # Steam OpenID strategy, session management & serialization
├── common/         
│   └── types/      # Centralized TypeScript interfaces (Steam, Auth, etc.)
├── steam/          # Core Sync Engine, API clients, and background workers
├── app.module.ts   # Root module linking all features
├── main.ts         # Entry point (Session & Global Prefix setup)
└── prisma.service.ts # Prisma 7 Driver Adapter implementation
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
*   Node.js (v20+)
*   pnpm
*   Docker Desktop (Running)

### 2. Configuration
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/savefile?schema=public

# Steam API
STEAM_API_KEY=YOUR_STEAM_WEB_API_KEY
BASE_URL=http://localhost:3000

# Auth
SESSION_SECRET=a_very_secret_key
```

### 3. Spin up Infrastructure
```bash
docker-compose up -d
```

### 4. Install Dependencies
```bash
pnpm install
```

### 5. Database Migration & Client Generation
```bash
# This applies the schema to PostgreSQL and generates types
npx prisma migrate dev --name init
npx prisma generate
```

---

## 🏃 Compilation & Execution

```bash
# Development mode (watch mode)
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

---

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# End-to-end tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

---

## 📡 API Endpoints (Core)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health check |
| `GET` | `/api/auth/steam` | Initiate Steam Login |
| `GET` | `/api/auth/steam/return` | Steam authentication callback |

---

## 📜 License
SaveFile is [MIT licensed](LICENSE).
