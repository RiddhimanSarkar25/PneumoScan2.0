import React, { useState } from 'react';
import { AuthService } from '../services/mockDatabase';
import { User } from '../types';
import { ShieldPlus, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(async () => {
      const user = await AuthService.login(username);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials. Try "admin" or "radio".');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-medical-700 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4 backdrop-blur-sm">
            <ShieldPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">PneumoScan AI</h1>
          <p className="text-medical-100">Secure Medical Diagnostic Portal</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none transition-all"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none transition-all"
                placeholder="Enter password"
                required
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-medical-600 hover:bg-medical-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70"
            >
              <span>{loading ? 'Authenticating...' : 'Secure Login'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
             <p>Use <strong>admin/admin</strong> or <strong>radio/radio</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;