import { useEffect, useState } from 'react'

export const useWebSocket = (url) => {
  const [data, setData] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const ws = new WebSocket(url)
    
    ws.onopen = () => setConnected(true)
    ws.onmessage = (event) => setData(JSON.parse(event.data))
    ws.onclose = () => setConnected(false)

    return () => ws.close()
  }, [url])

  return { data, connected }
}

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = async (method, endpoint, data = null) => {
    setLoading(true)
    setError(null)
    try {
      const config = {
        method,
        headers: { 'Content-Type': 'application/json' },
      }
      if (data) config.body = JSON.stringify(data)

      const response = await fetch(`/api${endpoint}`, config)
      if (!response.ok) throw new Error(`API error: ${response.status}`)
      
      return await response.json()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { request, loading, error }
}
