# 🚀 UI Setup & Deployment Guide

## Quick Start

### 1. Install Dependencies
```bash
cd c:\TradingBot\ui
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Visit http://localhost:5173

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## Development Workflow

### Start Development
```bash
npm run dev
```

Features:
- Hot Module Replacement (HMR)
- Fast refresh
- Source maps for debugging

### Lint Code
```bash
npm run lint
```

### Format Code (Optional)
```bash
npm install --save-dev prettier
npm run format
```

---

## Project Structure

```
c:\TradingBot\ui/
├── public/
├── src/
│   ├── pages/
│   │   ├── Login.jsx (100+ lines)
│   │   ├── Dashboard.jsx (250+ lines)
│   │   ├── Signals.jsx (150+ lines)
│   │   ├── Logs.jsx (130+ lines)
│   │   ├── Settings.jsx (200+ lines)
│   │   └── Test.jsx (180+ lines)
│   │
│   ├── components/
│   │   ├── Navbar.jsx (100+ lines)
│   │   ├── Cards.jsx (80+ lines)
│   │   ├── UI.jsx (120+ lines)
│   │   ├── DataDisplay.jsx (140+ lines)
│   │   └── index.js (exports)
│   │
│   ├── store/
│   │   └── index.js (Zustand store)
│   │
│   ├── hooks/
│   │   └── index.js (Custom hooks)
│   │
│   ├── styles/
│   │   └── globals.css (Tailwind + custom styles)
│   │
│   ├── App.jsx (Main app)
│   └── main.jsx (Entry point)
│
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.json
├── .env.example
├── .gitignore
└── README.md
```

**Total Lines of Code:** 1500+

---

## Configuration

### Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=TradingBot
```

### Vite Configuration

Edit `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
```

### Tailwind CSS

Custom colors in `tailwind.config.js`:
```javascript
colors: {
  accent: '#3f51ff',
  success: '#0be881',
  danger: '#ff3f34',
  warning: '#ffa801',
}
```

---

## Pages Overview

### 1. Login Page (100+ lines)
- Email/password authentication
- Animated background with gradients
- Remember me checkbox
- Responsive design
- Error handling

### 2. Dashboard (250+ lines)
- System status cards (4 columns)
- Statistics widgets (3 cards)
- Real-time charts (2 Recharts)
- Recent signals feed
- Animated transitions

### 3. Signals Monitor (150+ lines)
- Live trading signals table
- Search by symbol
- Filter by side (long/short)
- Filter by status
- Color-coded badges
- Pagination ready

### 4. Logs Viewer (130+ lines)
- Terminal-style display
- Filter buttons (all/webhook/telegram/errors)
- Auto-scroll toggle
- Clear logs button
- Real-time updates
- Log statistics

### 5. Settings (200+ lines)
- Webhook configuration
- Telegram bot setup
- Cornix chat ID settings
- Copy-to-clipboard buttons
- Toggle switches
- Save with confirmation

### 6. System Test (180+ lines)
- Webhook connectivity test
- Telegram bot test
- System health check
- Real-time results
- Success/error animations

---

## Component Architecture

### Smart Components (Containers)
- `Dashboard` - Fetches and manages data
- `SignalsPage` - Filters and displays signals
- `SettingsPage` - Manages configuration

### Presentational Components
- `DashboardCard` - Displays status
- `StatCard` - Shows statistics
- `Button` - Generic button
- `Input` - Form input
- `Badge` - Status badges
- `LogViewer` - Log display
- `SignalTable` - Signal table

### Hooks
- `useApi()` - API calls
- `useWebSocket()` - Real-time data
- `useStore()` - Global state

---

## Styling System

### Color Palette
```css
--accent: #3f51ff    /* Primary */
--success: #0be881   /* Success */
--danger: #ff3f34    /* Error */
--warning: #ffa801   /* Warning */
--dark-950: #0f1115  /* Background */
--card: #1a1d24      /* Card background */
```

