# DataTalkAI Setup Guide

A complete guide to running DataTalkAI locally with both backend and frontend.

## Prerequisites

### System Requirements
- **OS**: Windows, macOS, or Linux
- **Memory**: 2GB minimum
- **Disk Space**: 500MB for dependencies and data

### Required Software
- **Python 3.9+** - Backend runtime
- **Node.js 16+** - Frontend runtime
- **npm or yarn** - JavaScript package manager
- **Git** - Version control (optional but recommended)

### API Keys
- **Google Gemini API Key** - Get it from [Google AI Studio](https://aistudio.google.com)

## Installation Steps

### Step 1: Clone or Download Repository

```bash
git clone <repository_url>
cd DataTalkAI
```

### Step 2: Backend Installation

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Create Python Virtual Environment
**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### 2.4 Configure Environment Variables
Create a `.env` file in the `backend` directory:
```
GEMINI_API_KEY=your_google_gemini_api_key_here
```

**Note**: You can get a free API key at [Google AI Studio](https://aistudio.google.com)

#### 2.5 Verify Backend Setup
```bash
python -c "import fastapi; import sqlite3; print('Backend dependencies OK')"
```

### Step 3: Frontend Installation

#### 3.1 Navigate to Frontend Directory
```bash
cd ../frontend
```

#### 3.2 Install Node Modules
```bash
npm install
```

Or with yarn:
```bash
yarn install
```

#### 3.3 Configure Environment (Optional)
Create `.env.local`:
```
VITE_API_URL=http://localhost:8000
```

#### 3.4 Verify Frontend Setup
```bash
npm --version
```

## Running the Application

### Method 1: Sequential Startup (Recommended for Beginners)

#### Terminal 1: Start Backend
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m uvicorn main:app --reload
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

#### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v4.4.9 ready in XXX ms

➜  Local:   http://localhost:5173/
```

#### Step 3: Open Application
Open browser and go to: `http://localhost:5173`

### Method 2: Parallel Startup (Advanced)

Using process managers like `concurrently`:

```bash
npm install -g concurrently
```

In project root, create `start.sh`:
```bash
#!/bin/bash
concurrently \
  "cd backend && python -m uvicorn main:app --reload" \
  "cd frontend && npm run dev"
```

Then run:
```bash
chmod +x start.sh
./start.sh
```

## Verification Checklist

After starting both services, verify:

- [ ] Backend API responding: `http://localhost:8000/api/health`
- [ ] Frontend loads: `http://localhost:5173`
- [ ] No console errors in browser
- [ ] Can submit queries
- [ ] Dashboards render properly
- [ ] CSV upload works

### Quick Test

1. Navigate to `http://localhost:5173`
2. Type: "Compare average online spend by shopping preference"
3. Click "Generate"
4. Wait for dashboard to appear
5. Verify chart displays

## Troubleshooting

### Backend Issues

#### "Module not found" error
```bash
# Ensure virtual environment is activated
cd backend
pip install -r requirements.txt  # Reinstall
```

#### "Gemini API error" or "Invalid API key"
- Verify `GEMINI_API_KEY` is correctly set in `.env`
- Check API key is active on Google Cloud Console
- Ensure API quotas aren't exceeded

#### "Address already in use: ('127.0.0.1', 8000)"
Backend port is occupied. Either:
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :8000   # Windows (find PID and taskkill)
```

Or use different port:
```bash
uvicorn main:app --reload --port 8001
```

#### "SQLite database is locked"
Close other connections to the database or restart backend.

### Frontend Issues

#### "Cannot GET /api/..." errors
- Verify backend is running on `http://localhost:8000`
- Check proxy configuration in `vite.config.js`
- Look for CORS errors in browser console

#### "npm ERR! code ENOENT"
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Charts not rendering
- Check browser DevTools Console (F12) for errors
- Verify data structure matches expected format
- Try with different query/data

#### "Module not found" in frontend
```bash
npm install --save-dev @vitejs/plugin-react
```

### General Issues

#### Port conflicts
- Backend needs: `8000`
- Frontend needs: `5173`

Use different ports if needed:
```bash
# Backend on different port
uvicorn main:app --reload --port 8001

# Update vite.config.js proxy settings
```

#### Slow performance
- Reduce dataset size (use smaller CSV)
- Clear browser cache
- Use Chrome's DevTools Performance tab to profile

#### CSV upload issues
- **File too large**: Limit to < 10MB
- **Invalid format**: Ensure proper CSV structure
- **Bad encoding**: Save CSV as UTF-8

## Directory Structure After Setup

```
DataTalkAI/
├── backend/
│   ├── venv/                    # Virtual environment
│   ├── data/
│   │   ├── datatalk_ai.db
│   │   └── sales_data.csv
│   ├── main.py
│   ├── database.py
│   ├── gemini_client.py
│   ├── query_engine.py
│   ├── requirements.txt
│   └── .env                     # YOUR API KEY
├── frontend/
│   ├── node_modules/            # Dependencies
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── .env.local               # Optional
└── README.md
```

## Development Mode Features

### Backend Features
- Auto-reload on code changes
- SQL query logging
- Error stack traces
- API documentation at `/docs`

### Frontend Features
- Fast Refresh (HMR)
- Source maps for debugging
- Component preview
- Hot module replacement

## Building for Production

### Backend
```bash
# Backend is ready to deploy as-is
# For production, use:
cd backend
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Frontend
```bash
cd frontend
npm run build

# Output will be in dist/ folder
# Deploy dist/ folder to static hosting
```

## Next Steps

1. **Explore Demo Queries**: Try the example prompts provided
2. **Upload Custom Data**: Add your own CSV files
3. **Chat with Dashboards**: Use follow-up questions feature
4. **Review Code**: Explore backend/frontend implementations
5. **Customize**: Modify components as needed

## Performance Optimization

### Backend
- Use connection pooling for databases
- Cache frequent queries
- Implement rate limiting
- Add query timeout protection

### Frontend
- Code splitting with Vite
- Lazy load components
- Optimize chart rendering
- Compress images

## Security Considerations

- Never commit `.env` files with real API keys
- Use environment variables for secrets
- Validate user inputs on frontend
- Sanitize SQL on backend
- Use HTTPS in production
- Implement rate limiting
- Add authentication for production

## Additional Resources

- **Vite Docs**: https://vitejs.dev/
- **React Docs**: https://react.dev/
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **Recharts**: https://recharts.org/
- **Tailwind CSS**: https://tailwindcss.com/
- **Google Gemini API**: https://ai.google.dev/

## Getting Help

1. Check browser console for errors (F12)
2. Check backend logs in terminal
3. Review GitHub issues
4. Check documentation in README files

## Quick Commands Reference

```bash
# Backend setup & run
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload

# Frontend setup & run
cd frontend
npm install
npm run dev

# Build frontend for production
npm run build

# Kill process on port (macOS/Linux)
lsof -ti:8000 | xargs kill -9

# Clear npm cache
npm cache clean --force

# Test API
curl http://localhost:8000/api/health
```

## Feedback & Support

For issues, feature requests, or questions:
1. Check existing documentation
2. Review open issues
3. Create new issue with detailed description
4. Include error messages and steps to reproduce
