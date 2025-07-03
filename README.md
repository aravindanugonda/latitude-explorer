# 🌍 Latitude Explorer

A modern, responsive web-based mapping application that allows users to click on any location to view coordinates and discover cities at the same latitude worldwide.

![Latitude Explorer Demo](https://img.shields.io/badge/status-ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

## ✨ Features

- **🗺️ Interactive World Map**: High-quality map centered on London with smooth navigation
- **🌍 Global City Discovery**: Find all cities at the same latitude (154,694+ cities)
- **📱 Cross-Browser Compatible**: Consistent experience across Chrome, Firefox, Safari, and Edge
- **⚡ Real-time Results**: Fast latitude-based city queries with loading indicators
- **📋 Copy Coordinates**: Easy coordinate sharing functionality
- **🎨 Modern UI**: Beautiful interface with enhanced typography and spacing
- **📊 Data Table**: Clean, readable table with city details, population, and distance calculations
- **🖱️ Custom Scrollbars**: Styled scrollbars for consistent appearance across browsers
- **📐 Optimized Layout**: 70/30 split between map and data panel for optimal viewing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Vercel CLI: `npm i -g vercel`

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
# Start with Vercel development server
vercel dev
```

### 4. Open in Browser
- Application: `http://localhost:3000`
- Both frontend and API are served from the same port

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Leaflet.js |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | SQLite + Prisma ORM |
| **Development** | Vercel CLI, Vite, ESLint, Hot Reload |
| **Deployment** | Vercel serverless functions |
| **UI/UX** | Custom CSS, Cross-browser styling, Responsive design |

## 🎨 UI/UX Improvements

### Enhanced Right Panel (30% width)
- **Professional Header**: Gradient blue header with "Location Details"
- **Improved Typography**: Readable font sizes (14px+) instead of tiny text
- **Better Spacing**: Proper padding and margins for clarity
- **Loading States**: Smooth loading indicators during data fetch
- **Clean Tables**: Well-structured city data with hover effects

### Optimized Map Area (70% width)
- **Larger Map View**: More space for exploration and navigation
- **London-Centered**: Initial view focused on London area (zoom level 8)
- **No Grey Borders**: Clean map display without visual artifacts
- **Stable Layout**: Fixed viewport widths prevent layout shifting

### Cross-Browser Consistency
- **Custom Scrollbars**: Styled for webkit and Firefox browsers
- **CSS Reset**: Proper box-sizing and overflow management
- **Font Rendering**: Consistent typography across all browsers
- **Layout Stability**: No unwanted scrollbars or spacing issues

## 📁 Project Structure

```
latitude-explorer/
├── 📁 api/               # Vercel serverless functions
├── 📁 frontend/          # React + TypeScript frontend  
├── 📁 docs/              # Documentation
├── 📁 prisma/            # Database schema and local db
├── 📄 importCities.js    # Database seeding script
└── 📄 README.md          # This file
```

## 🌐 API Endpoints

- `GET /api/cities?latitude=40.7128&tolerance=0.5` - Find cities by latitude
- `GET /api/cities?latitude=0&tolerance=1` - Get cities near equator

## 🔧 Development Scripts

```bash
# Install all dependencies
npm run install:all

# Database management
npm run db:setup        # Setup database with seed data
npm run db:reset        # Reset database

# Development
vercel dev              # Start with Vercel (recommended)
npm start               # Alternative: Start both frontend and backend
npm stop                # Stop all processes

# Building
npm run build:all       # Build both frontend and backend
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

## 🔧 Troubleshooting

### Port conflicts
If you see port errors, stop any running processes:
```bash
npm stop
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📚 Acknowledgments

- **Map Data**: OpenStreetMap contributors
- **City Data**: cities.json npm package
- **Maps**: Leaflet.js library
- **Icons**: Font Awesome / Heroicons

---

**⭐ Star this repository if you found it helpful!**

Enjoy exploring the world! 🌎
