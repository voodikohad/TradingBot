/**
 * API Service for communicating with the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  async fetchSignals() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/signals`);
      const data = await response.json();
      return data.signals || [];
    } catch (error) {
      console.error('Error fetching signals:', error);
      return [];
    }
  }

  async fetchStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`);
      const data = await response.json();
      return data.stats || {
        totalSignals: 0,
        todaySignals: 0,
        successRate: 0,
        errors24h: 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalSignals: 0,
        todaySignals: 0,
        successRate: 0,
        errors24h: 0
      };
    }
  }

  async fetchLogs() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/logs`);
      const data = await response.json();
      return data.logs || [];
    } catch (error) {
      console.error('Error fetching logs:', error);
      return [];
    }
  }

  async fetchSystemStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/status`);
      const data = await response.json();
      return data.status || {
        server: 'offline',
        telegram: 'offline',
        webhook: 'offline'
      };
    } catch (error) {
      console.error('Error fetching system status:', error);
      return {
        server: 'offline',
        telegram: 'offline',
        webhook: 'offline'
      };
    }
  }

  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Error checking health:', error);
      return false;
    }
  }
}

export default new ApiService();
