import axios from 'axios';

const API_URL = 'http://localhost:2025/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add response interceptor to handle session errors
api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
  

// Auth APIs
export const login = (username, password) => api.post('/auth/login', { name: username, password });
export const logout = () => api.post('/auth/logout');

// Data APIs
export const getAllEmployees = () => api.get('/employees');
export const getAllDepartments = () => api.get('/departments');
export const getAllSalaries = () => api.get('/salaries');
export const addEmployee = (employeeData) => api.post('/employees', employeeData);
export const updateSalary = (salaryData) => api.put('/salaries/update', salaryData);

export { api };