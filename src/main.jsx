import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { HistoryProvider } from './context/HistoryContext'
import { ReviewProvider } from './context/ReviewContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <HistoryProvider>
        <ReviewProvider>
          <CartProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </CartProvider>
        </ReviewProvider>
      </HistoryProvider>
    </AuthProvider>
  </StrictMode>,
)
