import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { getUser, removeUser } from '../../utils/mockAuth';

const AuthenticatedHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = getUser();

  const getRoleDisplay = (role) => {
    const roleMap = {
      laborer: 'Laborer',
      foreman: 'Foreman',
      owner: 'Owner',
    };
    return roleMap?.[role] || 'User';
  };

  const getDashboardPath = (role) => {
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

  const isCurrentPath = (path) => {
    return location?.pathname === path;
  };

  const dashboardPath = getDashboardPath(user?.role);

  return (
    <header className="fixed top-0 left-0 right-0 z-sticky bg-card shadow-elevation-2 transition-smooth">
      <div className="h-[60px] px-5 flex items-center justify-between lg:h-[60px] lg:px-8">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(dashboardPath)}
            className="flex items-center gap-3 hover-lift transition-smooth focus-ring rounded-md"
            aria-label="Go to dashboard"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center transition-smooth">
              <Icon name="HardHat" size={24} color="var(--color-primary)" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground leading-none">
                LaborTrack
              </h1>
              <p className="caption text-muted-foreground text-xs mt-0.5">
                Construction Management
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-muted rounded-lg">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="var(--color-primary)" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground leading-none">
                {user?.name || 'User'}
              </p>
              <p className="caption text-muted-foreground text-xs mt-0.5">
                {getRoleDisplay(user?.role)}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth focus-ring"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
            >
              <Icon name={isMenuOpen ? 'X' : 'Menu'} size={20} />
            </button>

            <Button
              variant="outline"
              size="default"
              iconName="LogOut"
              iconPosition="left"
              onClick={handleLogout}
              className="hidden md:flex"
            >
              Logout
            </Button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-dropdown bg-background"
                  onClick={() => setIsMenuOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 top-12 w-64 bg-card rounded-lg shadow-elevation-4 z-dropdown overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Icon
                          name="User"
                          size={20}
                          color="var(--color-primary)"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {user?.name || 'User'}
                        </p>
                        <p className="caption text-muted-foreground text-xs">
                          {getRoleDisplay(user?.role)}
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
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-smooth hover:bg-muted ${
                        isCurrentPath(dashboardPath)
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground'
                      }`}
                    >
                      <Icon name="LayoutDashboard" size={18} />
                      <span className="text-sm font-medium">Dashboard</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-md transition-smooth hover:bg-destructive/10 text-destructive mt-1"
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
