import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './auth/Login';
import Dashboard from './Dashboard';
import AllEmployees from './pages/AllEmployees';
import AllDepartments from './pages/AllDepartments';
import AllSalaries from './pages/AllSalaries';
import UpdateSalary from './pages/UpdateSalary';
import { AuthProvider, DataProvider, useAuth } from './context/AllContext';
import AllReports from './pages/AllReports';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (for login page)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="all-employees" replace />} />
              <Route path="all-employees" element={<AllEmployees />} />
              <Route path="all-departments" element={<AllDepartments />} />
              <Route path="all-salaries" element={<AllSalaries />} />
              <Route path="update-salary" element={<UpdateSalary />} />
              <Route path="all-reports" element={<AllReports />} />
              <Route path="*" element={<Navigate to="all-employees" replace />} />
            </Route>
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
