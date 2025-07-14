import React, { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

function AdminLoginPage() {
  const [tokenInput, setTokenInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (tokenInput === import.meta.env.VITE_ADMIN_TOKEN) {
      localStorage.setItem("Login", import.meta.env.VITE_ADMIN_TOKEN);
      setAuthError('');
      navigate('/admin/projects');
    } else {
      setAuthError("Token Invalid.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-4">
      <Helmet>
        <title>Admin Login</title>
      </Helmet>
      <div className="max-w-md w-full p-8 sm:p-12 bg-white/90 rounded-2xl shadow-2xl flex flex-col items-center animate-fade-in transition-transform transform hover:scale-105">
        <FaLock className="text-4xl text-indigo-500 mb-2" />
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Panel Login</h1>
        <form onSubmit={handleTokenSubmit} className="w-full relative">
          <label htmlFor="admin-token" className="block font-medium mb-2">
            Enter Admin Token
          </label>
          <div className="relative w-full mb-4">
            <input
              id="admin-token"
              type={showPassword ? "text" : "password"}
              value={tokenInput}
              onChange={e => setTokenInput(e.target.value)}
              className="w-full border rounded-lg p-2 pr-10 text-sm focus-visible:ring-2 focus-visible:ring-indigo-400 outline-none transition"
              autoFocus
              required
              aria-describedby={authError ? "error-msg" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-indigo-500 hover:text-indigo-700"
              aria-label={showPassword ? "Hide token" : "Show token"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {authError && (
            <div id="error-msg" className="text-red-600 mb-2" role="alert">
              {authError}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`bg-indigo-600 text-white px-4 py-3 rounded-lg w-full font-semibold hover:bg-indigo-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
