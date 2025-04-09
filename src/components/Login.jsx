import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';

const NetflixLogin = () => {
  const Navigate=useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [login, setlogin] = useState(false)
  
  useEffect(() => {
    // Clear success message after 3 seconds
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      const res = await fetch("https://movieadminpanel-8lmd.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.email, password: formData.password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      console.log(data);
      setSuccess("Login Successful");
      setlogin(true);
      setFormData({ email: '', password: '' });
      setError('');
  
      // 🟢 Redirect to dashboard
      // Login successful:
localStorage.setItem('isLoggedIn', true);


      Navigate("/dashboard");
  
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }
    
    // Call login function
    handleLogin(formData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black bg-opacity-90 p-4">
      {/* Background blur effect container */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black bg-opacity-50"></div>
      
      {/* Success toast notification */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 transition-opacity duration-300 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          {success}
        </div>
      )}
      
      {/* Login form card */}
      <div className="z-10 w-full max-w-md bg-black bg-opacity-75 p-8 rounded-lg shadow-lg border border-gray-800">
        <h1 className="text-white text-3xl font-bold mb-8">Login</h1>
        
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email or Username"
              className="w-full p-4 rounded bg-gray-700 bg-opacity-50 text-white border border-gray-600 focus:outline-none focus:border-gray-500"
            />
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-4 rounded bg-gray-700 bg-opacity-50 text-white border border-gray-600 focus:outline-none focus:border-gray-500"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded bg-red-600 hover:bg-red-700 text-white font-medium transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Loading...' : 'Get Access'}
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input 
                id="remember-me" 
                type="checkbox" 
                className="h-4 w-4 bg-gray-700 border-gray-600 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-400">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-gray-400 hover:underline">
              Need help?
            </a>
          </div>
        </form>
        
        <div className="mt-8">
          <p className="text-gray-500">
            New to MoodFLix? <a href="#" className="text-white hover:underline">Contact Moodflix</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NetflixLogin;