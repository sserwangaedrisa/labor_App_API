import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './AppIconl';
import Button from './Button';
import { getUser, removeUser } from '../../utils/mockAuth';
import type { UserRole } from '../../types/auth.types';

const AuthenticatedHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = getUser();

  const getRoleDisplay = (role: UserRole) => {
    const roleMap = {
      laborer: 'Laborer',
      foreman: 'Foreman',
      owner: 'Owner',
    };
    return roleMap?.[role] || 'User';
  };

  const getDashboardPath = (role: UserRole) => {
    const pathMap = {
      laborer: '/laborer-dashboard',
      foreman: '/foreman-dashboard',
      owner: '/owner-dashboard',
    };
    return pathMap?.[role] || '/login';
  };

  const handleLogout = () => {
    removeUser();
    navigate('/login');
  };

  const isCurrentPath = (path: string) => {
    return location?.pathname === path;
  };

  const dashboardPath = getDashboardPath(user?.role as UserRole);

  return (
<header className="fixed top-0 left-0 right-0 z-sticky 
  bg-gradient-to-r from-slate-900 via-slate-800 to-orange-400
  text-white backdrop-blur-md transition-all duration-300
  shadow-[0_8px_20px_rgba(0,0,0,0.35)]">


  <div className="h-[80px] px-5 flex items-center justify-between lg:px-8">
    
    <div className="flex items-center gap-6">
      <button
        onClick={() => navigate(dashboardPath)}
        className="flex items-center gap-3 hover:scale-[1.02] transition-all duration-200 focus:outline-none rounded-md"
        aria-label="Go to dashboard"
      >
        <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
          <Icon name="HardHat" size={24} color="#f97316" />
        </div>

        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold leading-none tracking-wide">
            LaborTrack
          </h1>
          <p className="text-xs text-white/70 mt-0.5">
            Construction Management
          </p>
        </div>
      </button>
    </div>

    <div className="flex items-center gap-4">
      
      <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
        <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
          <Icon name="User" size={16} color="#fb923c" />
        </div>

        <div className="text-sm">
          <p className="font-medium leading-none">
            {user?.username || 'User'}
          </p>
          <p className="text-xs text-white/70 mt-0.5">
            {getRoleDisplay(user?.role as UserRole)}
          </p>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all duration-200"
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
        >
          <Icon
            name={isMenuOpen ? 'X' : 'Menu'}
            size={20}
            color="white"
          />
        </button>

        <Button
          type="submit"
          onClick={handleLogout}
          className="hidden md:flex bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md"
        >
          Logout
        </Button>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-dropdown bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            <div className="absolute right-0 top-12 w-64 
              bg-slate-900 text-white rounded-xl shadow-2xl 
              border border-white/10 overflow-hidden z-dropdown">

              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} color="#fb923c" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {user?.username || 'User'}
                    </p>
                    <p className="text-xs text-white/70">
                      {getRoleDisplay(user?.role as UserRole)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={() => {
                    navigate(dashboardPath);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 hover:bg-white/10 ${
                    isCurrentPath(dashboardPath)
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'text-white'
                  }`}
                >
                  <Icon name="LayoutDashboard" size={18} />
                  <span className="text-sm font-medium">Dashboard</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 hover:bg-red-500/20 text-red-400 mt-1"
                >
                  <Icon name="LogOut" size={18} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
</header>
  );
};

export default AuthenticatedHeader;
