# FarmVibes.AI Frontend

Modern web dashboard for the FarmVibes.AI agricultural geospatial ML platform.

## Build Setup

```bash
# Install dependencies
npm install

# Development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## Features (Phase 1)

✅ **Workflow Discovery** - Browse all available workflows with search and filtering
✅ **Run Management** - Submit workflows, monitor execution status, view progress
✅ **Results Viewer** - Display run outputs and download results
✅ **System Dashboard** - Monitor CPU, memory, and disk usage

## Architecture

### Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Maps**: Leaflet + React-Leaflet
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Routing**: React Router v6

### Project Structure
```
frontend/
├── src/
│   ├── pages/          # Page components (Home, Workflows, Runs, Results, Settings)
│   ├── components/     # Reusable UI components
│   ├── services/       # API client implementation
│   ├── hooks/          # Custom React hooks (useWorkflows, useRuns, useSystemMetrics)
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main router component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/
├── package.json
└── vite.config.ts
```

## API Integration

The frontend connects to the FarmVibes.AI REST API at `http://localhost:31108/v0` by default.

### Key Endpoints Used
- `GET /workflows` - List all workflows
- `POST /runs` - Submit workflow run
- `GET /runs` - List workflow runs
- `GET /runs/{runId}` - Get run details
- `POST /runs/{runId}/cancel` - Cancel a run
- `DELETE /runs/{runId}` - Delete completed run
- `GET /system-metrics` - Get system metrics

## Configuration

### Environment Variables
Create `.env` file in project root:

```
VITE_API_URL=http://localhost:31108/v0
```

### Customization
- API URL can be changed in Settings page
- Poll intervals can be adjusted in `src/utils/constants.ts`
- Color scheme configured in `tailwind.config.ts`

## Development

### Running Locally

1. Start the FarmVibes.AI backend (local cluster)
2. Install frontend dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Open http://localhost:5173 in your browser

### Making Changes
- Hot reload enabled for instant feedback
- TypeScript strict mode for type safety
- ESLint for code quality

## Roadmap

### Phase 2: Enhanced Visualization
- Time series charts for NDVI, carbon estimates
- Categorical map visualization with legends
- Heatmap viewer for temperature/precipitation
- Run comparison tool (side-by-side comparison)

### Phase 3: Advanced Features
- Visual workflow builder (drag-and-drop)
- Workflow templates and reusable components
- Data catalog for browsing input datasets
- Export results as reports (PDF)
- User authentication and role-based access
- Shareable run results with public links

## Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

## License
Microsoft Open Source - See LICENSE in parent directory
