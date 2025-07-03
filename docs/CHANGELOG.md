# Changelog

## [2.0.0] - 2025-01-02

### 🚀 Major Architecture Update - Serverless Migration

**Latitude Explorer** - Now optimized for production deployment with serverless architecture

#### ✨ Features Added
- **Vercel Serverless Functions**: Complete migration from Express backend to serverless API
- **Turso Cloud Database**: Production-ready libSQL cloud database integration
- **Smart Database Routing**: Automatic environment detection (Prisma for local, Turso for production)
- **Hybrid Development Workflow**: Seamless local development with production-ready deployment
- **Vite Proxy Configuration**: Transparent API routing during development
- **Environment-Based Configuration**: Separate local and production database setups

#### 🛠️ Technical Improvements
- **Database Flexibility**: Dual database support (SQLite + Prisma locally, Turso + libSQL in production)
- **API Architecture**: Modular serverless functions with smart routing (`/api/cities.js`)
- **Development Experience**: Single command local development (`npm run dev:local`)
- **Build System**: Optimized build process for Vercel deployment
- **Configuration Management**: Environment-specific database connections

#### 📁 New Project Structure
```
/api/                    # Vercel serverless functions
├── cities.js           # Smart router (local/production)
├── cities.turso.js     # Production handler (Turso)
└── cities.prisma.js    # Local handler (Prisma)
/scripts/               # Utility and setup scripts
/prisma/                # Root-level Prisma configuration
```

#### 🔧 Updated Dependencies
- **@libsql/client**: Direct libSQL client for production database
- **better-sqlite3**: Optimized local SQLite performance
- **Prisma**: Maintained for local development workflow
- **Turso CLI**: Cloud database management tools

#### 🌐 Deployment Ready
- **Vercel Integration**: One-click deployment to Vercel platform
- **Environment Variables**: Secure production configuration
- **Performance Optimized**: CDN-enabled static assets, serverless function scaling
- **Database Migration**: Automated seed data import to Turso

---

## [1.0.0] - 2025-01-02

### 🎉 Initial Release

**Latitude Explorer** - Interactive world mapping application

#### ✨ Features Added
- Interactive world map with click-to-explore
- Real-time city discovery by latitude (154,694+ cities)
- Responsive React frontend with TypeScript
- Express.js backend API with SQLite database
- Copy coordinates functionality
- Modern UI with Tailwind CSS

#### 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Leaflet.js
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM
- **Database**: SQLite with global cities data

#### 🚀 Developer Experience
- Automated start/stop scripts
- Hot reload development
- Comprehensive TypeScript coverage
- Cross-platform compatibility

---

*Ready for production deployment with serverless architecture and cloud database.*
