/**
 * Cloudflare Worker - Telegram API Proxy
 * 
 * This worker acts as a proxy between your Koyeb backend and Telegram API.
 * It allows your app to bypass network restrictions that block api.telegram.org
 * 
 * DEPLOYMENT STEPS:
 * 1. Go to https://workers.cloudflare.com
 * 2. Sign up for free account
 * 3. Click "Create a Service"
 * 4. Name it: telegram-proxy
 * 5. Click "Quick Edit"
 * 6. Paste this entire code
 * 7. Click "Save and Deploy"
 * 8. Copy your worker URL: https://telegram-proxy.YOUR_USERNAME.workers.dev
 * 
 * BACKEND CONFIGURATION:
 * Add this environment variable to your Koyeb app:
 * TELEGRAM_API_PROXY=https://telegram-proxy.YOUR_USERNAME.workers.dev
 * 
 * That's it! Your Telegram messages will now flow through Cloudflare.
 */

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    try {
      const url = new URL(request.url);
      
      // Extract the path (e.g., /bot123456:ABC/sendMessage)
      const telegramPath = url.pathname;
      
      // Build the actual Telegram API URL
      const telegramUrl = `https://api.telegram.org${telegramPath}${url.search}`;
      
      console.log(`Proxying: ${request.method} ${telegramUrl}`);
      
      // Forward the request to Telegram
      const telegramRequest = new Request(telegramUrl, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'TradingBot-Proxy/1.0',
        },
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      });
      
      // Get response from Telegram
      const telegramResponse = await fetch(telegramRequest);
      
      // Clone the response
      const responseBody = await telegramResponse.text();
      
      // Return with CORS headers
      return new Response(responseBody, {
        status: telegramResponse.status,
        statusText: telegramResponse.statusText,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Cache-Control': 'no-cache',
        },
      });
      
    } catch (error) {
      console.error('Proxy error:', error);
      
      return new Response(JSON.stringify({
        ok: false,
        error: 'Proxy error',
        message: error.message,
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
