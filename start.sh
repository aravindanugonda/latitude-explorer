#!/bin/bash

# Latitude Explorer - Start Script
echo "🚀 Starting Latitude Explorer Application..."

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    # Kill all background jobs
    jobs -p | xargs -r kill
    exit 0
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📡 Starting Backend Server...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

echo -e "${GREEN}🌐 Starting Frontend Development Server...${NC}"
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

echo ""
echo -e "${GREEN}✅ Both services are starting up!${NC}"
echo -e "${YELLOW}📍 Backend API:${NC} http://localhost:3001"
echo -e "${YELLOW}🌍 Frontend App:${NC} http://localhost:5173"
echo ""
echo -e "${BLUE}💡 Click on the map to discover cities at the same latitude!${NC}"
echo ""
echo -e "${RED}Press Ctrl+C to stop all services${NC}"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
