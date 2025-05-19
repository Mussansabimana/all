import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { 
    login as apiLogin, 
    logout as apiLogout, 
    getAllEmployees,
    getAllDepartments,
    getAllSalaries,
    addEmployee as apiAddEmployee
} from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Create separate contexts
const AuthContext = createContext(null);
const DataContext = createContext(null);

// Auth Provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (!savedUser || savedUser === 'undefined') return null;
      return JSON.parse(savedUser);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user'); // Clean up invalid data
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (username, password) => {
    setLoading(true);
    try {
      const response = await apiLogin(username, password);
      if (response.data.status) {
        const userData = response.data.data;
        setUser(userData);
        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/dashboard');
      }
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
      setUser(null);
      // Remove user from localStorage
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    handleLogin, 
    handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Data Provider component
const DataProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState({
    employees: false,
    departments: false,
    salaries: false,
    reports: false,
    addingEmployee: false
  });
  const { user } = useAuth();

  const fetchEmployees = useCallback(async () => {
    if (!user) return;
    setLoading(prev => ({ ...prev, employees: true }));
    try {
      const response = await getAllEmployees();
      if (response.data.status) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(prev => ({ ...prev, employees: false }));
    }
  }, [user]);

  const fetchDepartments = useCallback(async () => {
    if (!user) return;
    setLoading(prev => ({ ...prev, departments: true }));
    try {
      const response = await getAllDepartments();
      if (response.data.status) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(prev => ({ ...prev, departments: false }));
    }
  }, [user]);

  const fetchSalaries = useCallback(async () => {
    if (!user) return;
    setLoading(prev => ({ ...prev, salaries: true }));
    try {
      const response = await getAllSalaries();
      if (response.data.status) {
        setSalaries(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching salaries:', error);
    } finally {
      setLoading(prev => ({ ...prev, salaries: false }));
    }
  }, [user]);

  const fetchReports = useCallback(async () => {
    if (!user) return;
    setLoading(prev => ({ ...prev, reports: true }));
    try {
      const response = await axios.get('http://localhost:2025/api/reports', {
        withCredentials: true
      });

      if (response.data.status) {
        setReports(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(prev => ({ ...prev, reports: false }));
    }
  }, [user]);

  const addEmployee = useCallback(async (employeeData) => {
    if (!user) return { success: false, message: 'Not authenticated' };
    setLoading(prev => ({ ...prev, addingEmployee: true }));
    try {
      const response = await apiAddEmployee(employeeData);
      if (response.data.status) {
        await fetchEmployees(); // Refresh employees list
        return { success: true, data: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Error adding employee:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error adding employee'
      };
    } finally {
      setLoading(prev => ({ ...prev, addingEmployee: false }));
    }
  }, [user, fetchEmployees]);

  const fetchAllData = useCallback(async () => {
    if (!user) return;
    await Promise.all([
      fetchEmployees(),
      fetchDepartments(),
      fetchSalaries(),
      fetchReports()
    ]);
  }, [user, fetchEmployees, fetchDepartments, fetchSalaries, fetchReports]);

  // Fetch data when user is authenticated
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user, fetchAllData]);

  const value = {
    employees,
    departments,
    salaries,
    reports,
    loading,
    fetchAllData,
    fetchEmployees,
    fetchDepartments,
    fetchSalaries,
    fetchReports,
    addEmployee
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hooks to access contexts
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const useData = () => {
  const context = useContext(DataContext);
  if (context === null) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export { AuthProvider, DataProvider, useAuth, useData };