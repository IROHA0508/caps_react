// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Splash from './pages/Splash/Splash';
import Onboarding from './pages/Onboarding/Onboarding';
import MainPage from './pages/MainPage/MainPage';
import ProtectedRoute from './component/ProtectedRoute'; // ⬅️ 추가

import './index.css';

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
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
