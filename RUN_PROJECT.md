# 🚀 Complete DataTalkAI Project - Running Guide

## Prerequisites

Before starting, ensure you have:
- **Python 3.9+** installed
- **Node.js 16+** and npm installed
- **Google Gemini API Key** (get free key from https://aistudio.google.com)

Verify installations:
```bash
python --version
node --version
npm --version
```

---

## 📋 Quick Start (3 Steps)

### Step 1: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API key
# Create a file named ".env" in the backend folder with:
# GEMINI_API_KEY=your_actual_gemini_api_key_here

# Start backend server
python -m uvicorn main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

✅ **Backend is running!** Keep this terminal open.

---

### Step 2: Setup Frontend (New Terminal)

```bash
# Open a NEW terminal/command window
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

You should see:
```
VITE v4.4.9 ready in XXX ms

➜  Local:   http://localhost:5173/
```

✅ **Frontend is running!** Keep this terminal open.

---

### Step 3: Open in Browser

Open your browser and go to:
```
http://localhost:5173
```

✅ **Application is ready!** You're all set!

---

## 📊 Directory Structure

```
DataTalkAI/
├── backend/
│   ├── venv/                    # Virtual environment
│   ├── data/
│   │   ├── datatalk_ai.db       # SQLite database
│   │   └── sales_data.csv       # Sample data
│   ├── main.py                  # FastAPI server
│   ├── database.py              # Database operations
│   ├── gemini_client.py         # Gemini AI integration
│   ├── query_engine.py          # Query generation
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Your API key (create this)
│   └── .env.example             # Template
│
├── frontend/
│   ├── node_modules/            # JavaScript dependencies
│   ├── src/
│   │   ├── components/          # React components (10 files)
│   │   ├── api.js               # API client
│   │   ├── App.jsx              # Main app
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── package.json             # Dependencies
│   ├── vite.config.js           # Build config
│   ├── tailwind.config.js       # CSS theme
│   └── .env.local               # Optional config
│
└── README.md
```

---

## 🔑 Getting Your API Key

1. Go to: https://aistudio.google.com
2. Click "Get API Key"
3. Create a new API key
4. Copy the key

Create `backend/.env`:
```
GEMINI_API_KEY=your_key_here_without_quotes
```

---

## 🧪 Testing the Application

### Try These Demo Queries:

1. **Simple Query** (2 minutes)
   ```
   Compare average online spend by shopping preference
   ```
   Expected: Bar chart showing spending by preference

2. **Distribution Query** (2 minutes)
   ```
   Show the distribution of customers by city tier
   ```
   Expected: Pie chart showing customer distribution

3. **Complexity Query** (6 minutes)
   ```
   Show the relationship between tech savvy score and average online spend
   ```
   Expected: Scatter plot with follow-up chat option

---

## 🛑 Stopping the Application

### Stop Backend:
Press `Ctrl + C` in the backend terminal

### Stop Frontend:
Press `Ctrl + C` in the frontend terminal

---

## ❌ Troubleshooting

### Backend Won't Start

**"Port 8000 already in use"**
```bash
# Find and kill process on port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9
```

**"Module not found" error**
```bash
# Reinstall requirements
pip install -r requirements.txt --force-reinstall
```

**"API Key error"**
- Check `.env` file exists in backend folder
- Verify API key is correct (no extra spaces)
- Key should be: `GEMINI_API_KEY=sk-...`

**"Database error"**
```bash
# Database is auto-created
# If issues persist, delete and restart:
# (The app will recreate it automatically)
```

---

### Frontend Won't Start

**"npm ERR! code ENOENT"**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**"Cannot GET /api/..."**
- Ensure backend is running on http://localhost:8000
- Check backend terminal for "Application startup complete"

**"Port 5173 already in use"**
```bash
# Vite will use next available port automatically
# Or manually specify:
npm run dev -- --port 3000
```

---

## 📱 Accessing from Other Devices

### From Same Network:

1. Find your computer's IP:
   ```bash
   # Windows: ipconfig
   # Mac/Linux: ifconfig
   ```

2. From another device, visit:
   ```
   http://your_ip:5173
   ```

### Enable Shared Backend:

Edit `frontend/vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': 'http://0.0.0.0:8000',  // Allow external connections
  },
}
```

---

## 📦 Building for Production

### Frontend Build:
```bash
cd frontend
npm run build
# Creates optimized dist/ folder
# Upload dist/ to hosting (Vercel, Netlify, etc)
```

### Backend Deployment:
```bash
# Use production server instead of dev reload
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

---

## 🔄 Complete Terminal Commands Reference

### Backend (Terminal 1)
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate    # Mac/Linux
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

### Then Open:
```
http://localhost:5173
```

---

## ✅ Verification Checklist

- [ ] Python virtual environment activated (shows `(venv)` in terminal)
- [ ] Backend running on `http://127.0.0.1:8000`
- [ ] Backend shows "Application startup complete"
- [ ] Frontend running on `http://localhost:5173`
- [ ] Browser shows DataTalk AI header
- [ ] Can type in query input box
- [ ] Backend .env file has API key
- [ ] No errors in browser console (F12)
- [ ] Try a demo query successfully

---

## 🎯 Full Workflow Example

### Terminal 1 (Backend):
```bash
C:\Users\swarn\OneDrive\Desktop\DataTalkAI> cd backend
C:\Users\swarn\OneDrive\Desktop\DataTalkAI\backend> python -m venv venv
C:\Users\swarn\OneDrive\Desktop\DataTalkAI\backend> venv\Scripts\activate
(venv) C:\Users\swarn\OneDrive\Desktop\DataTalkAI\backend> pip install -r requirements.txt
...installing...
(venv) C:\Users\swarn\OneDrive\Desktop\DataTalkAI\backend> python -m uvicorn main:app --reload
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Terminal 2 (Frontend):
```bash
C:\Users\swarn\OneDrive\Desktop\DataTalkAI> cd frontend
C:\Users\swarn\OneDrive\Desktop\DataTalkAI\frontend> npm install
...installing...
C:\Users\swarn\OneDrive\Desktop\DataTalkAI\frontend> npm run dev
➜  Local:   http://localhost:5173/
```

### Browser:
```
1. Open http://localhost:5173
2. See DataTalk AI dashboard
3. Type: "Compare average online spend by shopping preference"
4. Click "Generate"
5. See bar chart appear with data
```

---

## 🎓 Understanding the Architecture

```
User Input (Browser)
    ↓
Frontend (React) http://localhost:5173
    ↓
API Call (/api/query)
    ↓
Backend (FastAPI) http://127.0.0.1:8000
    ↓
Gemini LLM API
    ↓
SQL Query Generation
    ↓
SQLite Database
    ↓
Data Retrieved
    ↓
Chart Suggestions + Data
    ↓
Frontend Renders Charts & Metrics
    ↓
User Sees Dashboard
```

---

## 📞 Quick Help

| Issue | Solution |
|-------|----------|
| Backend not starting | Check Python 3.9+, activate venv |
| Frontend not starting | Check Node 16+, `npm install` |
| Port already in use | Kill process or use different port |
| API key error | Check `.env` file in backend folder |
| Blank dashboard | Check browser console (F12) for errors |
| Slow queries | Normal for first query, subsequent queries faster |

---

## 🚀 You're Ready!

Your complete DataTalkAI application is now running with:
- ✅ Modern dark theme frontend
- ✅ AI-powered query processing
- ✅ Interactive charts (5 types)
- ✅ CSV upload support
- ✅ Chat-based refinement
- ✅ Professional UI/UX

**Enjoy your application!** 🎉

---

Last Updated: March 18, 2026
