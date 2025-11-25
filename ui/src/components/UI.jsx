import React from 'react'
import { motion } from 'framer-motion'

export const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-accent/20 text-accent border border-accent/30',
    success: 'bg-success/20 text-success border border-success/30',
    danger: 'bg-danger/20 text-danger border border-danger/30',
    warning: 'bg-warning/20 text-warning border border-warning/30',
    long: 'bg-success/20 text-success border border-success/30',
    short: 'bg-danger/20 text-danger border border-danger/30',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <span className={`inline-block rounded-full font-semibold ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}

export const Button = ({ children, variant = 'primary', size = 'md', loading = false, ...props }) => {
  const variants = {
    primary: 'bg-accent hover:bg-accent/90 text-white',
    secondary: 'bg-dark-800 hover:bg-dark-700 text-white border border-white/10',
    danger: 'bg-danger/20 hover:bg-danger/30 text-danger border border-danger/30',
    ghost: 'hover:bg-dark-800 text-white',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-lg font-semibold transition-all flex items-center gap-2 ${variants[variant]} ${sizes[size]} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
      disabled={loading}
      {...props}
    >
      {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </motion.button>
  )
}

export const Input = ({ label, error, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      <input
        className={`bg-dark-800 border rounded-lg px-4 py-2 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 ${
          error ? 'border-danger focus:ring-danger/50' : 'border-white/10 focus:ring-accent/50'
        }`}
        {...props}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
}

export const Toggle = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <motion.div
        className={`w-12 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-success' : 'bg-dark-700'}`}
        onClick={() => onChange(!checked)}
      >
        <motion.div
          className="w-4 h-4 bg-white rounded-full"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.div>
      {label && <span className="text-sm text-gray-300">{label}</span>}
    </label>
  )
}
