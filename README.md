# DataTalkAI

Working prototype for "Conversational AI for Instant Business Intelligence Dashboards".

## What It Does

- accepts plain-English business prompts
- converts them into SQL against a generated customer behavior dataset
- returns chart suggestions, insights, and tabular results
- renders a dashboard in the browser
- supports CSV upload for querying custom datasets
- provides chat-based interface for follow-up questions

## Architecture

**Backend**: FastAPI (Python) - Handles AI queries, SQL generation, database operations
**Frontend**: React 18 + Vite + Tailwind CSS - Modern, responsive UI with interactive charts

## Quick Start (Both Backend & Frontend)

### 1. Backend Setup

```bash
cd backend
py -3 -m pip install -r requirements.txt
```

Create `backend/.env`:
```
GEMINI_API_KEY=your_actual_key
```

Start the backend:
```bash
py -3 -m uvicorn main:app --reload
```

The backend will run at `http://127.0.0.1:8000`

### 2. Frontend Setup

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

Access the full app at `http://localhost:5173` (frontend automatically proxies to backend API)

## Project Structure

```
DataTalkAI/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── database.py          # Database operations
│   ├── gemini_client.py     # LLM integration
│   ├── query_engine.py      # Query generation & insights
│   ├── requirements.txt
│   └── data/
│       ├── datatalk_ai.db   # SQLite database
│       └── sales_data.csv   # Sample data
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── api.js           # API client
│   │   └── index.css        # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## Frontend Features

✨ **Component Highlights**

- **QueryInput**: Natural language input with example prompts and CSV upload
- **ChartRenderer**: Intelligent multi-chart support (bar, line, area, pie, scatter)
- **ChatPanel**: Follow-up questions interface with conversation history
- **DataTable**: Expandable data view with SQL query display
- **MetricsGrid**: KPI cards showing key statistics
- **ErrorAlert**: Graceful error handling with suggestions
- **SuccessAlert**: Toast notifications

See [frontend/README.md](./frontend/README.md) for detailed documentation.

## Demo Prompts

- `Compare average online spend by shopping preference`
- `Show the distribution of customers by city tier`
- `Compare average store visits by gender`
- `Show the relationship between tech savvy score and average online spend`
- `Show top 5 products by revenue`
- `Compare sales trends month by month`

## Features

✅ **Core Capabilities**

- Natural language to SQL conversion
- Multi-chart visualization rendering
- CSV data upload and querying
- Follow-up questions via chat interface
- Real-time dashboard generation
- Interactive chart interactions (hover, tooltips, zoom)
- Responsive mobile design
- Error handling with suggestions
- Session-based CSV data persistence

## Technology Stack

**Backend:**
- FastAPI - Modern Python web framework
- SQLite/PostgreSQL - Data storage
- Google Gemini API - LLM integration
- Pydantic - Data validation

**Frontend:**
- React 18 - UI framework
- Vite - Build tool
- Tailwind CSS - Styling
- Recharts - Charting library
- Lucide React - Icons

## Configuration

### Backend (.env)
```
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///./data/datatalk_ai.db  # Optional
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8000
```

## Performance Tips

- Limit CSV uploads to < 10MB
- Keep queries focused on 1-2 questions at a time
- Use specific column names in follow-ups
- Charts render faster with < 1000 data points

## Troubleshooting

**Frontend won't connect to backend:**
- Ensure backend is running on port 8000
- Check CORS settings in backend/main.py
- Verify proxy in frontend/vite.config.js

**CSV upload fails:**
- Verify CSV is properly formatted
- Check file extension is .csv
- Ensure column names don't contain special characters

**Charts don't show:**
- Verify data structure is correct
- Check browser console for errors
- Ensure sufficient data points for chart type

## Next Steps

- [ ] Add data export (CSV, PNG)
- [ ] Implement dashboard templates
- [ ] Add user authentication
- [ ] Support multiple datasets simultaneously
- [ ] Add advanced filtering UI
- [ ] Implement caching for common queries

## License

MIT
