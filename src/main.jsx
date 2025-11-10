import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Landing from './pages/Landing.jsx';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Landing />
    <Toaster position="bottom-right" />
  </React.StrictMode>
);
