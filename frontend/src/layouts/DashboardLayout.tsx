import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { HeartHandshake, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navItems = React.useMemo(
    () =>
      [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/log-act', label: 'Log Act' },
        { to: '/my-acts', label: 'Your Acts' },
        { to: '/community', label: 'Community' },
        { to: '/leaderboard', label: 'Leaderboard' },
        { to: '/recovery-track-info', label: 'Recovery Track' },
        { to: '/settings', label: 'Settings' },
        ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
      ],
    [user?.role]
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-purple-300 font-bold text-xl">
            <HeartHandshake className="w-6 h-6" /> Supriety™ Kindness
          </Link>
          <button className="md:hidden" onClick={() => setOpen((prev) => !prev)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <nav className="hidden md:flex gap-6 text-sm uppercase tracking-wide">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `hover:text-purple-300 transition ${isActive ? 'text-purple-300 font-semibold' : 'text-gray-300'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3 text-sm">
            <span className="text-gray-300">{user?.full_name || user?.username}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded bg-purple-500 hover:bg-purple-400 text-white"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
        {open && (
          <nav className="md:hidden px-4 pb-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded ${isActive ? 'bg-purple-500 text-white' : 'bg-slate-800 text-gray-200'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-purple-500 text-white"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </nav>
        )}
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
