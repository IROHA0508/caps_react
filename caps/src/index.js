// index.js
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Splash from './pages/Splash/Splash';
import Onboarding from './pages/Onboarding/Onboarding';
import MainPage from './pages/MainPage/MainPage';
import RoutinePage from './pages/RoutinePage/RoutinePage';
import ReportPage from './pages/ReportPage/ReportPage';
import PopupCallback from './pages/PopupCallback';
import Live2DPage from './pages/Live2DPage/Live2DPage';
import HologramPage from './pages/HologramPage/HologramPage';

import ProtectedRoute from './component/ProtectedRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            }
          />

          <Route path="/main/routine" element={<RoutinePage />} />
          <Route path="/main/report" element={<ReportPage />} />
          <Route path="/live2d" element={<Live2DPage />} />
          <Route path="/hologram" element={<HologramPage />} />

          <Route path="/popup/callback" element={<PopupCallback />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