### Typography
```css
--font-sans: Inter, Plus Jakarta Sans
--text-h1: 28px
--text-h2: 22px
--text-body: 15-16px
```

### Shadows & Effects
```css
--shadow-card: 0 10px 30px rgba(0, 0, 0, 0.3)
--shadow-glow: 0 0 20px rgba(63, 81, 255, 0.3)
--glass: bg-white/10 backdrop-blur-md
```

---

## Animation Library

### Framer Motion Features
- Page transitions
- Card animations
- Button interactions
- Loading spinners
- List staggering
- Chart animations

### Example:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.05 }}
>
  Animated content
</motion.div>
```

---

## State Management

### Zustand Store
Located in `src/store/index.js`

```javascript
// Get state
const signals = useStore((state) => state.signals)

// Update state
const addSignal = useStore((state) => state.addSignal)
addSignal(newSignal)
```

### Store Structure
```javascript
{
  isAuthenticated: boolean,
  user: object,
  settings: object,
  signals: array,
  logs: array,
  systemStatus: object,
  stats: object,
}
```

---

## API Integration

### Development Proxy
Vite automatically proxies `/api/*` to `http://localhost:3000`

### Example Call
```javascript
const { request } = useApi()
const data = await request('POST', '/webhook', payload)
```

---

## Responsive Design

### Breakpoints
- `sm` - 640px (tablets)
- `md` - 768px (small screens)
- `lg` - 1024px (desktops)
- `xl` - 1280px (wide screens)

### Mobile-First Approach
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 col mobile, 2 col tablet, 3 col desktop */}
</div>
```

---

## Performance Optimization

### Code Splitting
- Vite automatically splits routes
- Lazy loading on pages
- Tree-shaking of unused code

### Production Build
```bash
npm run build
```

Output size: ~50KB gzipped

### Lighthouse Scores Target
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 100

---

## Deployment Options

### Option 1: Vercel
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Option 3: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

### Option 4: Static Server (Nginx)
```nginx
server {
  listen 80;
  location / {
    root /var/www/tradingbot-ui;
    try_files $uri $uri/ /index.html;
  }
}
```

---

## Testing (Optional)

### Add Vitest
```bash
npm install --save-dev vitest @testing-library/react
```

### Example Test
```javascript
import { render, screen } from '@testing-library/react'
import { Dashboard } from './pages/Dashboard'

describe('Dashboard', () => {
  it('renders correctly', () => {
    render(<Dashboard />)
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
  })
})
```

---

## Troubleshooting

### Port already in use
```bash
npm run dev -- --port 5174
```

### Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
npm run build -- --debug
```

### Clear cache
```bash
rm -rf dist .vite
npm run build
```

---

## Development Tips

1. **Use React DevTools** - Browser extension for debugging
2. **Vite DevTools** - Check network and performance
3. **Console logs** - Great for debugging state
4. **Hot reload** - Edit and see changes instantly
5. **Performance tab** - Monitor render times

---

## Security Checklist

- ✅ Never commit `.env` files
- ✅ Use HTTPS in production
- ✅ Sanitize user input
- ✅ Validate API responses
- ✅ Use secure storage for tokens
- ✅ Implement CORS properly
- ✅ Keep dependencies updated

---

## Updating Dependencies

### Check for updates
```bash
npm outdated
```

### Update all
```bash
npm update
```

### Update specific package
```bash
npm install package@latest
```

---

## Performance Monitoring

### Check bundle size
```bash
npm install --save-dev rollup-plugin-visualizer
```

### Analyze build
```bash
npm run build -- --analyze
```

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start dev server: `npm run dev`
3. ✅ Open browser: http://localhost:5173
4. ✅ Login with: admin@tradingbot.com / password
5. ✅ Explore all pages
6. ✅ Build for production: `npm run build`
7. ✅ Deploy to your server

---

## Resources

- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Built with ❤️ for professional trading automation**
