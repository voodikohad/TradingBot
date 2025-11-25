import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Server, Wifi, Send, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { useStore } from '../store'
import { DashboardCard, StatCard } from '../components/Cards'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export const Dashboard = () => {
  const systemStatus = useStore((state) => state.systemStatus)
  const stats = useStore((state) => state.stats)
  const signals = useStore((state) => state.signals)
  const fetchStats = useStore((state) => state.fetchStats)
  const fetchSystemStatus = useStore((state) => state.fetchSystemStatus)
  const fetchSignals = useStore((state) => state.fetchSignals)

  useEffect(() => {
    // Initial fetch
    fetchStats();
    fetchSystemStatus();
    fetchSignals();

    // Poll for updates every 3 seconds
    const interval = setInterval(() => {
      fetchStats();
      fetchSystemStatus();
      fetchSignals();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchStats, fetchSystemStatus, fetchSignals]);

  // Generate chart data from signals
  const chartData = React.useMemo(() => {
    // Group signals by day for the last 7 days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return {
        name: days[date.getDay()],
        signals: 0,
        success: 0,
        failed: 0,
        dateStr: date.toDateString()
      };
    });

    // Count signals for each day
    signals.forEach(signal => {
      const signalDate = new Date(signal.timestamp).toDateString();
      const dayData = last7Days.find(d => d.dateStr === signalDate);
      if (dayData) {
        dayData.signals++;
        if (signal.status === 'sent' || signal.status === 'completed') {
          dayData.success++;
        } else if (signal.status === 'error') {
          dayData.failed++;
        }
      }
    });

    return last7Days;
  }, [signals]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Real-time automation monitoring</p>
        </motion.div>

        {/* System Status Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={Server}
              label="Server Status"
              value={systemStatus.server === 'online' ? 'Online' : 'Offline'}
              status={systemStatus.server}
              color="success"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={Send}
              label="Webhook Status"
              value="Ready"
              status={systemStatus.webhook}
              color="success"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={Wifi}
              label="Telegram Bot"
              value={systemStatus.telegram === 'online' ? 'Connected' : 'Connecting...'}
              status={systemStatus.telegram}
              color={systemStatus.telegram === 'online' ? 'success' : 'warning'}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={CheckCircle}
              label="Cornix Status"
              value={systemStatus.cornix === 'online' ? 'Active' : 'Unknown'}
              status={systemStatus.cornix}
              color="success"
            />
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <motion.div variants={itemVariants}>
            <StatCard
              title="Total Signals"
              value={stats.totalSignals}
              change={12}
              icon={TrendingUp}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="Today's Signals"
              value={stats.todaySignals}
              change={8}
              icon={CheckCircle}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="Success Rate"
              value={`${stats.successRate.toFixed(1)}%`}
              icon={AlertCircle}
            />
          </motion.div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Signal Trend */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-white/10 rounded-xl p-6"
          >
            <h3 className="font-semibold mb-6">Signal Trend (7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1d24', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="signals" stroke="#3f51ff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Success vs Failed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-white/10 rounded-xl p-6"
          >
            <h3 className="font-semibold mb-6">Success vs Failed</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1d24', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="success" fill="#0be881" />
                <Bar dataKey="failed" fill="#ff3f34" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-white/10 rounded-xl p-6 mt-6"
        >
          <h3 className="font-semibold mb-4">Recent Signals</h3>
          <div className="space-y-3">
            {signals.slice(0, 5).map((signal, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 bg-dark-900/50 rounded-lg hover:bg-dark-900 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-2 h-2 rounded-full ${signal.side === 'long' ? 'bg-success' : 'bg-danger'}`} />
                  <div>
                    <p className="font-semibold">{signal.symbol}</p>
                    <p className="text-xs text-gray-500">{new Date(signal.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{signal.size}{signal.size_type === 'percent' ? '%' : 'USD'}</p>
                  <p className={`text-xs ${signal.side === 'long' ? 'text-success' : 'text-danger'}`}>
                    {signal.side.toUpperCase()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
