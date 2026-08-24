import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './component/layout/Layout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AssetsPage from './pages/AssetsPage';
import RequestsPage from './pages/RequestsPage';
import AssignmentsPage from './pages/AssignmentsPage';
import ReportsPage from './pages/ReportsPage';

// Components
import AssetCreate from './component/assets/AssetCreate';
import AssetEdit from './component/assets/AssetEdit';
import RequestCreate from './component/requests/RequestCreate';
import RequestDetails from './component/requests/RequestDetails';
import AssignmentForm from './component/assignments/AssignmentForm';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/assets"
        element={
          <PrivateRoute>
            <Layout>
              <AssetsPage />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/assets/create"
        element={
          <PrivateRoute>
            <Layout>
              <AssetCreate />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/assets/:id/edit"
        element={
          <PrivateRoute>
            <Layout>
              <AssetEdit />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/requests"
        element={
          <PrivateRoute>
            <Layout>
              <RequestsPage />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/requests/create"
        element={
          <PrivateRoute>
            <Layout>
              <RequestCreate />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/requests/:id"
        element={
          <PrivateRoute>
            <Layout>
              <RequestDetails />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/assignments"
        element={
          <PrivateRoute>
            <Layout>
              <AssignmentsPage />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/assignments/create"
        element={
          <PrivateRoute>
            <Layout>
              <AssignmentForm />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/assignments/:assetId/edit"
        element={
          <PrivateRoute>
            <Layout>
              <AssignmentForm />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <Layout>
              <ReportsPage />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;