import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from '../components/LoginRegister';
import UserList from '../components/UserList';
import UserDetail from '../components/UserDetail';
import UserPhotos from '../components/UserPhotos';
import { useAuth } from '../contexts/AuthContext.jsx';

function AppRoutes() {
  const { isAuthenticated, handleLoginStateChange } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
          <Navigate to="/" replace /> : 
          <LoginRegister onLoginStateChange={handleLoginStateChange} />
        } 
      />
      <Route 
        path="/" 
        element={
          isAuthenticated ? <UserList /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/user/:userId" 
        element={
          isAuthenticated ? <UserDetail /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/photos/:userId" 
        element={
          isAuthenticated ? <UserPhotos /> : <Navigate to="/login" replace />
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes; 