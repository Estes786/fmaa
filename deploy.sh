#!/bin/bash

# Auto-Deploy Script untuk Vercel
echo "🚀 Starting Vercel Auto-Deploy..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    echo "Opening browser for login..."
    vercel login
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --yes

echo "✅ Deployment completed!"
echo "🌐 Check your deployment at: https://fmaa.vercel.app"