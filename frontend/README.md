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

# Start local development (App & API on port 3000)
vercel dev
# Open http://localhost:3000

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

No custom API URL is needed for local development. Both the frontend and API run on http://localhost:3000 via `vercel dev`.

## � Features

- Interactive world map with click handlers
- Real-time coordinate display
- City discovery and display
- Responsive design for all devices
- Modern UI with Tailwind CSS
