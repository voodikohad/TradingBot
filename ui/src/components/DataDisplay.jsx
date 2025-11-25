import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

export const LogViewer = ({ maxHeight = 'h-96', autoScroll = true }) => {
  const logs = useStore((state) => state.logs)
  const [filter, setFilter] = useState('all')
  const [scrollToBottom, setScrollToBottom] = useState(true)

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true
    return log.level?.includes(filter) || log.type?.includes(filter)
  })

  const logVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  }

  return (
    <div className="bg-card border border-white/10 rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-dark-900 border-b border-white/10 p-4 flex items-center justify-between">
        <h3 className="font-semibold">Live Logs</h3>
        <div className="flex gap-2">
          {['all', 'webhook', 'telegram', 'error'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm transition-all ${
                filter === f
                  ? 'bg-accent text-white'
                  : 'bg-dark-800 text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Container */}
      <div className={`${maxHeight} overflow-y-auto bg-dark-950 font-mono text-sm`}>
        <AnimatePresence mode="popLayout">
          {filteredLogs.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No logs yet...</div>
          ) : (
            filteredLogs.map((log, idx) => (
              <motion.div
                key={log.id || idx}
                variants={logVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`px-4 py-2 border-b border-white/5 text-xs ${
                  log.level === 'error' ? 'text-danger' :
                  log.level === 'warning' ? 'text-warning' :
                  log.level === 'success' ? 'text-success' :
                  'text-gray-400'
                }`}
              >
                <span className="text-gray-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                {' '}
                <span className="text-gray-500">[{log.level}]</span>
                {' '}
                {log.message}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export const SignalTable = ({ signals }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'sent': return 'accent'
      case 'received': return 'warning'
      case 'error': return 'danger'
      default: return 'gray'
    }
  }

  const getSideColor = (side) => side === 'long' ? 'success' : 'danger'

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-gray-400">
            <th className="text-left px-4 py-3 font-semibold">Time</th>
            <th className="text-left px-4 py-3 font-semibold">Symbol</th>
            <th className="text-left px-4 py-3 font-semibold">Action</th>
            <th className="text-left px-4 py-3 font-semibold">Side</th>
            <th className="text-left px-4 py-3 font-semibold">Size</th>
            <th className="text-left px-4 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {signals.map((signal, idx) => (
              <motion.tr
                key={signal.id || idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="border-b border-white/5 hover:bg-dark-800/50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-400">{new Date(signal.timestamp).toLocaleTimeString()}</td>
                <td className="px-4 py-3 font-semibold">{signal.symbol}</td>
                <td className="px-4 py-3">{signal.action}</td>
                <td className="px-4 py-3">
                  <span className={`text-${getSideColor(signal.side)}`}>
                    {signal.side.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">{signal.size}{signal.size_type === 'percent' ? '%' : 'USD'}</td>
                <td className="px-4 py-3">
                  <motion.span
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 1, repeat: signal.status !== 'completed' ? Infinity : 0 }}
                    className={`inline-block px-2 py-1 rounded text-xs bg-${getStatusColor(signal.status)}/20 text-${getStatusColor(signal.status)}`}
                  >
                    {signal.status}
                  </motion.span>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}
