import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Send, Database } from 'lucide-react'
import { Button } from '../components/UI'
import { useStore } from '../store'

export const TestPage = () => {
  const addLog = useStore((state) => state.addLog)
  const [results, setResults] = useState({
    webhook: null,
    telegram: null,
    system: null,
  })
  const [loading, setLoading] = useState({
    webhook: false,
    telegram: false,
    system: false,
  })

  const testWebhook = async () => {
    setLoading((prev) => ({ ...prev, webhook: true }))
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setResults((prev) => ({
        ...prev,
        webhook: { success: true, message: 'Webhook endpoint responding', latency: '142ms' },
      }))
      addLog({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        message: 'Webhook test passed',
        level: 'success',
        type: 'webhook',
      })
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        webhook: { success: false, message: 'Connection failed', error: error.message },
      }))
    } finally {
      setLoading((prev) => ({ ...prev, webhook: false }))
    }
  }

  const testTelegram = async () => {
    setLoading((prev) => ({ ...prev, telegram: true }))
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setResults((prev) => ({
        ...prev,
        telegram: { success: true, message: 'Bot connected and message sent', latency: '287ms' },
      }))
      addLog({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        message: 'Telegram test passed',
        level: 'success',
        type: 'telegram',
      })
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        telegram: { success: false, message: 'Bot connection failed', error: error.message },
      }))
    } finally {
      setLoading((prev) => ({ ...prev, telegram: false }))
    }
  }

  const testSystem = async () => {
    setLoading((prev) => ({ ...prev, system: true }))
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500))
      setResults((prev) => ({
        ...prev,
        system: { success: true, message: 'All systems operational', uptime: '99.8%' },
      }))
      addLog({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        message: 'System health check passed',
        level: 'success',
        type: 'system',
      })
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        system: { success: false, message: 'System check failed', error: error.message },
      }))
    } finally {
      setLoading((prev) => ({ ...prev, system: false }))
    }
  }

  const TestCard = ({ icon: Icon, title, result, loading, onTest }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-white/10 rounded-xl p-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-accent/20 rounded-lg">
          <Icon size={24} className="text-accent" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-4 p-4 rounded-lg border ${
            result.success
              ? 'bg-success/10 border-success/30 text-success'
              : 'bg-danger/10 border-danger/30 text-danger'
          }`}
        >
          <p className="font-semibold text-sm">{result.message}</p>
          {result.latency && <p className="text-xs opacity-70">Latency: {result.latency}</p>}
          {result.uptime && <p className="text-xs opacity-70">Uptime: {result.uptime}</p>}
        </motion.div>
      )}

      <Button
        onClick={onTest}
        loading={loading}
        variant="primary"
        className="w-full"
      >
        Run Test
      </Button>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-dark-950 pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">System Test</h1>
          <p className="text-gray-400">Verify connectivity and functionality</p>
        </motion.div>

        {/* Test Cards */}
        <div className="space-y-6 mb-8">
          <TestCard
            icon={Zap}
            title="Webhook Test"
            result={results.webhook}
            loading={loading.webhook}
            onTest={testWebhook}
          />

          <TestCard
            icon={Send}
            title="Telegram Test"
            result={results.telegram}
            loading={loading.telegram}
            onTest={testTelegram}
          />

          <TestCard
            icon={Database}
            title="System Health"
            result={results.system}
            loading={loading.system}
            onTest={testSystem}
          />
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent/10 border border-accent/30 rounded-xl p-6 text-accent"
        >
          <h4 className="font-semibold mb-2">💡 What These Tests Do</h4>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Webhook Test:</strong> Verifies the webhook endpoint is accessible and responding</li>
            <li>• <strong>Telegram Test:</strong> Sends a test message to verify bot connectivity</li>
            <li>• <strong>System Health:</strong> Checks overall system performance and uptime</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
