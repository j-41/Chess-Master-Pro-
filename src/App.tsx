import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Sidebar from './components/Layout/Sidebar';
import HomePage from './pages/HomePage';
import PlayPage from './pages/PlayPage';
import GamePage from './pages/GamePage';
import PuzzlePage from './pages/PuzzlePage';
import AnalysisPage from './pages/AnalysisPage';
import SettingsPage from './pages/SettingsPage';
// Placeholder for login until we build it fully
const LoginPage = () => <div style={{padding: '40px', textAlign: 'center'}}><h2>Login/Register</h2><p>Functionality available in AuthContext. UI coming soon.</p><button onClick={() => window.history.back()}>Go Back</button></div>;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <div className="app-layout">
            <Sidebar />
            <div className="app-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/play" element={<PlayPage />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/puzzles" element={<PuzzlePage />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
