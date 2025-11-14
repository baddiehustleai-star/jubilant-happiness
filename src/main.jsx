import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import Landing from './pages/Landing.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Landing />
    <Analytics />
  </React.StrictMode>
);
