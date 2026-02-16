import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser, getDashboardRoute } from '../../utils/mockAuth';
import type { UserRole } from '../../types/auth.types';

const RoleGuard = ({ 
  allowedRoles = [] as UserRole[], 
  fallbackRoute = '/login',
  requireAuth = true,
  children
}: {
  allowedRoles?: UserRole[];
  fallbackRoute?: string;
  requireAuth?: boolean;
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getUser();

  useEffect(() => {
    if (requireAuth && !currentUser) {
      navigate(fallbackRoute, { 
        replace: true,
        state: { from: location?.pathname }
      });
      return;
    }

    if (currentUser && allowedRoles?.length > 0) {
      const hasPermission = allowedRoles?.includes(currentUser?.role as UserRole);
      
      if (!hasPermission) {
        const redirectPath = getDashboardRoute(currentUser?.role);
        navigate(redirectPath, { replace: true });
      }
    }
  }, [currentUser, allowedRoles, navigate, location, fallbackRoute, requireAuth]);

  if (requireAuth && !currentUser) {
    return null;
  }

  if (currentUser && allowedRoles?.length > 0) {
    const hasPermission = allowedRoles?.includes(currentUser?.role as UserRole);
    if (!hasPermission) {
      return null;
    }
  }

  return <>{children}</>;
};

export default RoleGuard;