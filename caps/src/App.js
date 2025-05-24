import { useEffect, useState } from 'react';
import Splash from './Splash';
import Onboarding from './Onboarding';
import LiaPage from './LiaPage';

function App() {
  const [step, setStep] = useState('splash'); // splash, onboarding, main

  useEffect(() => {
    const timer = setTimeout(() => {
      const user = localStorage.getItem('user');
      setStep(user ? 'main' : 'onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (step === 'splash') return <Splash />;
  if (step === 'onboarding') return <Onboarding onComplete={() => setStep('main')} />;
  return <LiaPage />;
}

export default App;
