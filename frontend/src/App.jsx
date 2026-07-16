import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <main>
          <Dashboard />
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
