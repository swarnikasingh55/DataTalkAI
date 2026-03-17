# DataTalkAI Development Documentation

Comprehensive guide for developers working on DataTalkAI codebase.

## Frontend Architecture

### Technology Stack
- **React 18** - UI framework with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS
- **Recharts** - React charting library
- **Lucide React** - Icon library

### Component Hierarchy

```
App
└── Dashboard
    ├── Header
    ├── QueryInput
    ├── ErrorAlert
    ├── SuccessAlert
    ├── LoadingSkeleton
    ├── MetricsGrid
    ├── ChartRenderer (multiple)
    ├── ChatPanel
    └── DataTable
```

### Component Descriptions

#### App.jsx
Entry point component that renders Dashboard.

#### Dashboard.jsx
**Purpose**: Main orchestrator component managing state and API calls.

**State**:
- `prompt` (string) - Current user input
- `isLoading` (boolean) - Loading state
- `error` (string|null) - Error message
- `success` (string|null) - Success message
- `dashboardData` (object|null) - Returned dashboard data
- `uploadedFile` (string|null) - Uploaded file name
- `sessionToken` (string|null) - CSV session token
- `chatMessages` (array) - Chat history

**Key Functions**:
- `handleQuerySubmit(text)` - Submit query to backend
- `handleUpload(file)` - Upload CSV file
- `handleSendFollowUp(message)` - Send follow-up chat message

#### Header.jsx
Displays top banner with app title and branding.

**Props**:
- `uploadedFile` (string|null) - Currently loaded file name

#### QueryInput.jsx
Input form for natural language queries and CSV upload.

**Props**:
- `prompt` (string) - Current input value
- `setPrompt` (function) - Update input
- `onSubmit` (function) - Handle query submit
- `onUpload` (function) - Handle file upload
- `isLoading` (boolean) - Loading state

#### ChartRenderer.jsx
Intelligent chart rendering based on chart type.

**Props**:
- `chart` (object) - Chart configuration
  - `type` (string) - Chart type (bar, line, area, pie, scatter)
  - `title` (string) - Chart title
  - `x_key` (string) - X-axis data key
  - `y_key` (string) - Y-axis data key
  - `category_key` (string|null) - Category field
- `data` (array) - Data points array

**Supported Types**:
- `bar` - Bar charts for categorical data
- `line` - Line charts for trends
- `area` - Area charts for cumulative data
- `pie` - Pie charts for parts-of-whole
- `scatter` - Scatter plots for correlations

#### MetricsGrid.jsx
Displays KPI cards with key metrics.

**Props**:
- `rowCount` (number) - Rows returned
- `dataSource` (string) - Data source name
- `insight` (string) - Key insight text

#### DataTable.jsx
Expandable table showing raw data and SQL query.

**Props**:
- `data` (array) - Data rows
- `sql` (string) - Generated SQL query

#### ChatPanel.jsx
Chat interface for follow-up questions.

**Props**:
- `messages` (array) - Chat messages
- `onSendMessage` (function) - Message handler
- `isLoading` (boolean) - Loading state
- `sessionToken` (string|null) - Session token
- `dataSource` (string) - Data source name

#### ErrorAlert.jsx
Displays error messages with dismiss button.

**Props**:
- `error` (string) - Error message
- `suggestion` (string|null) - Helpful suggestion
- `onDismiss` (function) - Dismiss handler

#### SuccessAlert.jsx
Toast notification with auto-dismiss.

**Props**:
- `message` (string) - Success message
- `onDismiss` (function) - Dismiss handler
- `duration` (number, default 5000) - Auto-dismiss delay

#### LoadingSkeleton.jsx
Skeleton loading screen while data loads.

**Props**:
- `gridCols` (number, default 2) - Grid column count

### API Integration (api.js)

#### `queryData(prompt, sessionToken, history)`
Submit query and get dashboard data.

**Parameters**:
- `prompt` (string) - Natural language query
- `sessionToken` (string|null) - CSV session token
- `history` (array) - Chat message history

**Returns**: Promise resolving to dashboard data object

**Response Format**:
```javascript
{
  sql: "SELECT ...",
  charts: [
    {
      type: "bar",
      title: "...",
      x_key: "field1",
      y_key: "field2"
    }
  ],
  data: [ /* array of data rows */ ],
  insight: "Key finding...",
  row_count: 100
}
```

**Error Response**:
```javascript
{
  error: "Error message",
  suggestion: "Try this instead...",
  sql: "SELECT ..." // optional
}
```

#### `uploadCSV(file)`
Upload CSV file for querying.

**Parameters**:
- `file` (File) - File object from input

**Returns**: Promise with upload response

**Response Format**:
```javascript
{
  session_token: "uuid",
  filename: "data.csv",
  schema: { /* column info */ },
  message: "Loaded data.csv..."
}
```

#### `getSchema(sessionToken)`
Get database schema/column information.

**Parameters**:
- `sessionToken` (string|null) - CSV session token

**Returns**: Promise with schema object

## Styling

### Tailwind Configuration
- Located in `tailwind.config.js`
- Custom colors defined in theme.extend.colors
- Responsive breakpoints: sm, md, lg, xl, 2xl

