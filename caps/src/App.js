// App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash/Splash';
import Onboarding from './pages/Onboarding';
import LiaPage from './pages/LiaPage';

function App() {
  const user = localStorage.getItem('user');

  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        path="/main"
        element={user ? <LiaPage /> : <Navigate to="/onboarding" />}
      />
    </Routes>
  );
}

export default App;
