import React, { useState } from 'react';
import { useAuth } from '../context/AllContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await handleLogin(username, password);
      if (response.status === false) {
        toast.error(response.message || 'Login failed');
      } else {
        // If login is successful, navigate to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response) {
        // Handle specific error cases from the API
        switch (error.response.status) {
          case 400:
            toast.error('Please provide username and password');
            break;
          case 401:
            toast.error('Invalid username or password');
            break;
          case 500:
            toast.error('Server error. Please try again later');
            break;
          default:
            toast.error('An error occurred during login');
        }
      } else {
        toast.error('Network error. Please check your connection');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEAECA] to-[#94BBE9] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-xl animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
          <p className="text-center text-white/80">Login to EPMS Dashboard</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={submit}>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-pink-500 to-blue-500 text-white font-medium hover:from-pink-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center text-white/80 text-sm">
          Enter your credentials to access the dashboard
        </div>
      </div>
    </div>
  );
};

export default Login;