### CSS Classes

Common utility patterns:
```jsx
// Flexbox
className="flex items-center justify-between gap-4"

// Grid
className="grid grid-cols-1 gap-6 md:grid-cols-2"

// Cards
className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"

// Interactive elements
className="hover:shadow-md transition-shadow"

// Text
className="text-lg font-semibold text-gray-900"
```

### Color Palette
- `gray-50` to `gray-900` - Grayscale
- `blue-600` - Primary action color
- `red-600` - Error/destructive
- `green-600` - Success
- `amber-600` - Warning

## State Management

Current implementation uses React hooks for state management:
- `useState()` for local component state
- `useCallback()` for memoized functions
- `useRef()` for DOM references
- `useEffect()` for side effects

Future optimization opportunities:
- Context API for global state
- Zustand for complex state
- React Query for server state

## Performance Considerations

### Optimizations Applied
- Memoized handlers with `useCallback`
- Recharts ResponsiveContainer for responsive charts
- Lazy loading of data table rows
- CSS animations instead of JS animations
- Event delegation in list rendering

### Optimization Opportunities
- Code splitting for routes
- Virtual scrolling for large tables
- Memoized chart components
- Debounced input handlers

## Adding New Features

### Adding a New Chart Type

1. Update `ChartRenderer.jsx`:
```jsx
case 'newtype':
  return (
    <NewChartComponent>
      {/* Chart configuration */}
    </NewChartComponent>
  );
```

2. Update backend to suggest new type in chart recommendations

3. Test with sample data

### Adding Navigation

1. Install React Router:
```bash
npm install react-router-dom
```

2. Create route structure in App.jsx
3. Update vite.config.js with routing config

### Extending Chat Functionality

1. Add message types to ChatPanel
2. Implement specialized message rendering
3. Handle different response types from backend

## Testing Approach

### Manual Testing Checklist
- [ ] Query submission works
- [ ] Dashboards render
- [ ] Charts display correctly
- [ ] CSV upload succeeds
- [ ] Follow-up questions update dashboard
- [ ] Error messaging displays
- [ ] Mobile responsive
- [ ] Loading states show
- [ ] Tooltips on hover work

### Component Testing (Recommended)
Use Vitest + React Testing Library:
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

Example test:
```jsx
import { render, screen } from '@testing-library/react';
import { QueryInput } from './QueryInput';

test('renders submit button', () => {
  render(<QueryInput prompt="" setPrompt={() => {}} onSubmit={() => {}} />);
  expect(screen.getByText('Generate')).toBeInTheDocument();
});
```

## Debugging Tips

### Browser DevTools
- **F12** - Open developer tools
- **Console** - Check for errors
- **Network** - Monitor API calls
- **Performance** - Profile rendering
- **React DevTools** - Inspect component tree

### Common Issues
1. **Charts not showing**: Check data format in props
2. **API errors**: Verify backend is running, check CORS
3. **Styling issues**: Check Tailwind config, compile CSS
4. **State not updating**: Verify dependencies in useCallback

### Logging
Add debugging logs:
```jsx
console.log('Chart data:', data);
console.log('Error:', error);
```

## Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deployment Options
1. **Vercel** (recommended for Vite)
   ```bash
   npm i -g vercel
   vercel --prod
   ```

2. **Netlify**
   - Connect GitHub repo
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Docker**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "run", "preview"]
   ```

## Backend Integration

### API Contracts

**POST /api/query**
```javascript
// Request
{
  "prompt": "Show revenue by region",
  "session_token": null,
  "history": []
}

// Response Success
{
  "sql": "SELECT region, SUM(revenue) FROM sales GROUP BY region",
  "charts": [{type: "bar", title: "Revenue by Region", x_key: "region", y_key: "revenue"}],
  "data": [{region: "US", revenue: 50000}, ...],
  "insight": "US is top region with $50k revenue",
  "row_count": 50
}

// Response Error
{
  "error": "Could not interpret query",
  "suggestion": "Try mentioning specific columns like revenue, region, or date"
}
```

**POST /api/upload**
```javascript
// Response
{
  "session_token": "uuid",
  "filename": "sales.csv",
  "schema": {"columns": ["id", "date", "revenue", "region"]},
  "message": "Loaded sales.csv"
}
```

## Version Control

### Commit Message Format
```
feat: Add new chart type
fix: Resolve chart rendering bug
docs: Update README
style: Format component code
refactor: Reorganize component structure
test: Add chart rendering tests
```

### Branch Naming
```
feature/chart-types
fix/api-error-handling
docs/setup-guide
```

## Resources

- **React Hooks**: https://react.dev/reference/react/hooks
- **Tailwind Utilities**: https://tailwindcss.com/docs/utility-first
- **Recharts API**: https://recharts.org/api
- **Vite Guide**: https://vitejs.dev/guide/
- **JavaScript Async**: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous

## Contributing

1. Create feature branch
2. Make changes with clear commit messages
3. Test thoroughly
4. Submit PR with description
5. Await code review

---

Last Updated: March 2026
