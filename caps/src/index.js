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

import ProtectedRoute from './component/ProtectedRoute';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="829026060536-f7dpc16930esthgnn97soleggvmv3o16.apps.googleusercontent.com">
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

        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
