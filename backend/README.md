# Backend - Latitude Explorer

Node.js backend API for the Latitude Explorer mapping application.

## 🛠️ Tech Stack

- Node.js 18+ + TypeScript
- Express.js (web framework)
- Prisma ORM + SQLite
- 154,694 cities worldwide

## 🚀 Development

```bash
# Install dependencies
npm install

# Setup database
npm run db:setup

# Start development server
npm run dev
# → http://localhost:3001
```

## 🌐 API Endpoints

```bash
# Find cities by latitude
GET /api/cities/by-latitude/:lat?tolerance=0.1&limit=50

# Search cities
GET /api/cities/search?q=London&limit=20

# Get specific city
GET /api/cities/:id
```

## 📁 Structure

```
src/
├── controllers/
│   └── cities.ts       # Request handlers
├── routes/
│   └── cities.ts       # Route definitions
└── index.ts           # Express app

prisma/
├── schema.prisma      # Database schema
└── seed.ts           # Database seeding
```

## 🗄️ Database

**Schema**: Single `City` table with indexed latitude queries
**Data**: 154,694 cities from cities.json npm package
**Performance**: < 500ms query response time

## 🔧 Scripts

```bash
npm run dev          # Development server
npm run build        # Build TypeScript
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database
npm run db:reset     # Reset database
```

## 🌍 Environment

Create `.env`:
```bash
PORT=3001
DATABASE_URL="file:./prisma/dev.db"
```
