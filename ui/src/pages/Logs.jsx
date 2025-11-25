import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import { LogViewer } from '../components/DataDisplay'
import { Button } from '../components/UI'
import { Trash2 } from 'lucide-react'

export const LogsPage = () => {
  const logs = useStore((state) => state.logs)
  const clearLogs = useStore((state) => state.clearLogs)
  const fetchLogs = useStore((state) => state.fetchLogs)
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    // Initial fetch
    fetchLogs();

    // Poll for updates every 2 seconds
    const interval = setInterval(() => {
      fetchLogs();
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchLogs]);

  const stats = {
    total: logs.length,
    errors: logs.filter(l => l.level === 'error').length,
    warnings: logs.filter(l => l.level === 'warning').length,
    info: logs.filter(l => l.level === 'info').length,
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">System Logs</h1>
          <p className="text-gray-400">Real-time system activity</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
        >
          {[
            { label: 'Total', value: stats.total, color: 'accent' },
            { label: 'Errors', value: stats.errors, color: 'danger' },
            { label: 'Warnings', value: stats.warnings, color: 'warning' },
            { label: 'Info', value: stats.info, color: 'success' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className={`bg-card border border-white/10 rounded-lg p-4 text-center hover:border-${stat.color}/50 transition-all`}
            >
              <p className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 mb-6"
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-300">Auto-scroll</span>
          </label>

          <div className="flex-1" />

          <Button
            variant="danger"
            onClick={clearLogs}
            className="gap-2"
          >
            <Trash2 size={18} />
            Clear Logs
          </Button>
        </motion.div>

        {/* Log Viewer */}
        <LogViewer maxHeight="h-[500px]" autoScroll={autoScroll} />
      </div>
    </div>
  )
}
