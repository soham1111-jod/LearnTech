
import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


function AdminLoginPage() {
  const [tokenInput, setTokenInput] = useState('');
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const handleTokenSubmit = (e) => {

    e.preventDefault();
    if (tokenInput === import.meta.env.VITE_ADMIN_TOKEN) {
      localStorage.setItem("Login", true);
      setAuthError('');
      navigate('/admin/projects');
    } else {
      setAuthError("Token Invalid.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-4">
      <div className="max-w-md w-full p-8 bg-white/90 rounded-2xl shadow-2xl flex flex-col items-center animate-fade-in">
        <FaLock className="text-4xl text-indigo-500 mb-2" />
        <h1 className="text-2xl font-bold mb-4">Admin Panel Login</h1>
        <form onSubmit={handleTokenSubmit} className="w-full">
          <label htmlFor="admin-token" className="block font-medium mb-2">Enter Admin Token</label>
          <input
            id="admin-token"
            type="password"
            value={tokenInput}
            onChange={e => setTokenInput(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            autoFocus
            required
          />
          {authError && <div className="text-red-600 mb-2" role="alert">{authError}</div>}
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full font-semibold hover:bg-indigo-700 transition">Login</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
