# Vercel Deployment Fix

## Masalah yang Ditemukan

Proyek ini mengalami error saat deploy ke Vercel karena beberapa masalah konfigurasi:

### 1. Konflik Module System
- `package.json` menggunakan `"type": "module"` (ES Modules)
- File API menggunakan format CommonJS (`require()`, `module.exports`)
- Ini menyebabkan error saat Vercel mencoba menjalankan fungsi serverless

### 2. Konfigurasi Vercel yang Tidak Optimal
- Section `"functions"` di `vercel.json` sudah deprecated
- Routing tidak optimal untuk API functions

### 3. Dependencies yang Hilang
- `@supabase/supabase-js` tidak ada di `package.json`
- `dotenv` tidak ada di `package.json`

## Solusi yang Diterapkan

### 1. Konversi ke ES Modules
Semua file API dan library dikonversi dari CommonJS ke ES Modules:

**Sebelum:**
```javascript
const handleCors = require('../lib/cors');
const supabase = require('../lib/supabase');

module.exports = async (req, res) => {
  // ...
};
```

**Sesudah:**
```javascript
import { handleCors } from '../lib/cors.js';
import { supabase } from '../lib/supabase.js';

export default async (req, res) => {
  // ...
};
```

### 2. Perbaikan vercel.json
- Menghapus section `"functions"` yang deprecated
- Mempertahankan konfigurasi `"builds"` yang benar
- Memastikan routing API berfungsi dengan baik

### 3. Menambahkan Dependencies
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "dotenv": "^16.3.1"
  }
}
```

### 4. File yang Diperbaiki
- `api/agent-factory.js`
- `api/performance-monitor.js`
- `api/recommendation-agent.js`
- `api/sentiment-agent.js`
- `lib/cors.js`
- `lib/supabase.js`
- `package.json`
- `vercel.json`

## Cara Deploy

1. **Setup Environment Variables di Vercel:**
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   NODE_ENV=production
   ```

2. **Deploy ke Vercel:**
   ```bash
   vercel --prod
   ```

3. **Atau deploy via GitHub:**
   - Push ke repository
   - Vercel akan auto-deploy

## Testing

Setelah deploy, test endpoint API:
- `GET /api/agent-factory`
- `GET /api/performance-monitor`
- `GET /api/recommendation-agent`
- `GET /api/sentiment-agent`

## Troubleshooting

Jika masih ada error:

1. **Check Vercel Logs:**
   ```bash
   vercel logs
   ```

2. **Test Local Build:**
   ```bash
   npm run build
   ```

3. **Check Environment Variables:**
   - Pastikan semua env vars sudah diset di Vercel dashboard

4. **Verify Dependencies:**
   ```bash
   npm install
   ```

## Catatan Penting

- Semua API functions sekarang menggunakan ES Modules
- Pastikan semua imports menggunakan `.js` extension
- Environment variables harus diset di Vercel dashboard
- Build process sudah dioptimasi untuk production