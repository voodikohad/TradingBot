import React from 'react'
import { motion } from 'framer-motion'

export const DashboardCard = ({ icon: Icon, label, value, status, color = 'accent', animate = true }) => {
  const colorMap = {
    accent: 'from-accent/20 to-accent/5',
    success: 'from-success/20 to-success/5',
    danger: 'from-danger/20 to-danger/5',
    warning: 'from-warning/20 to-warning/5',
  }

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      whileHover={{ translateY: -5 }}
      className={`bg-gradient-to-br ${colorMap[color]} border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:border-white/20 transition-all cursor-pointer group`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-2">{label}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {status && (
            <p className={`text-xs mt-2 ${
              status === 'online' ? 'text-success' :
              status === 'offline' ? 'text-danger' :
              'text-warning'
            }`}>
              {status === 'online' ? '● ' : '○ '}{status}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}/10 group-hover:shadow-glow transition-all`}>
          <Icon size={24} className={`text-${color}`} />
        </div>
      </div>
    </motion.div>
  )
}

export const StatCard = ({ title, value, change, icon: Icon }) => {
  const isPositive = change >= 0

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-card border border-white/10 rounded-xl p-6 hover:border-accent/50 transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon size={32} className="text-accent opacity-50" />
      </div>
      {change !== undefined && (
        <p className={`text-sm mt-2 ${isPositive ? 'text-success' : 'text-danger'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </p>
      )}
    </motion.div>
  )
}
