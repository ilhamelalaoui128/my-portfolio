import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ToastProvider } from './components/Toast'
import { applyThemeClass, readStoredTheme } from './hooks/useTheme'
import './index.css'

applyThemeClass(readStoredTheme())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
)
