import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Messages from './pages/Messages';
import Campaigns from './pages/Campaigns';
import Templates from './pages/Templates';
import FlowBuilder from './pages/FlowBuilder';
import Settings from './pages/Settings';
import APIDocumentation from './pages/APIDocumentation';
import AdminPanel from './pages/AdminPanel';
import Signup from './pages/Auth/Signup';
import Retargeting from './pages/Retargeting';
import PlansManager from './pages/admin/PlansManager';
import UsersManager from './pages/admin/UsersManager';
import { useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <SocketProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
          <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
          <Route path="/flows" element={<ProtectedRoute><FlowBuilder /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/api-docs" element={<ProtectedRoute><APIDocumentation /></ProtectedRoute>} />
          <Route path="/retargeting" element={<ProtectedRoute><Retargeting /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requiredRole={['ADMIN', 'SUPER_ADMIN']}><AdminPanel /></ProtectedRoute>} />
          <Route path="/admin/plans" element={<ProtectedRoute requiredRole={['ADMIN', 'SUPER_ADMIN']}><PlansManager /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requiredRole={['ADMIN', 'SUPER_ADMIN']}><UsersManager /></ProtectedRoute>} />
        </Routes>
      </div>
    </SocketProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;