import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { EUserRole } from '../../types/masterDashboard/global';
// Example: If you have a custom hook or context that returns the logged-in user

interface RoleGuardProps {
  allowedRoles: EUserRole[] | 'All';
  children: React.ReactNode;
  fallback?: React.ReactNode; // optional - to display if user not authorized
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallback = null, // default to null/hidden
}) => {
  // Grab the currently logged-in user from Redux, context, etc.
  const user = useSelector((state: RootState) => state.auth.user);

  // If user role is in the allowedRoles array, render children; otherwise, render fallback
  if (user && allowedRoles === 'All') {
    return <>{children}</>;
  } else if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default RoleGuard;
