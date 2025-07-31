# 🚀 Auto-Deploy Setup untuk Vercel

## 📋 **Setup Auto-Deploy dari GitHub ke Vercel**

### 🔧 **Langkah 1: Setup Vercel Project**

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

### 🔧 **Langkah 2: Setup Environment Variables**

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

### 🔧 **Langkah 3: Enable Auto-Deploy**

#### A. Di Vercel Dashboard:
1. Klik tab **"Settings"**
2. Pilih **"Git"**
3. Pastikan **"Auto Deploy"** ter-enable
4. Pilih branch: **`main`**

#### B. Verifikasi GitHub Integration:
1. Buka [GitHub Settings](https://github.com/settings/installations)
2. Cari **"Vercel"** app
3. Pastikan terinstall dan authorized

### 🔧 **Langkah 4: Test Auto-Deploy**

#### A. Trigger Deployment Manual:
```bash
# Push perubahan untuk trigger auto-deploy
git add .
git commit -m "🚀 Test auto-deploy trigger"
git push origin main
```

#### B. Monitor Deployment:
1. Buka Vercel Dashboard
2. Klik tab **"Deployments"**
3. Lihat status deployment

### 🔧 **Langkah 5: Setup Webhook (Optional)**

#### A. Manual Webhook Setup:
1. Buka [GitHub Repository Settings](https://github.com/Estes786/fmaa/settings)
2. Klik **"Webhooks"**
3. Klik **"Add webhook"**
4. Payload URL: `https://vercel.com/api/webhooks/github`
5. Content type: `application/json`
6. Events: `Just the push event`

### 📊 **Monitoring Auto-Deploy:**

#### A. Vercel Dashboard:
- **Deployments** - Lihat semua deployments
- **Functions** - Monitor API functions
- **Analytics** - Track performance

#### B. GitHub Actions (jika ada):
- Buka repository di GitHub
- Klik tab **"Actions"**
- Lihat workflow runs

#### C. Vercel CLI:
```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Deploy manual
vercel --prod
```

### 🎯 **Expected Behavior:**

#### Setelah Setup:
1. **Push ke main branch** → Auto-deploy trigger
2. **Build process** → Vercel build otomatis
3. **Deployment** → Live di `https://fmaa.vercel.app`

#### Test Commands:
```bash
# Test auto-deploy
git add .
git commit -m "🚀 Test auto-deploy"
git push origin main

# Check deployment status
vercel ls
```

### 🚨 **Troubleshooting:**

#### Issue 1: "Auto-deploy not working"
**Solution:**
1. Check GitHub integration
2. Verify webhook settings
3. Reconnect repository

#### Issue 2: "Build failed"
**Solution:**
1. Check environment variables
2. Verify dependencies
3. Check build logs

#### Issue 3: "No deployments triggered"
**Solution:**
1. Check branch settings
2. Verify repository connection
3. Manual deploy first

### 📞 **Support:**

- **Vercel Documentation:** https://vercel.com/docs
- **GitHub Integration:** https://vercel.com/docs/git-integrations
- **Auto-Deploy Guide:** https://vercel.com/docs/deployments

---
**Status:** 🔧 **AUTO-DEPLOY SETUP IN PROGRESS**