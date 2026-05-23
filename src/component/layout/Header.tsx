import React from 'react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-white border-b border-gray-100 z-10">
      <div className="text-[#1E50FF] font-bold text-xl flex items-center gap-2">
        InteliPath
      </div>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <div className="text-sm font-medium text-gray-700 mr-4">
              Hello, {user?.name}
            </div>
            <Link to="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Button variant="primary" onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">Register</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
