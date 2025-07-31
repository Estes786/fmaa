# 🚀 Vercel Deployment Guide

## 📋 **Langkah-langkah Deployment ke Vercel**

### 1. **Setup Environment Variables di Vercel Dashboard**

Buka [Vercel Dashboard](https://vercel.com/dashboard) dan ikuti langkah berikut:

#### A. Masuk ke Project Settings
1. Pilih project Anda di dashboard
2. Klik tab **"Settings"**
3. Pilih **"Environment Variables"**

#### B. Tambahkan Environment Variables
```
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
NODE_ENV=production
GENERATE_SOURCEMAP=false
```

### 2. **Verifikasi Konfigurasi Vercel**

File `vercel.json` sudah dikonfigurasi dengan benar:
```json
{
  "version": 2,
  "buildCommand": "npm run deploy",
  "outputDirectory": "client/build",
  "installCommand": "npm install",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "GENERATE_SOURCEMAP": "false"
  }
}
```

### 3. **Trigger Deployment**

#### Opsi A: Auto-deploy dari GitHub
1. Pastikan repository terhubung dengan Vercel
2. Push perubahan ke main branch
3. Vercel akan otomatis deploy

#### Opsi B: Manual Deploy
```bash
# Install Vercel CLI (jika belum)
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel --prod
```

### 4. **Testing Deployment**

Setelah deploy, test endpoint berikut:

#### Frontend:
- `https://your-app.vercel.app/` - Main app
- `https://your-app.vercel.app/chat` - Chat interface

#### API Endpoints:
- `https://your-app.vercel.app/api/agent-factory`
- `https://your-app.vercel.app/api/performance-monitor`
- `https://your-app.vercel.app/api/recommendation-agent`
- `https://your-app.vercel.app/api/sentiment-agent`

### 5. **Troubleshooting**

#### Jika Build Gagal:
1. Check Vercel logs di dashboard
2. Pastikan environment variables sudah diset
3. Verify dependencies di package.json

#### Jika API Error:
1. Check Supabase connection
2. Verify environment variables
3. Test API endpoints secara manual

### 6. **Monitoring Deployment**

#### Vercel Dashboard:
- **Deployments** - Lihat status deploy
- **Functions** - Monitor API functions
- **Analytics** - Track performance

#### Logs:
- **Function Logs** - Debug API issues
- **Build Logs** - Check build process

## 🎯 **Checklist Deployment**

- ✅ Repository sudah optimal
- ✅ Build process berhasil
- ✅ Environment variables diset
- ✅ API functions siap
- ✅ Frontend build siap
- ✅ Vercel configuration benar

## 📞 **Support**

Jika ada masalah:
1. Check Vercel logs
2. Verify environment variables
3. Test build process lokal
4. Check Supabase connection

---
**Status:** ✅ **READY FOR DEPLOYMENT**