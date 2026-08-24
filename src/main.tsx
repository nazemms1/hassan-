import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const cookieMaxAge = 60 * 60 * 24 * 365

function readCookie(name: string) {
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`))

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : undefined
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${cookieMaxAge}; Path=/; SameSite=Lax`
}

const visitorId = readCookie('hassan_visitor_id') ?? crypto.randomUUID()
const visitTime = new Date().toISOString()

writeCookie('hassan_visitor_id', visitorId)
writeCookie('hassan_first_visit', readCookie('hassan_first_visit') ?? visitTime)
writeCookie('hassan_last_visit', visitTime)

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
