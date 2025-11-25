import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import { SignalTable } from '../components/DataDisplay'
import { Badge } from '../components/UI'
import { Search, Filter } from 'lucide-react'

export const SignalsPage = () => {
  const signals = useStore((state) => state.signals)
  const fetchSignals = useStore((state) => state.fetchSignals)
  const [search, setSearch] = useState('')
  const [filterSide, setFilterSide] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    // Initial fetch
    fetchSignals();

    // Poll for updates every 3 seconds
    const interval = setInterval(() => {
      fetchSignals();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchSignals]);

  const filteredSignals = signals.filter((signal) => {
    if (search && !signal.symbol.includes(search.toUpperCase())) return false
    if (filterSide !== 'all' && signal.side !== filterSide) return false
    if (filterStatus !== 'all' && signal.status !== filterStatus) return false
    return true
  })

  return (
    <div className="min-h-screen bg-dark-950 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Trading Signals</h1>
          <p className="text-gray-400">Monitor all incoming TradingView alerts</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-white/10 rounded-xl p-6 mb-6"
        >
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dark-800 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <span className="text-sm text-gray-400">Side:</span>
            </div>
            {['all', 'long', 'short'].map((side) => (
              <button
                key={side}
                onClick={() => setFilterSide(side)}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  filterSide === side
                    ? side === 'long' ? 'bg-success/30 text-success border border-success/50' :
                      side === 'short' ? 'bg-danger/30 text-danger border border-danger/50' :
                      'bg-accent/30 text-accent border border-accent/50'
                    : 'bg-dark-800 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {side}
              </button>
            ))}

            <div className="border-l border-white/10" />

            <span className="text-sm text-gray-400">Status:</span>
            {['all', 'received', 'sent', 'completed', 'error'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  filterStatus === status
                    ? 'bg-accent/30 text-accent border border-accent/50'
                    : 'bg-dark-800 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-white/10 rounded-xl p-6 overflow-auto"
        >
          {filteredSignals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No signals found</p>
            </div>
          ) : (
            <>
              <SignalTable signals={filteredSignals} />
              <div className="mt-4 text-sm text-gray-400">
                Showing {filteredSignals.length} of {signals.length} signals
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
