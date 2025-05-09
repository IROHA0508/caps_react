// App.js
import { useEffect, useState } from 'react';
import Splash from './Splash';
import LiaPage from './LiaPage';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return showSplash ? <Splash /> : <LiaPage />;
}

export default App;
