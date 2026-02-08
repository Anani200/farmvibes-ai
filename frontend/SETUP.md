# FarmVibes.AI Frontend - Quick Start Guide

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn installed
- FarmVibes.AI backend running (local cluster on `localhost:31108`)

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

This will install all required dependencies:
- React 18 & React DOM
- TypeScript for type safety
- Vite as build tool
- TailwindCSS for styling
- Leaflet for interactive maps
- Recharts for data visualization
- React Router for navigation
- Axios for API calls
- And more...

### Step 2: Configure API Endpoint (Optional)

The frontend defaults to `http://localhost:31108/v0` for the API.

To use a different endpoint, create a `.env` file in the `frontend/` directory:

```bash
VITE_API_URL=http://your-api-url:31108/v0
```

Or configure it in the Settings page after starting the app.

### Step 3: Start Development Server

```bash
npm run dev
```

This starts the development server at `http://localhost:5173` with hot reload enabled.

### Step 4: Open in Browser

Navigate to http://localhost:5173 and you're ready to start!

## 🚀 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code quality checks |
| `npm run type-check` | TypeScript type checking |

## 📋 What's Implemented (Phase 1)

### ✅ Core Features
1. **Home Page** - Dashboard with quick navigation and system status
2. **Workflow Discovery** - Browse, search, and view available workflows
3. **Run Management** - Submit workflows and monitor execution in real-time
4. **Results Viewer** - View run outputs and download results
5. **System Dashboard** - Display real-time system metrics (CPU, Memory, Disk)
6. **Settings Page** - Configure API endpoint and app preferences

### ✅ Components
- Navigation bar with system metrics
- Footer with project info
- Responsive layout with TailwindCSS
- System status widget with progress bars
- Interactive map component (Leaflet)
- Workflow cards with descriptions
- Run list with pagination
- Status badges with icons

### ✅ API Integration
- Automatic polling for run status updates
- Error handling and retry logic
- API client singleton pattern
- Type-safe API calls with TypeScript

### ✅ Developer Experience
- TypeScript strict mode for type safety
- Hot module reloading (HMR)
- ESLint configuration
- Clean, modular code structure
- Custom React hooks for data fetching

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── pages/                 # Page components
│   │   ├── HomePage.tsx       # Dashboard
│   │   ├── WorkflowsPage.tsx  # Workflow discovery
│   │   ├── RunsPage.tsx       # Run management
│   │   ├── ResultsPage.tsx    # Results viewer
│   │   └── SettingsPage.tsx   # Settings
│   ├── components/            # Reusable components
│   │   ├── Layout/            # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── index.tsx
│   │   ├── GeoMap.tsx         # Interactive map
│   │   ├── SystemStatus.tsx   # System metrics widget
│   │   └── forms/             # Form components (placeholder)
│   ├── services/
│   │   └── api.ts             # REST API client (Axios wrapper)
│   ├── hooks/                 # Custom React hooks
│   │   ├── useWorkflows.ts    # Fetch workflows
│   │   ├── useRuns.ts         # Fetch and monitor runs
│   │   └── useSystemMetrics.ts # Poll system metrics
│   ├── types/
│   │   └── api.ts             # TypeScript interfaces for API
│   ├── utils/
│   │   ├── constants.ts       # API URLs, status colors, intervals
│   │   ├── formatting.ts      # Date, duration, file size formatting
│   │   └── polling.ts         # Polling utilities
│   ├── App.tsx                # Main router
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
├── tailwind.config.ts         # TailwindCSS configuration
└── README.md                  # Project documentation
```

## 🔧 Configuration

### API Configuration
Edit `src/utils/constants.ts` to change:
- API base URL
- Poll intervals for runs and metrics
- Run status colors and icons

### Styling
Edit `tailwind.config.ts` to customize:
- Color scheme
- Typography
- Spacing
- And more with Tailwind utilities

### Build
Edit `vite.config.ts` to configure:
- Build output directory
- Proxy settings for API
- TypeScript path aliases

## 📖 Usage Examples

### Browse Workflows
1. Click "Workflows" in the navbar
2. Search for a specific workflow or browse all
3. Click a workflow card to see details
4. Click "Run This Workflow" to start (placeholder)

### Monitor Runs
1. Click "Runs" in the navbar
2. See all submitted workflows with real-time status updates
3. Click "View Results" on completed runs
4. Use "Cancel" button to stop running workflows

### Check System Status
1. View CPU, Memory, Disk usage in the navbar
2. See detailed metrics on the home page
3. Cards show usage with color-coded bars

## 🐛 Troubleshooting

### API Connection Issues
- Verify FarmVibes.AI backend is running: `curl http://localhost:31108/v0/`
- Check API URL in Settings page matches your backend
- Check browser console for CORS errors

### Dependencies Installation
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Issues
```bash
# Clear build cache
rm -rf dist
npm run build
```

## 📚 Next Steps

### Phase 2 (Enhanced Visualization)
- Time series charts for monitoring data
- Categorical map visualization
- Heatmap viewer
- Run comparison tools

### Phase 3 (Advanced Features)
- Visual workflow builder
- Workflow templates
- Data catalog
- Export reports
- Authentication & sharing

## 🤝 Contributing

Contributions welcome! Areas to focus on:
1. Enhanced visualization components
2. More sophisticated polling strategies
3. Error handling and user feedback
4. Accessibility improvements
5. Performance optimizations

## 📝 Notes

- The frontend is type-safe with TypeScript strict mode
- All API interactions are wrapped in a client singleton
- Custom hooks handle loading, error, and data states
- Real-time polling for run status updates
- Responsive design works on mobile, tablet, and desktop
- Tailwind CSS for rapid UI development

## ❓ Getting Help

- Check FarmVibes.AI documentation: https://microsoft.github.io/farmvibes-ai/
- Review React documentation: https://react.dev
- Vite guide: https://vitejs.dev
- Tailwind CSS docs: https://tailwindcss.com
