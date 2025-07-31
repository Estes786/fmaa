# FMAA Dashboard - Federated Micro-Agents Architecture

A comprehensive dashboard for managing and monitoring federated micro-agents with real-time analytics, performance monitoring, and intelligent recommendations.

## 🚀 **Latest Update: Vercel Deployment Fixed**

✅ **All Vercel deployment issues have been resolved:**
- ES Modules conversion completed
- Dependencies added (@supabase/supabase-js, dotenv)
- vercel.json optimized
- Build process verified

**Status:** Ready for production deployment! 🎉

## Features

- **Agent Management**: Create, monitor, and manage micro-agents
- **Performance Analytics**: Real-time performance metrics and monitoring
- **Sentiment Analysis**: AI-powered sentiment analysis for user feedback
- **Recommendation Engine**: Intelligent recommendations based on user behavior
- **Real-time Dashboard**: Live updates and interactive visualizations
- **Responsive Design**: Works seamlessly across all devices

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **Charts**: Recharts
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase
- **Deployment**: Vercel

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fmaa-dashboard.git
   cd fmaa-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Add your Supabase credentials
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## API Endpoints

- `GET /api/agent-factory` - Agent management
- `GET /api/performance-monitor` - Performance metrics
- `GET /api/recommendation-agent` - Recommendations
- `GET /api/sentiment-agent` - Sentiment analysis

## Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   - Import from GitHub
   - Setup environment variables
   - Deploy automatically

2. **Environment Variables**
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   NODE_ENV=production
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

**Built with ❤️ for the FMAA community**

