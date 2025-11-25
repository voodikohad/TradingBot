import { create } from 'zustand'
import apiService from '../services/api'

export const useStore = create((set, get) => ({
  settings: {
    webhookSecret: '',
    telegramToken: '',
    cornixChatId: '',
    serverUrl: 'http://localhost:3000',
  },
  signals: [],
  logs: [],
  systemStatus: {
    server: 'online',
    telegram: 'connecting',
    cornix: 'unknown',
    webhook: 'ready',
  },
  stats: {
    totalSignals: 0,
    todaySignals: 0,
    successRate: 0,
    errors24h: 0,
  },

  // Fetch data from API
  fetchSignals: async () => {
    const signals = await apiService.fetchSignals();
    set({ signals });
  },

  fetchLogs: async () => {
    const logs = await apiService.fetchLogs();
    set({ logs });
  },

  fetchStats: async () => {
    const stats = await apiService.fetchStats();
    set({ stats });
  },

  fetchSystemStatus: async () => {
    const status = await apiService.fetchSystemStatus();
    set({ systemStatus: status });
  },

  // Initialize - fetch all data
  initialize: async () => {
    const store = get();
    await Promise.all([
      store.fetchSignals(),
      store.fetchLogs(),
      store.fetchStats(),
      store.fetchSystemStatus()
    ]);
  },

  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),
  addSignal: (signal) => set((state) => ({
    signals: [signal, ...state.signals].slice(0, 100)
  })),
  addLog: (log) => set((state) => ({
    logs: [log, ...state.logs].slice(0, 1000)
  })),
  updateSystemStatus: (status) => set((state) => ({
    systemStatus: { ...state.systemStatus, ...status }
  })),
  updateStats: (newStats) => set((state) => ({
    stats: { ...state.stats, ...newStats }
  })),
  clearLogs: () => set({ logs: [] }),
}))
