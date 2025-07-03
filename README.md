# 🌍 Latitude Explorer

A web-based mapping application that allows users to click on any location to view coordinates and discover cities at the same latitude worldwide.

![Latitude Explorer Demo](https://img.shields.io/badge/status-ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)

## ✨ Features

- **🗺️ Interactive World Map**: Click anywhere to explore coordinates
- **🌍 Global City Discovery**: Find all cities at the same latitude (154,694+ cities)
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **⚡ Real-time Results**: Fast latitude-based city queries
- **📋 Copy Coordinates**: Easy coordinate sharing functionality
- **🎨 Modern UI**: Beautiful interface with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### 1. Clone and Install
```bash
git clone https://github.com/aravindanugonda/latitude-explorer.git
cd latitude-explorer
npm run install:all
```

### 2. Setup Database
```bash
npm run db:setup
```

### 3. Start Application
```bash
# Start development servers
npm run dev
```

### 4. Open in Browser
- API: `http://localhost:3000`
- Frontend: `http://localhost:5173`

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Leaflet.js |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | SQLite + Prisma ORM |
| **Development** | Vite, ESLint, Hot Reload |

## 📁 Project Structure

```
latitude-explorer/
├── 📁 api/               # Vercel serverless functions
├── 📁 frontend/          # React + TypeScript frontend  
├── 📁 docs/              # Documentation
├── � prisma/            # Database schema and local db
├── 📄 importCities.js    # Database seeding script
├── � start.local.sh     # Local development script
└── 📄 README.md          # This file
```

## 🌐 API Endpoints

- `GET /api/cities?latitude=40.7128&tolerance=0.5` - Find cities by latitude
- `GET /api/cities?latitude=0&tolerance=1` - Get cities near equator

## 📚 Documentation

- **[Frontend README](frontend/README.md)** - React app details
- **[Backend README](backend/README.md)** - API and database info
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment
- **[Changelog](docs/CHANGELOG.md)** - Version history

## 🔧 Development Scripts

```bash
# Install all dependencies
npm run install:all

# Database management
npm run db:setup        # Setup database with seed data
npm run db:reset        # Reset database

# Development
npm start               # Start both frontend and backend
npm stop                # Stop all processes

# Individual services
cd frontend && npm run dev    # Frontend only
cd backend && npm run dev     # Backend only
```

## 🎯 How It Works

1. **Click on Map**: Select any location on the interactive world map
2. **View Coordinates**: See precise latitude and longitude
3. **Discover Cities**: Automatically find all cities at the same latitude
4. **Explore Results**: View city details including population data
5. **Copy & Share**: Copy coordinates to clipboard for sharing

## 🌟 Example Use Cases

- **Geography Education**: Explore cities along the same parallel
- **Travel Planning**: Discover cities with similar latitude/climate
- **Research**: Study urban distribution patterns
- **Fun Exploration**: Learn about global city locations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

##  Acknowledgments

- **Map Data**: OpenStreetMap contributors
- **City Data**: cities.json npm package
- **Maps**: Leaflet.js library
- **Icons**: Font Awesome / Heroicons

---

**⭐ Star this repository if you found it helpful!**
   start.bat
   ```

4. **Stop the application:**
   ```bash
   # Linux/Mac
   ./stop.sh
   # or
   npm stop

   # Windows
   stop.bat
   ```

## 🎯 How to Use

1. Open your browser to `http://localhost:5173`
2. Click anywhere on the world map
3. View the selected coordinates in the sidebar
4. Explore cities at the same latitude!

## 🛠️ Development

### Available Scripts

**Root level:**
- `npm start` - Start both frontend and backend
- `npm stop` - Stop all services
- `npm run install:all` - Install dependencies for all projects
- `npm run build:all` - Build both frontend and backend
- `npm run db:setup` - Setup and seed database

**Backend (cd backend):**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript
- `npm run db:seed` - Re-seed database

**Frontend (cd frontend):**
- `npm run dev` - Start development server
- `npm run build` - Build for production

## 🏗️ Tech Stack

- **Frontend:** React + TypeScript + Leaflet + Tailwind CSS
- **Backend:** Express + TypeScript + Prisma
- **Database:** SQLite
- **Maps:** OpenStreetMap + Leaflet

## 📱 Features

- Interactive world map
- Real-time coordinate display
- City discovery by latitude
- Population data
- Copy coordinates to clipboard
- Responsive design
- Fast search (< 500ms)

## 🔧 Troubleshooting

### Port conflicts
If you see port errors, run the stop script first:
```bash
./stop.sh  # or stop.bat on Windows
```

### Database issues
Reset the database:
```bash
npm run db:reset
npm run db:setup
```

### Dependencies issues
Reinstall all dependencies:
```bash
npm run install:all
```

## 📊 API Endpoints

- `GET /api/cities/by-latitude/:lat?tolerance=0.1&limit=50`
- `GET /api/cities/search?q=cityname`
- `GET /api/cities/:id`

Enjoy exploring the world! 🌎
