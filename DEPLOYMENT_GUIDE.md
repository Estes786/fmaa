# FMAA Deployment Guide untuk Vercel

## Overview
Panduan ini akan membantu Anda melakukan deployment aplikasi FMAA (Federated Micro-Agents Architecture) ke Vercel dengan konfigurasi frontend dan backend terpisah.

## Prasyarat
- Akun Vercel (gratis)
- Akun Supabase (gratis)
- Akun Hugging Face (gratis)
- Repository GitHub

## Struktur Proyek
```
fmaa-vercel-ready/
├── api/                    # Backend API endpoints
│   ├── agent-factory.js
│   ├── sentiment-agent.js
│   ├── recommendation-agent.js
│   └── performance-monitor.js
├── lib/                    # Shared utilities
│   ├── cors.js
│   ├── supabase.js
│   └── utils.js
├── src/                    # Frontend React app
├── public/                 # Static assets
├── database/               # Database schema
├── package.json            # Dependencies
├── vercel.json            # Vercel configuration
└── .env.example           # Environment variables template
```

## Langkah 1: Setup Environment Variables

### 1.1 Supabase Setup
1. Buat project baru di [Supabase](https://supabase.com)
2. Jalankan SQL schema dari `database/schema.sql`
3. Dapatkan URL dan API keys dari Settings > API

### 1.2 Hugging Face Setup
1. Daftar di [Hugging Face](https://huggingface.co)
2. Buat API token di Settings > Access Tokens

### 1.3 Environment Variables di Vercel
Tambahkan environment variables berikut di Vercel dashboard:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
NODE_ENV=production
```

## Langkah 2: Deployment ke Vercel

### 2.1 Via Vercel Dashboard
1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik "New Project"
3. Import repository GitHub Anda
4. Konfigurasi project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (root)
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

### 2.2 Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel --prod
```

## Langkah 3: Konfigurasi Database

### 3.1 Setup Supabase Tables
Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Agents table
CREATE TABLE agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  config JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id),
  type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  priority INTEGER DEFAULT 1,
  input_data JSONB,
  output_data JSONB,
  duration_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Logs table
CREATE TABLE logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  component VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Metrics table
CREATE TABLE metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC NOT NULL,
  tags JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### 3.2 Setup Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth requirements)
CREATE POLICY "Allow all operations" ON agents FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON logs FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON metrics FOR ALL USING (true);
```

## Langkah 4: Testing Deployment

### 4.1 Test Frontend
1. Akses URL deployment Vercel Anda
2. Pastikan dashboard loading dengan benar
3. Test navigasi antar halaman

### 4.2 Test API Endpoints
```bash
# Test agent factory
curl https://your-app.vercel.app/api/agent-factory

# Test sentiment analysis
curl -X POST https://your-app.vercel.app/api/sentiment-agent \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a great product!"}'
```

## Langkah 5: Monitoring dan Maintenance

### 5.1 Vercel Analytics
- Enable Vercel Analytics di dashboard
- Monitor performance dan usage

### 5.2 Supabase Monitoring
- Monitor database performance
- Check logs untuk errors

### 5.3 Error Handling
- Check Vercel Function logs
- Monitor Supabase logs
- Setup alerts untuk critical errors

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Check package.json dependencies
   - Verify Node.js version compatibility
   - Check for missing environment variables

2. **API Errors**
   - Verify Supabase connection
   - Check environment variables
   - Validate API endpoints

3. **Database Connection Issues**
   - Verify Supabase URL dan keys
   - Check RLS policies
   - Validate table schemas

### Debug Commands
```bash
# Local development
pnpm run dev

# Build locally
pnpm run build

# Check Vercel logs
vercel logs
```

## Performance Optimization

### Frontend
- Enable Vercel Edge Network
- Optimize images dan assets
- Use code splitting

### Backend
- Optimize database queries
- Use connection pooling
- Implement caching

### Database
- Add proper indexes
- Optimize query performance
- Monitor connection usage

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to repository
   - Use Vercel environment variables
   - Rotate keys regularly

2. **API Security**
   - Implement rate limiting
   - Validate input data
   - Use HTTPS only

3. **Database Security**
   - Configure RLS properly
   - Use service role key carefully
   - Monitor access logs

## Support

Jika mengalami masalah:
1. Check Vercel documentation
2. Review Supabase logs
3. Check GitHub issues
4. Contact support team

---

**Deployment berhasil!** 🎉

Aplikasi FMAA Anda sekarang live di Vercel dengan semua komponen terintegrasi:
- ✅ Frontend React Dashboard
- ✅ Backend API Endpoints
- ✅ Supabase Database
- ✅ Hugging Face AI Integration

