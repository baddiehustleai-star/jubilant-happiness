import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Subscription from './pages/Subscription.jsx';
import UploadDemo from './pages/UploadDemo.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/upload" element={<UploadDemo />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
