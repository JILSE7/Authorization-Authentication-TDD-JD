import React, { useContext } from 'react';

import './App.css';
import { Login } from './views';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './context/AuthProvider';

function App() {

  return (
    <AuthProvider>
      <AppRouter/>
    </AuthProvider>
  );
}

export default App;
