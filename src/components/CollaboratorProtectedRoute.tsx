
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCollaboratorAuth } from '../contexts/CollaboratorAuthContext';

interface CollaboratorProtectedRouteProps {
  children: React.ReactNode;
}

const CollaboratorProtectedRoute: React.FC<CollaboratorProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useCollaboratorAuth();

  if (isLoading) {
    // You might want to show a loading spinner here
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/colaborador/login" replace />;
  }

  return <>{children}</>;
};

export default CollaboratorProtectedRoute;
