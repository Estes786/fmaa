# FMAA - Federated Micro-Agents Architecture

🚀 **Sistem Dashboard Analitik dengan Arsitektur Micro-Agents untuk Vercel**

## Overview

FMAA adalah sistem dashboard analitik modern yang menggunakan arsitektur micro-agents untuk memberikan layanan analitik yang scalable dan intelligent. Sistem ini dirancang khusus untuk deployment di Vercel dengan integrasi Supabase dan Hugging Face.

## ✨ Fitur Utama

- **🤖 Intelligent Agents**: Sentiment Analysis, Recommendation Engine, Performance Monitoring
- **📊 Real-time Dashboard**: Interactive charts dan metrics dengan live updates
- **🔍 Advanced Analytics**: Comprehensive performance tracking dan business intelligence
- **🛡️ Security**: CORS protection, input validation, secure API endpoints
- **📱 Responsive Design**: Mobile-friendly interface dengan modern UI/UX
- **⚡ High Performance**: Optimized untuk serverless deployment di Vercel

## 🏗️ Arsitektur

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React/Vite)  │◄──►│   (Vercel Func) │◄──►│   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Hugging Face   │
                    │  AI Integration │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended)
- Akun Vercel
- Akun Supabase
- Akun Hugging Face

### Local Development

1. **Clone dan Install**
```bash
git clone <repository-url>
cd fmaa-vercel-ready
pnpm install
```

2. **Setup Environment**
```bash
cp .env.example .env.local
# Edit .env.local dengan credentials Anda
```

3. **Start Development Server**
```bash
pnpm run dev
```

4. **Access Dashboard**
```
http://localhost:5173
```

## 📁 Struktur Proyek

```
fmaa-vercel-ready/
├── api/                    # Backend API endpoints (Vercel Functions)
│   ├── agent-factory.js    # Agent management
│   ├── sentiment-agent.js  # Sentiment analysis
│   ├── recommendation-agent.js
│   └── performance-monitor.js
├── lib/                    # Shared utilities
│   ├── cors.js            # CORS handling
│   ├── supabase.js        # Database client
│   └── utils.js           # Helper functions
├── src/                    # Frontend React application
│   ├── components/        # React components
│   ├── hooks/            # Custom hooks
│   └── lib/              # Frontend utilities
├── database/              # Database schema
├── public/               # Static assets
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies
└── DEPLOYMENT_GUIDE.md   # Deployment instructions
```

## 🔧 Konfigurasi

### Environment Variables

```env
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Hugging Face
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Environment
NODE_ENV=production
```

### Vercel Configuration

File `vercel.json` sudah dikonfigurasi untuk:
- Frontend build dengan Vite
- Backend serverless functions
- CORS headers
- Performance optimization

## 📊 Dashboard Features

### 🏠 Dashboard Utama
- Real-time system metrics
- Performance trends
- Agent status overview
- Recent activity feed

### 🤖 Agent Management
- Agent registry dan status
- Performance monitoring
- Health checks
- Task distribution

### 📋 Task Management
- Task queue monitoring
- Execution history
- Priority management
- Error tracking

### 📈 Analytics & Metrics
- Performance analytics
- Success rate tracking
- Response time monitoring
- Custom reports

### 📝 Logs & Monitoring
- System logs
- Error tracking
- Real-time monitoring
- Audit trail

### ⚙️ Settings
- System configuration
- Agent settings
- Performance tuning
- Integration setup

## 🚀 Deployment

### Vercel Deployment

1. **Push ke GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy ke Vercel**
- Login ke Vercel Dashboard
- Import GitHub repository
- Configure environment variables
- Deploy

3. **Setup Database**
- Jalankan SQL schema di Supabase
- Configure RLS policies

Lihat [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) untuk instruksi lengkap.

## 🧪 Testing

### Frontend Testing
```bash
pnpm run dev
# Test di browser: http://localhost:5173
```

### API Testing
```bash
# Test agent factory
curl http://localhost:5173/api/agent-factory

# Test sentiment analysis
curl -X POST http://localhost:5173/api/sentiment-agent \
  -H "Content-Type: application/json" \
  -d '{"text": "This is amazing!"}'
```

## 📚 API Documentation

### Agent Factory (`/api/agent-factory`)
- `GET` - List all agents
- `POST` - Create new agent
- `PUT` - Update agent
- `DELETE` - Remove agent

### Sentiment Agent (`/api/sentiment-agent`)
- `POST` - Analyze text sentiment
- Input: `{"text": "string"}`
- Output: `{"sentiment": "positive|negative|neutral", "confidence": 0.95}`

### Recommendation Agent (`/api/recommendation-agent`)
- `POST` - Generate recommendations
- Input: `{"user_data": {}, "context": {}}`
- Output: `{"recommendations": []}`

### Performance Monitor (`/api/performance-monitor`)
- `GET` - Get system metrics
- `POST` - Log performance data

## 🔒 Security

- CORS protection untuk semua API endpoints
- Input validation dan sanitization
- Environment variables untuk sensitive data
- Supabase RLS untuk database security
- HTTPS enforcement di production

## 🎯 Performance

- Serverless functions dengan cold start optimization
- Frontend code splitting dan lazy loading
- Database connection pooling
- CDN untuk static assets
- Optimized bundle size

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License - lihat [LICENSE](LICENSE) untuk detail.

## 🆘 Support

- 📖 [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- 🐛 [GitHub Issues](https://github.com/your-repo/issues)
- 📧 Email: support@fmaa.dev

## 🙏 Acknowledgments

- [Vercel](https://vercel.com/) - Deployment platform
- [Supabase](https://supabase.com/) - Database dan backend
- [Hugging Face](https://huggingface.co/) - AI/ML models
- [React](https://react.dev/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

**Made with ❤️ for modern web applications**

*FMAA - Empowering Analytics with Intelligent Micro-Agents*

