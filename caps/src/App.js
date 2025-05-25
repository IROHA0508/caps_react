// App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import Splash from './Splash';
import Onboarding from './Onboarding';
import LiaPage from './LiaPage';

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
