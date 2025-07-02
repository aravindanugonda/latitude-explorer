# Frontend - Latitude Explorer

React frontend for the Latitude Explorer mapping application.

## 🛠️ Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Leaflet.js (interactive maps)
- Axios (API calls)

## 🚀 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Build for production
npm run build
```

## 📁 Structure

```
src/
├── components/
│   └── Map.tsx         # Interactive map component
├── services/
│   └── cities.ts       # API service layer
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## 🌐 Environment

Create `.env.local` for custom API URL:
```bash
VITE_API_URL=http://localhost:3001/api
```

## � Features

- Interactive world map with click handlers
- Real-time coordinate display
- City discovery and display
- Responsive design for all devices
- Modern UI with Tailwind CSS
