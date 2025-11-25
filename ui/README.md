# 🎨 TradingBot UI - Professional Dashboard

A modern, fully responsive, production-ready UI for the TradingView → Telegram → Cornix automation bot.

## ✨ Features

✅ **Modern Dark Theme** - Premium crypto dashboard aesthetic  
✅ **Smooth Animations** - Framer Motion powered interactions  
✅ **Fully Responsive** - Desktop, tablet, mobile optimized  
✅ **Real-time Data** - Live signal monitoring and logs  
✅ **Beautiful Charts** - Recharts integration for analytics  
✅ **Component Library** - Reusable UI components  
✅ **State Management** - Zustand for efficient state  

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd ui
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build

```bash
npm run build
```

Output goes to `dist/`

## 📁 Project Structure

```
ui/
├── src/
│   ├── pages/          # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Signals.jsx
│   │   ├── Logs.jsx
│   │   ├── Settings.jsx
│   │   └── Test.jsx
│   │
│   ├── components/     # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Cards.jsx
│   │   ├── UI.jsx
│   │   └── DataDisplay.jsx
│   │
│   ├── store/         # Zustand state management
│   │   └── index.js
│   │
│   ├── hooks/         # Custom React hooks
│   │   └── index.js
│   │
│   ├── styles/        # Global styles
│   │   └── globals.css
│   │
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
│
├── index.html         # HTML template
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🎯 Pages

### 1. Login Page
- Email/password authentication
- Animated background
- "Remember me" option
- Responsive design

### 2. Dashboard
- System status cards
- Real-time charts
- Statistics widgets
- Recent signals feed
- Beautiful animations

### 3. Signals Monitor
- Live trading signals table
- Search and filter functionality
- Color-coded status badges
- Responsive data display

### 4. Logs Viewer
- Real-time log streaming
- Filter by type (webhook, telegram, errors)
- Auto-scroll toggle
- Clear logs button

### 5. Settings
- Webhook configuration
- Telegram bot token management
- Cornix chat ID setup
- Additional toggles
- Copy-to-clipboard buttons

### 6. System Test
- Webhook connectivity test
- Telegram bot test
- System health check
- Real-time results display

## 🎨 Design System

### Colors
- **Background:** `#0f1115`
- **Card:** `#1a1d24`
- **Primary:** `#3f51ff` (Accent)
- **Success:** `#0be881`
- **Danger:** `#ff3f34`
- **Warning:** `#ffa801`

### Typography
- **Font:** Inter, Plus Jakarta Sans
- **H1:** 28px
- **H2:** 22px
- **Body:** 15-16px

### Components
- **Button** - Primary, secondary, danger, ghost variants
- **Badge** - Color-coded status badges
- **Card** - Dashboard stat cards with icons
- **Input** - Form inputs with validation
- **Toggle** - Smooth toggle switches
- **Table** - Data display with animations
- **LogViewer** - Terminal-style log display

## 🔧 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Charts & graphs
- **Zustand** - State management
- **Lucide React** - Icons
- **React Router** - Navigation

## 📱 Responsive Design

- **Mobile:** 320px and up
- **Tablet:** 768px and up
- **Desktop:** 1024px and up
- **Wide:** 1280px and up

## 🎬 Animation Features

- ✅ Smooth page transitions
- ✅ Card entry animations
- ✅ Button hover/click effects
- ✅ Data table animations
- ✅ Chart animations on load
- ✅ Loading spinners
- ✅ Toast notifications (expandable)
- ✅ Staggered list animations

## 🔌 API Integration

The UI connects to the backend at `http://localhost:3000`:

```javascript
// Example API call
const { request } = useApi()
await request('POST', '/webhook', { /* data */ })
```

Proxy configured in Vite for development.

## 📊 State Management

Using Zustand for efficient state:

```javascript
import { useStore } from './store'

// Get state
const signals = useStore((state) => state.signals)

// Update state
const addSignal = useStore((state) => state.addSignal)
addSignal(newSignal)
```

## 🎯 Usage Examples

### Add a New Signal
```javascript
const addSignal = useStore((state) => state.addSignal)
addSignal({
  id: Date.now(),
  timestamp: new Date().toISOString(),
  symbol: 'BTCUSDT',
  side: 'long',
  size: 1.0,
  status: 'completed'
})
```

### Update System Status
```javascript
const updateSystemStatus = useStore((state) => state.updateSystemStatus)
updateSystemStatus({
  server: 'online',
  telegram: 'connected'
})
```

### Log Message
```javascript
const addLog = useStore((state) => state.addLog)
addLog({
  id: Date.now(),
  timestamp: new Date().toISOString(),
  message: 'Webhook received',
  level: 'info',
  type: 'webhook'
})
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Serve Production Build
```bash
npm run preview
```

### Docker Support (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 🔒 Security Notes

- Never commit `.env` files
- Keep API tokens secure
- Use HTTPS in production
- Implement proper CORS
- Validate all inputs

## 📈 Performance

- **Code splitting** - Automatic with Vite
- **Lazy loading** - Route-based splitting
- **Optimized bundle** - Tree-shaking enabled
- **Fast refresh** - HMR during development
- **Production build** - ~50KB gzipped

## 🐛 Troubleshooting

### Port already in use
```bash
# Use different port
npm run dev -- --port 5174
```

### API connection issues
Check that backend is running on `http://localhost:3000`

### Styling not applied
Clear browser cache and rebuild:
```bash
npm run build
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Recharts](https://recharts.org)

## 📄 License

MIT License - Feel free to use and modify

---

**Built with ❤️ for professional crypto trading automation**
