import React from 'react';
import { User, Role } from '../types';
import { AuthService } from '../services/mockDatabase';
import { LogOut, Activity, UploadCloud, PieChart, ShieldPlus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, currentPage, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navbar */}
      <header className="bg-medical-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <ShieldPlus className="w-8 h-8 text-white" />
            <span className="text-xl font-bold tracking-tight">PneumoScan AI</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-1">
              <button 
                onClick={() => onNavigate('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'dashboard' ? 'bg-medical-800 text-white' : 'text-medical-100 hover:bg-medical-600'}`}
              >
                <div className="flex items-center space-x-2">
                  <PieChart className="w-4 h-4" />
                  <span>Dashboard</span>
                </div>
              </button>
              
              <button 
                onClick={() => onNavigate('upload')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'upload' ? 'bg-medical-800 text-white' : 'text-medical-100 hover:bg-medical-600'}`}
              >
                <div className="flex items-center space-x-2">
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload & Analyze</span>
                </div>
              </button>
            </nav>

            <div className="flex items-center space-x-4 border-l border-medical-600 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user.username}</p>
                <p className="text-xs text-medical-200">{user.role}</p>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 rounded-full hover:bg-medical-600 transition-colors text-medical-100 hover:text-white"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 PneumoScan AI Medical Systems. MVP Demo.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;