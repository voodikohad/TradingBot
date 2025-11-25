import React from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Signals', path: '/signals' },
    { label: 'Logs', path: '/logs' },
    { label: 'Settings', path: '/settings' },
    { label: 'Test', path: '/test' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-950/95 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center group-hover:shadow-glow transition-shadow">
              <span className="text-lg font-bold">⚡</span>
            </div>
            <span className="text-lg font-bold hidden sm:inline">TradingBot</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-all ${
                  location.pathname === item.path
                    ? 'bg-accent text-white'
                    : 'text-gray-400 hover:text-white hover:bg-dark-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 hover:bg-dark-800 rounded-lg transition-colors"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 border-t border-white/10"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? 'bg-accent text-white'
                      : 'text-gray-400 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
