import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Googl~ 삭제
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Googl~ 삭제
  <GoogleOAuthProvider clientId="829026060536-f7dpc16930esthgnn97soleggvmv3o16.apps.googleusercontent.com">
    <React.StrictMode>
      <BrowserRouter> 
        <Routes>
          <Route path = "/" element={<App />} />

        </Routes>
      </BrowserRouter>, 
    </React.StrictMode>
  </GoogleOAuthProvider>
);
