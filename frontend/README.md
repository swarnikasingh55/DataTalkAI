# DataTalk AI Frontend

A modern, interactive React-based frontend for generating business intelligence dashboards using natural language prompts.

## Features

✨ **Key Capabilities**

- **Natural Language Queries**: Convert plain English questions into interactive dashboards
- **Multi-Chart Support**: Bar charts, line charts, area charts, pie charts, and scatter plots
- **CSV Upload**: Upload your own data files and query them instantly
- **Follow-up Questions**: Chat-based interface for refining dashboards on the fly
- **Real-time Visualization**: Interactive Recharts-based visualizations with tooltips and legends
- **Error Handling**: Graceful error messages with helpful suggestions
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices

## Tech Stack

- **React 18** - UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - React charting library
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:8000`

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (optional):**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Main container component
│   │   ├── QueryInput.jsx         # Query submission interface
│   │   ├── ChartRenderer.jsx      # Multi-chart rendering engine
│   │   ├── MetricsGrid.jsx        # KPI cards
│   │   ├── DataTable.jsx          # Tabular data display
│   │   ├── ChatPanel.jsx          # Follow-up questions interface
│   │   ├── Header.jsx             # Top navigation
│   │   ├── ErrorAlert.jsx         # Error notifications
│   │   └── SuccessAlert.jsx       # Success notifications
│   ├── api.js                     # HTTP client for backend API
│   ├── App.jsx                    # Root React component
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## API Integration

The frontend communicates with the backend via these endpoints:

### Query Generation
**POST** `/api/query`
- Takes a natural language prompt
- Returns charts, data, insights, and SQL

### CSV Upload
**POST** `/api/upload`
- Accepts CSV file upload
- Returns session token for querying uploaded data

### Schema Info
**GET** `/api/schema`
- Returns database schema information

### Health Check
**GET** `/api/health`
- Verifies backend availability

## Component Overview

### Dashboard.jsx
Main orchestrator that manages:
- User input and query submission
- CSV uploads and session tokens
- Chat history for follow-up questions
- Error/success notifications
- Dashboard rendering

### ChartRenderer.jsx
Intelligent chart selection supporting:
- Bar charts (categorical/time-series comparisons)
- Line charts (trend analysis)
- Area charts (cumulative trends)
- Pie charts (part-to-whole relationships)
- Scatter plots (correlation analysis)

Automatically formats axes, adds legends, and configures tooltips.

### QueryInput.jsx
Features:
- Multi-line textarea for natural language input
- File upload for CSV data
- Example query chips for quick starts
- Loading state indicator
- Submit button with validation

### ChatPanel.jsx
Enables follow-up interactions:
- Scrollable message history
- Maintains conversation context
- Submits refined queries maintaining history
- Loading indicator while processing

### DataTable.jsx
Displays underlying data:
- Responsive table with column headers
- Expandable/collapsible rows
- Formatted numeric values
- SQL query preview

## Usage Examples

### Basic Query
1. Enter: "Show me sales by region"
2. AI generates appropriate visualization
3. Chart appears with key insights

### CSV Upload
1. Click "Upload CSV"
2. Select your data file
3. Ask questions about the data
4. Dashboard generates with your data

### Follow-up Questions
1. After dashboard displays
2. Ask: "Show only top 3 regions"
3. AI refines visualization
4. Chat maintains full context

## Styling

All styling uses Tailwind CSS utility classes for:
- Responsive layouts (mobile-first)
- Consistent color scheme (#3b82f6 primary blue)
- Smooth transitions and animations
- Accessible color contrast ratios

Key customizations in `tailwind.config.js`:
- Primary color: #3b82f6 (blue)
- Success color: #10b981 (green)
- Warning color: #f59e0b (amber)
- Danger color: #ef4444 (red)

## Performance Optimizations

- Lazy component loading with React.lazy
- Memoized chart rendering
- Throttled search input
- Efficient re-renders with useCallback
- CSS animations for smooth UX

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Troubleshooting

### "Cannot reach backend"
- Ensure backend is running on `http://localhost:8000`
- Check CORS headers in backend configuration
- Verify proxy settings in `vite.config.js`

### CSV upload fails
- Verify file is valid CSV format
- Check column names don't contain special characters
- Ensure file size is reasonable (< 10MB)

### Charts not rendering
- Check browser console for errors
- Verify data structure matches expected format
- Ensure sufficient data points for selected chart type

## Environment Variables

Optional configuration via `.env.local`:

```
VITE_API_URL=http://localhost:8000
```

## Contributing

1. Create a feature branch
2. Make changes to components
3. Test thoroughly
4. Submit PR with description

## License

MIT
