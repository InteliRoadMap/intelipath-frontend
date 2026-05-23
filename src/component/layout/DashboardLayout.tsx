import React from 'react';
import { 
  LayoutDashboard, 
  GitBranch, 
  Cpu, 
  TrendingUp, 
  Briefcase, 
  HelpCircle, 
  LogOut,
  Settings,
  User
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Roadmap', path: '#', icon: GitBranch },
    { name: 'AI Mentor', path: '#', icon: Cpu },
    { name: 'Market Pulse', path: '#', icon: TrendingUp },
    { name: 'E-Portfolio', path: '#', icon: Briefcase },
  ];

  return (
    <div className="flex h-screen bg-white font-sans text-[#1A1F36]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#F8FAFF] border-r border-gray-100 flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100 bg-white">
          <div className="text-[#1E50FF] font-bold text-xl flex items-center gap-2">
            InteliPath
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-grow py-6 overflow-y-auto">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-100/50 text-[#1A1F36] border-r-2 border-[#1E50FF]' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <link.icon size={18} className={isActive ? 'text-[#1E50FF]' : 'text-gray-400'} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 space-y-3">
          <Link to="#" className="flex items-center gap-3 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">
            <HelpCircle size={18} className="text-gray-400" />
            Help Center
          </Link>
          <Link to="/" className="flex items-center gap-3 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">
            <LogOut size={18} className="text-gray-400" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-gray-100 flex items-center justify-end px-8 gap-4">
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Settings size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center border border-gray-200">
            {/* Placeholder for User Avatar */}
            <User size={20} className="text-[#1E50FF]" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow overflow-y-auto bg-white p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
