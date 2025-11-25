import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import { Input, Button, Toggle } from '../components/UI'
import { Copy, Check } from 'lucide-react'

export const SettingsPage = () => {
  const settings = useStore((state) => state.settings)
  const updateSettings = useStore((state) => state.updateSettings)
  const [copied, setCopied] = useState(null)
  const [formData, setFormData] = useState(settings)
  const [saved, setSaved] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    updateSettings(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">Configure your automation system</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Webhook Configuration */}
          <motion.div variants={itemVariants} className="bg-card border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">🔗 Webhook Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Server URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.serverUrl}
                    onChange={(e) => handleChange('serverUrl', e.target.value)}
                    className="flex-1 bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    onClick={() => copyToClipboard(formData.serverUrl, 'server')}
                    className="px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    {copied === 'server' ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Webhook Secret</label>
                <p className="text-xs text-gray-500 mb-2">Keep this secure and never share it</p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={formData.webhookSecret}
                    onChange={(e) => handleChange('webhookSecret', e.target.value)}
                    className="flex-1 bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    onClick={() => copyToClipboard(formData.webhookSecret, 'webhook')}
                    className="px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    {copied === 'webhook' ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Telegram Configuration */}
          <motion.div variants={itemVariants} className="bg-card border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">📱 Telegram Bot Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bot Token</label>
                <p className="text-xs text-gray-500 mb-2">From @BotFather on Telegram</p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={formData.telegramToken}
                    onChange={(e) => handleChange('telegramToken', e.target.value)}
                    className="flex-1 bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    onClick={() => copyToClipboard(formData.telegramToken, 'telegram')}
                    className="px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    {copied === 'telegram' ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cornix Chat ID</label>
                <p className="text-xs text-gray-500 mb-2">Group or channel ID where Cornix is active</p>
                <input
                  type="text"
                  value={formData.cornixChatId}
                  onChange={(e) => handleChange('cornixChatId', e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          </motion.div>

          {/* Additional Settings */}
          <motion.div variants={itemVariants} className="bg-card border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">⚙️ Additional Settings</h2>
            <div className="space-y-4">
              <Toggle
                checked={true}
                onChange={(val) => console.log('Auto-retry:', val)}
                label="Enable Auto-Retry on Failure"
              />
              <Toggle
                checked={true}
                onChange={(val) => console.log('Notifications:', val)}
                label="System Notifications"
              />
              <Toggle
                checked={false}
                onChange={(val) => console.log('Maintenance:', val)}
                label="Maintenance Mode"
              />
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div variants={itemVariants} className="flex justify-end gap-3">
            {saved && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-success text-sm flex items-center gap-2"
              >
                <Check size={18} />
                Settings saved successfully
              </motion.div>
            )}
            <Button
              onClick={handleSave}
              className="sticky bottom-6"
            >
              Save Settings
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
