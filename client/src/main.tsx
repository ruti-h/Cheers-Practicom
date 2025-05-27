import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="300837799563-knrc4dqeie5osqif56d6ofpg8tr93bc7.apps.googleusercontent.com">
    <StrictMode>
    
        <App />
    </StrictMode>
  </GoogleOAuthProvider>,
)
