# 🎨 UI Component Documentation

## Available Components

### Layout Components

#### Navbar
Navigation bar with mobile responsiveness
```jsx
import { Navbar } from './components'

<Navbar />
```

### Display Components

#### DashboardCard
Status card with icon and value
```jsx
<DashboardCard
  icon={Server}
  label="Server Status"
  value="Online"
  status="online"
  color="success"
/>
```

Props:
- `icon` - Lucide React icon component
- `label` - Card label
- `value` - Main value/text
- `status` - Status text (online/offline/connecting)
- `color` - Color theme (accent/success/danger/warning)

#### StatCard
Statistics card with change indicator
```jsx
<StatCard
  title="Total Signals"
  value={1234}
  change={12}
  icon={TrendingUp}
/>
```

Props:
- `title` - Card title
- `value` - Main value
- `change` - Change percentage
- `icon` - Lucide React icon

### Form Components

#### Input
Form input with label and error support
```jsx
<Input
  label="API Token"
  placeholder="Enter token"
  error={error}
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

Props:
- `label` - Input label
- `placeholder` - Placeholder text
- `error` - Error message (shows if present)
- Standard input props

#### Button
Animated button with variants
```jsx
<Button
  variant="primary"
  size="md"
  loading={isLoading}
  onClick={handleClick}
>
  Click Me
</Button>
```

Props:
- `variant` - primary/secondary/danger/ghost
- `size` - sm/md/lg
- `loading` - Show loading spinner
- Standard button props

#### Toggle
Smooth toggle switch
```jsx
<Toggle
  checked={enabled}
  onChange={(val) => setEnabled(val)}
  label="Enable Feature"
/>
```

Props:
- `checked` - Toggle state
- `onChange` - State change callback
- `label` - Toggle label

#### Badge
Status badge component
```jsx
<Badge variant="success" size="md">
  Active
</Badge>
```

Props:
- `variant` - default/success/danger/warning/long/short
- `size` - sm/md/lg
- `children` - Badge content

### Data Display Components

#### LogViewer
Terminal-style log display
```jsx
<LogViewer maxHeight="h-96" autoScroll={true} />
```

Props:
- `maxHeight` - Container height (Tailwind class)
- `autoScroll` - Auto-scroll to bottom

#### SignalTable
Trading signals table
```jsx
<SignalTable signals={signalsArray} />
```

Props:
- `signals` - Array of signal objects

## Usage Examples

### Dashboard Page
```jsx
import { Dashboard } from './pages'
import { DashboardCard, StatCard } from './components'
import { Server, Zap } from 'lucide-react'

function MyDashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <DashboardCard
        icon={Server}
        label="Status"
        value="Online"
        color="success"
      />
      <StatCard
        title="Signals Today"
        value={42}
        change={15}
        icon={Zap}
      />
    </div>
  )
}
```

### Settings Form
```jsx
import { Input, Button, Toggle } from './components'
import { useState } from 'react'

function SettingsForm() {
  const [token, setToken] = useState('')
  const [enabled, setEnabled] = useState(true)

  return (
    <div className="space-y-4">
      <Input
        label="API Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <Toggle
        checked={enabled}
        onChange={setEnabled}
        label="Auto-sync"
      />
      <Button onClick={handleSave}>Save</Button>
    </div>
  )
}
```

### Real-time Monitoring
```jsx
import { useStore } from './store'
import { LogViewer, SignalTable } from './components'

function Monitor() {
  const logs = useStore((state) => state.logs)
  const signals = useStore((state) => state.signals)

  return (
    <div className="grid grid-cols-2 gap-6">
      <LogViewer />
      <SignalTable signals={signals} />
    </div>
  )
}
```

## Styling

All components use Tailwind CSS and support custom classes:

```jsx
<Button className="w-full mt-4">
  Custom Styling
</Button>
```

### Color Classes
- `text-accent` - Primary color
- `text-success` - Success color
- `text-danger` - Danger color
- `text-warning` - Warning color
- `bg-card` - Card background
- `bg-dark-900` - Dark background

### Animations
- `animate-pulse-glow` - Pulsing glow effect
- `animate-slide-in` - Slide in animation
- `animate-fade-in` - Fade in animation

Framer Motion is integrated for advanced animations:
```jsx
import { motion } from 'framer-motion'

<motion.div
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.2 }}
>
  Animated content
</motion.div>
```

## Responsive Design

Components are fully responsive with Tailwind breakpoints:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

Breakpoints:
- `sm` - 640px
- `md` - 768px
- `lg` - 1024px
- `xl` - 1280px

## State Management

Use Zustand for global state:

```jsx
import { useStore } from './store'

function MyComponent() {
  const signals = useStore((state) => state.signals)
  const addSignal = useStore((state) => state.addSignal)

  return (
    <div>
      {signals.map((signal) => (
        <SignalItem key={signal.id} signal={signal} />
      ))}
    </div>
  )
}
```

## Custom Hooks

### useApi
Handle API calls
```jsx
const { request, loading, error } = useApi()
const data = await request('GET', '/api/endpoint')
```

### useWebSocket
WebSocket connection
```jsx
const { data, connected } = useWebSocket('ws://localhost:3000')
```

## Best Practices

1. **Use composition** - Build complex UIs from simple components
2. **Leverage Zustand** - Keep state management simple
3. **Animate thoughtfully** - Use animations to enhance UX, not distract
4. **Mobile first** - Design for mobile, enhance for desktop
5. **Performance** - Use React.memo for expensive components
6. **Accessibility** - Test with keyboard navigation
7. **Documentation** - Comment complex logic

---

**For more details, see the main README.md**
