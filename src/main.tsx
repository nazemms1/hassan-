import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const goatCounterEndpoint = import.meta.env.VITE_GOATCOUNTER_ENDPOINT

if (goatCounterEndpoint) {
  const analyticsScript = document.createElement('script')
  analyticsScript.defer = true
  analyticsScript.async = true
  analyticsScript.src = '//gc.zgo.at/count.js'
  analyticsScript.dataset.goatcounter = goatCounterEndpoint
  document.head.appendChild(analyticsScript)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
