# 🚀 Setup Vercel Auto-Deploy

## 📋 **Langkah-langkah Setup Auto-Deploy**

### **Step 1: Setup Vercel Project**

#### A. Buka Vercel Dashboard
1. Kunjungi [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik **"New Project"**
3. Pilih **"Import Git Repository"**

#### B. Import Repository
1. Cari repository: `Estes786/fmaa`
2. Klik **"Import"**
3. Konfigurasi project settings:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command:** `npm run deploy`
   - **Output Directory:** `client/build`
   - **Install Command:** `npm install`

### **Step 2: Setup Environment Variables**

#### A. Di Vercel Dashboard:
1. Pilih project Anda
2. Klik tab **"Settings"**
3. Pilih **"Environment Variables"**
4. Tambahkan variables:

```
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
NODE_ENV=production
GENERATE_SOURCEMAP=false
```

### **Step 3: Enable Auto-Deploy**

#### A. Di Vercel Dashboard:
1. Klik tab **"Settings"**
2. Pilih **"Git"**
3. Enable **"Auto Deploy"**
4. Pilih branch: `main`

### **Step 4: Get Vercel Tokens (untuk GitHub Actions)**

#### A. Generate Vercel Token:
1. Buka [Vercel Account Settings](https://vercel.com/account/tokens)
2. Klik **"Create Token"**
3. Copy token untuk GitHub Secrets

#### B. Get Project ID:
1. Di Vercel Dashboard → Project Settings
2. Copy **Project ID**

#### C. Get Org ID:
1. Di Vercel Dashboard → Settings
2. Copy **Team ID** atau **User ID**

### **Step 5: Setup GitHub Secrets**

#### A. Buka GitHub Repository Settings:
1. Buka [Repository Settings](https://github.com/Estes786/fmaa/settings)
2. Klik **"Secrets and variables"** → **"Actions"**
3. Tambahkan secrets:

```
VERCEL_TOKEN=your_vercel_token_here
ORG_ID=your_org_id_here
PROJECT_ID=your_project_id_here
```

### **Step 6: Test Auto-Deploy**

#### A. Trigger Test Deployment:
```bash
# Buat commit baru untuk test auto-deploy
git add .
git commit -m "🚀 Test auto-deploy with GitHub Actions"
git push origin main
```

#### B. Monitor Deployment:
1. Check GitHub Actions tab
2. Check Vercel Dashboard
3. Verify deployment status

### **Step 7: Verify Deployment**

#### A. Check Live URL:
- Frontend: `https://your-project.vercel.app`
- API: `https://your-project.vercel.app/api/agent-factory`

#### B. Test API Endpoints:
- `GET /api/agent-factory`
- `GET /api/performance-monitor`
- `GET /api/recommendation-agent`
- `GET /api/sentiment-agent`

### 📊 **Expected Results:**

#### **Setelah Setup Berhasil:**
- ✅ Project muncul di Vercel Dashboard
- ✅ Auto-deploy ter-trigger saat push ke main
- ✅ GitHub Actions berjalan otomatis
- ✅ Live URL accessible
- ✅ API endpoints working

### 🚨 **Troubleshooting:**

#### **Issue 1: "GitHub Actions failed"**
**Solution:**
1. Check GitHub Secrets
2. Verify Vercel tokens
3. Check workflow logs

#### **Issue 2: "Build failed"**
**Solution:**
1. Check environment variables
2. Verify dependencies
3. Test build locally

#### **Issue 3: "Auto-deploy not working"**
**Solution:**
1. Check Vercel project settings
2. Verify GitHub integration
3. Reconnect repository

### 📞 **Support:**

- **Vercel Documentation:** https://vercel.com/docs
- **GitHub Actions:** https://docs.github.com/en/actions
- **Vercel CLI:** https://vercel.com/docs/cli

---
**Status:** 🔧 **SETUP IN PROGRESS** - Follow steps above!