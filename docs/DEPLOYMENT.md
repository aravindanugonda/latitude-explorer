# Deployment Guide

This guide covers deploying the Latitude Explorer application to various platforms.

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# From frontend directory
cd frontend
vercel

# Follow prompts to deploy
```

#### Backend to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# From backend directory  
cd backend
railway login
railway init
railway up
```

### Option 2: Docker Deployment

#### Create Dockerfiles

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
RUN npx prisma generate
EXPOSE 3001
CMD ["npm", "start"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=file:./prisma/dev.db
    volumes:
      - ./backend/prisma:/app/prisma
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

### Option 3: Traditional VPS

#### Requirements
- Ubuntu 20.04+ or similar
- Node.js 18+
- Nginx (for frontend)
- PM2 (for process management)

#### Setup Script
```bash
# Install dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx

# Install PM2
sudo npm install -g pm2

# Clone and setup
git clone <your-repo>
cd latitude-explorer

# Backend setup
cd backend
npm install
npm run build
npm run db:setup

# Start with PM2
pm2 start npm --name "lat-backend" -- start
pm2 save
pm2 startup

# Frontend setup
cd ../frontend
npm install
npm run build

# Copy build to nginx
sudo cp -r dist/* /var/www/html/
```

## 🔧 Environment Configuration

### Production Environment Variables

**Backend (.env):**
```bash
NODE_ENV=production
PORT=3001
DATABASE_URL="file:./prisma/prod.db"
```

**Frontend (.env.production):**
```bash
VITE_API_URL=https://your-backend-domain.com/api
```

## 📊 Performance Considerations

### Database Optimization
- Use PostgreSQL for production instead of SQLite
- Add database connection pooling
- Implement Redis caching for frequent queries

### Frontend Optimization
- Enable gzip compression
- Configure CDN for static assets
- Implement service worker for caching

### Backend Optimization
- Add rate limiting
- Implement API response caching
- Use compression middleware

## 🔒 Security Checklist

- [ ] HTTPS enabled on both frontend and backend
- [ ] Environment variables secured
- [ ] CORS properly configured for production domains
- [ ] API rate limiting implemented
- [ ] Database connection secured
- [ ] Security headers configured
- [ ] Input validation on all endpoints

## 📈 Monitoring

### Recommended Tools
- **Application Monitoring**: New Relic, DataDog
- **Error Tracking**: Sentry
- **Uptime Monitoring**: Pingdom, UptimeRobot
- **Log Aggregation**: LogDNA, Papertrail

### Health Check Endpoints
Add to backend:
```typescript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      # Backend tests and deploy
      - name: Backend Tests
        run: cd backend && npm ci && npm test
      
      # Frontend build and deploy
      - name: Frontend Build
        run: cd frontend && npm ci && npm run build
      
      # Deploy to your platform
      - name: Deploy
        run: # Your deployment commands
```

## 🌐 Domain Configuration

### Custom Domain Setup
1. Purchase domain from registrar
2. Configure DNS records:
   - A record: @ -> Your server IP
   - CNAME: www -> your-domain.com
   - CNAME: api -> your-backend-domain.com

### SSL Certificate
```bash
# Using Certbot for free SSL
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 📝 Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] Map functionality works
- [ ] City search returns results
- [ ] All API endpoints respond
- [ ] Mobile responsiveness verified
- [ ] Performance metrics acceptable
- [ ] Error tracking configured
- [ ] Backup strategy implemented
- [ ] Monitoring alerts set up
