import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Dev-only: làm sạch console khỏi log Vite/React DevTools nếu bạn muốn.
// Bật/tắt bằng: localStorage.setItem('QUIET_CONSOLE', '1' | '0')
if (import.meta.env.DEV && typeof window !== 'undefined') {
  const quiet = window.localStorage?.getItem('QUIET_CONSOLE') === '1'
  if (quiet) {
    const originalInfo = console.info
    const originalLog = console.log
    const originalWarn = console.warn

    const shouldSuppress = (args) => {
      const text = args.map((a) => String(a ?? '')).join(' ')
      return (
        text.includes('[vite] connecting') ||
        text.includes('[vite] connected') ||
        text.includes('Download the React DevTools')
      )
    }

    console.info = (...args) => (shouldSuppress(args) ? undefined : originalInfo(...args))
    console.log = (...args) => (shouldSuppress(args) ? undefined : originalLog(...args))
    console.warn = (...args) => (shouldSuppress(args) ? undefined : originalWarn(...args))
  }
}

export function Root() {
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
