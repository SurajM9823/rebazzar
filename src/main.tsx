import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // Import HashRouter
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter> {/* Use HashRouter instead of BrowserRouter */}
      <App />
    </HashRouter>
  </StrictMode>
);
