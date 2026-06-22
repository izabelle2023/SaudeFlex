import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Configura a base da API (ajuste se rodando em outra porta)
if (typeof window !== 'undefined' && !window.__SAUDEFLEX_API_BASE__) {
  window.__SAUDEFLEX_API_BASE__ = 'http://localhost:4000'
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
