import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UploadAnalyze from './components/UploadAnalyze';
import { AuthService } from './services/mockDatabase';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setPage('dashboard');
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  if (loading) return null;

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      currentPage={page}
      onNavigate={setPage}
    >
      {page === 'dashboard' && <Dashboard />}
      {page === 'upload' && <UploadAnalyze />}
    </Layout>
  );
};

export default App;