#!/bin/bash

# Latitude Explorer - Stop Script
echo "🛑 Stopping Latitude Explorer Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kill processes running on specific ports
echo -e "${YELLOW}Stopping backend server (port 3001)...${NC}"
lsof -ti:3001 | xargs -r kill -9

echo -e "${YELLOW}Stopping frontend server (port 5173)...${NC}"
lsof -ti:5173 | xargs -r kill -9

# Also kill any npm/node processes related to our project
echo -e "${YELLOW}Cleaning up any remaining processes...${NC}"
pkill -f "npm run dev"
pkill -f "vite"
pkill -f "nodemon"

echo -e "${GREEN}✅ All services stopped successfully!${NC}"
