import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { WeatherProvider } from './context/WeatherContext';

function App() {
  return (
    <WeatherProvider>
      <div className="flex min-h-screen bg-secondary-900">
        <Sidebar />
        <Dashboard />
      </div>
    </WeatherProvider>
  );
}

export default App;