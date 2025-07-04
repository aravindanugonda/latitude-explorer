# Deployment Guide

This guide covers deploying the Latitude Explorer application to production using Vercel with Turso database.

## 🚀 Primary Deployment Method: Vercel + Turso

This is the recommended production setup using serverless functions and cloud database.

### Prerequisites
- Vercel account
- Turso account and database setup
- Node.js 18+

### 1. Turso Database Setup

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create database
turso db create latitude-explorer

# Get database URL and auth token
turso db show latitude-explorer
turso db tokens create latitude-explorer
```

### 2. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# From project root
vercel

# Follow prompts:
# - Link to existing project or create new
# - Choose "yes" for settings
# - Framework preset: Other
# - Build command: npm run build
# - Output directory: frontend/dist
```

### 3. Environment Variables

Set these in Vercel dashboard (Settings → Environment Variables):

```bash
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token
NODE_ENV=production
```

### 4. Database Migration

```bash
# Seed your production database
npm run db:seed:turso
```

### 5. Verify Deployment

- Frontend: `https://your-app.vercel.app`
- API: `https://your-app.vercel.app/api/cities?latitude=40.7128`

## 🏗️ Architecture Overview

### Hybrid Local/Production Setup


**Local Development:**
- App & API: Vercel dev server (http://localhost:3000)
- Database: SQLite with Prisma ORM

**Production:**
- Frontend: Vercel static hosting
- Backend: Vercel serverless functions (/api/*)
- Database: Turso (libSQL) cloud database
- Smart Routing: Environment-based database client selection

### Smart Database Routing

The `/api/cities.js` function automatically detects environment:

```javascript
// Local: Uses Prisma with SQLite
if (process.env.NODE_ENV === 'development') {
  return require('./cities.prisma.js');
}

// Production: Uses libSQL client with Turso
return require('./cities.turso.js');
```

## 🔄 Development Workflow


### Local Development
```bash
# Start local development (App & API on port 3000)
vercel dev
# Open http://localhost:3000
# Database: SQLite (./backend/prisma/dev.db)
```

### Production Testing
```bash
# Test production build locally
npm run build
npm start

# Verify API endpoints work
curl http://localhost:3000/api/cities?latitude=40.7128
```

## 🌐 Alternative Deployment Options

### Option 1: Railway (Backend) + Vercel (Frontend)

For traditional backend deployment:

```bash
# Backend to Railway
npm install -g @railway/cli
cd backend
railway login
railway init
railway up

# Frontend to Vercel (as above)
cd ../frontend
vercel
```

### Option 2: Docker Deployment

**Complete Docker Setup:**

```dockerfile
# Dockerfile.frontend
FROM node:18-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# Dockerfile.backend
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
RUN npm run build
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: 
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:./prisma/prod.db
    volumes:
      - ./backend/prisma:/app/prisma
  
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

### Option 3: Traditional VPS

**Ubuntu Setup Script:**
```bash
#!/bin/bash
# install-latitude-explorer.sh

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx

# Install PM2
sudo npm install -g pm2

# Clone and setup
git clone https://github.com/your-username/latitude-explorer.git
cd latitude-explorer

# Install dependencies
npm install
cd backend && npm install && npm run build
cd ../frontend && npm install && npm run build

# Setup database
cd ../backend && npm run db:setup

# Start backend with PM2
pm2 start npm --name "lat-backend" -- start
pm2 save
pm2 startup

# Configure nginx for frontend
sudo cp frontend/dist/* /var/www/html/
sudo systemctl restart nginx
```

## 🔧 Environment Configuration

### Development (.env.local)
```bash
DATABASE_URL="file:./backend/prisma/dev.db"
NODE_ENV=development
PORT=3000
```

### Production (Vercel Environment Variables)
```bash
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-token-here
NODE_ENV=production
```

## 📊 Performance Optimizations

### Database Optimizations
- **Connection Pooling**: Turso handles automatically
- **Query Optimization**: Indexed latitude searches
- **Result Caching**: Browser and CDN caching

### Frontend Optimizations
- **Static Generation**: Pre-built assets on Vercel CDN
- **Code Splitting**: Automatic with Vite
- **Image Optimization**: Map tile caching
- **Gzip Compression**: Enabled by default on Vercel

### API Optimizations
- **Serverless Functions**: Auto-scaling and cold start optimization
- **Response Caching**: CDN-level caching for static responses
- **Query Efficiency**: Optimized latitude range queries

## 🔒 Security Configuration

### Vercel Security Headers

Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### CORS Configuration
Production CORS is configured for your domain in `/api/cities.js`.

## 📈 Monitoring & Analytics

### Vercel Analytics
Enable in Vercel dashboard for:
- Page views and performance
- Function execution metrics
- Error tracking

### Turso Monitoring
Built-in metrics for:
- Query performance
- Database usage
- Connection stats

### Custom Health Checks
```bash
# Test API health
curl https://your-app.vercel.app/api/cities?latitude=0&tolerance=1

# Expected response: Array of cities near equator
```

## 🔄 CI/CD Pipeline

### GitHub Actions for Vercel

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🌐 Custom Domain Setup

### DNS Configuration
1. Add custom domain in Vercel dashboard
2. Configure DNS records:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

### SSL Certificate
- Automatic SSL via Vercel
- HTTP to HTTPS redirect enabled by default

## 📝 Post-Deployment Checklist

- [ ] Application loads at production URL
- [ ] Map renders correctly and is interactive
- [ ] City search returns accurate results
- [ ] API endpoints respond with expected data
- [ ] Mobile responsiveness verified
- [ ] Performance metrics acceptable (< 2s load time)
- [ ] Error tracking configured
- [ ] Environment variables secured
- [ ] Database connection stable
- [ ] Monitoring alerts configured

## 🆘 Troubleshooting

### Common Issues

**API 404 Errors:**
- Verify `/api/` folder is in project root
- Check Vercel function deployment logs

**Database Connection Issues:**
- Verify TURSO_DATABASE_URL and TURSO_AUTH_TOKEN
- Test connection with Turso CLI: `turso db shell latitude-explorer`

**Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies installed
- Review Vercel build logs

**Performance Issues:**
- Monitor function execution time in Vercel dashboard
- Check database query performance in Turso
- Optimize frontend bundle size

### Debug Commands
```bash
# Local API test
curl http://localhost:3000/api/cities?latitude=40.7128

# Production API test  
curl https://your-app.vercel.app/api/cities?latitude=40.7128

# Database connectivity test
turso db shell latitude-explorer "SELECT COUNT(*) FROM cities;"
```

---

**Ready for production deployment! 🚀**
