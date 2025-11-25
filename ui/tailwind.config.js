module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#0f1115',
        },
        'card': '#1a1d24',
        'accent': '#3f51ff',
        'success': '#0be881',
        'danger': '#ff3f34',
        'warning': '#ffa801',
      },
      fontFamily: {
        'sans': ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 30px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(63, 81, 255, 0.3)',
        'success': '0 0 20px rgba(11, 232, 129, 0.2)',
        'danger': '0 0 20px rgba(255, 63, 52, 0.2)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(63, 81, 255, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(63, 81, 255, 0)' },
        },
        'slide-in': {
          'from': { transform: 'translateX(-10px)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
