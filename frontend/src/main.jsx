import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

export function mount(element, config = {}) {
  if (!element) {
    throw new Error('Programming Assessment mount element not found')
  }

  const root = createRoot(element)

  root.render(
    <StrictMode>
      <div className="programming-assessment-root">
        <App config={config} />
      </div>
    </StrictMode>
  )

  return () => root.unmount()
}
