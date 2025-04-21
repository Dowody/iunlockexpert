import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App'; // adjust path if needed
import './index.css'; // or any global CSS

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/iunlockexpert">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);