#!/bin/bash
# Start both frontend and Vercel API locally

# Start Vercel dev server (API)
concurrently "vercel dev --yes" "cd frontend && npm run dev"
