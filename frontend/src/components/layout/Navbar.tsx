import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Heart, Users, Trophy, User, Settings, LogOut, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-dark">Supriety<span className="text-primary">™</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="flex items-center space-x-1 text-gray-dark hover:text-primary transition-colors">
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link to="/log-act" className="flex items-center space-x-1 text-gray-dark hover:text-primary transition-colors">
              <Heart className="w-5 h-5" />
              <span>Log Act</span>
            </Link>
            <Link to="/community" className="flex items-center space-x-1 text-gray-dark hover:text-primary transition-colors">
              <Users className="w-5 h-5" />
              <span>Community</span>
            </Link>
            <Link to="/leaderboard" className="flex items-center space-x-1 text-gray-dark hover:text-primary transition-colors">
              <Trophy className="w-5 h-5" />
              <span>Leaderboard</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user?.is_admin && (
              <Link to="/admin" className="flex items-center space-x-1 text-primary hover:text-primary-light transition-colors">
                <Shield className="w-5 h-5" />
                <span className="hidden md:inline">Admin</span>
              </Link>
            )}
            <Link to={`/profile/${user?.username}`} className="flex items-center space-x-1 text-gray-dark hover:text-primary transition-colors">
              <User className="w-5 h-5" />
              <span className="hidden md:inline">{user?.username}</span>
            </Link>
            <Link to="/settings" className="text-gray-dark hover:text-primary transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
            <button onClick={handleLogout} className="text-gray-dark hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          <Link to="/dashboard" className="flex flex-col items-center text-gray-dark hover:text-primary transition-colors">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/log-act" className="flex flex-col items-center text-gray-dark hover:text-primary transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-xs mt-1">Log</span>
          </Link>
          <Link to="/community" className="flex flex-col items-center text-gray-dark hover:text-primary transition-colors">
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">Feed</span>
          </Link>
          <Link to="/leaderboard" className="flex flex-col items-center text-gray-dark hover:text-primary transition-colors">
            <Trophy className="w-5 h-5" />
            <span className="text-xs mt-1">Leaders</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
