import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useStore } from '../store'
import { useNavigate } from 'react-router-dom'

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const setAuthenticated = useStore((state) => state.setAuthenticated)
  const setUser = useStore((state) => state.setUser)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setAuthenticated(true)
    setUser({ email, name: email.split('@')[0] })
    navigate('/')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-accent/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-success/10 rounded-full blur-3xl"
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-card border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-accent to-accent/50 rounded-xl flex items-center justify-center"
          >
            <span className="text-3xl">⚡</span>
          </motion.div>

          <h1 className="text-3xl font-bold text-center mb-2">TradingBot</h1>
          <p className="text-center text-gray-400 mb-8">Automation Control Panel</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tradingbot.com"
                  required
                  className="w-full bg-dark-800 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-dark-800 border border-white/10 rounded-lg pl-10 pr-10 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded accent-current" />
              <span className="text-sm text-gray-400">Remember me</span>
            </label>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} />
                  Logging in...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Sign In
                </>
              )}
            </motion.button>

            {/* Forgot Password */}
            <p className="text-center text-sm text-gray-400">
              <a href="#" className="text-accent hover:underline">Forgot password?</a>
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-4">
          Default credentials: admin@tradingbot.com / password
        </p>
      </motion.div>
    </div>
  )
}
