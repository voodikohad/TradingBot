import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useStore } from './store'
import { Navbar } from './components/Navbar'
import { Dashboard } from './pages/Dashboard'
import { SignalsPage } from './pages/Signals'
import { LogsPage } from './pages/Logs'
import { SettingsPage } from './pages/Settings'
import { TestPage } from './pages/Test'
import './styles/globals.css'

function App() {
  const initialize = useStore((state) => state.initialize)

  // Initialize store with real data
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signals" element={<SignalsPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
