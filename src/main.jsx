import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

console.log(
  "%c hey, you found it. hire me? → brtchigy@gmail.com",
  "color: #c8322a; font-family: serif; font-size: 16px; font-style: italic; padding: 4px 0;"
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)