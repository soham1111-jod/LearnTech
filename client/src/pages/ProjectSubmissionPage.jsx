import React, { useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const initialState = {
  title: '',
  description: '',
  tech_stack: '',
  github_url: '',
  demo_url: '',
  linkedin: '',
};
const API_URL = import.meta.env.VITE_API_URL;
function ProjectSubmissionPage() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.title || !form.description || !form.tech_stack || !form.github_url || !form.demo_url || !form.linkedin) {
      setError('All fields are required.');
      return false;
    }
    const urlPattern = /^https?:\/\//;
    if (!urlPattern.test(form.github_url) || !urlPattern.test(form.demo_url) || !urlPattern.test(form.linkedin)) {
      setError('Please enter valid URLs.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/projects/submit`, {
        ...form,
        tech_stack: form.tech_stack.split(',').map((t) => t.trim()),
      });
      setSuccess('Project submitted for review!');
      setForm(initialState);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Submission failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-10 animate-fade-in">
      <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-2xl p-8 border border-white/30">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 flex items-center justify-center bg-indigo-100 text-3xl rounded-full mb-3">
            🚀
          </div>
          <h1 className="text-2xl font-bold mb-2 text-gray-800">
            Submit Your Project
          </h1>
          <p className="text-gray-600 text-center">
            Share your work with the community! Your project will be reviewed by an admin before going live.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} aria-label="Project Submission Form" className="space-y-5">
          
          <div>
            <label htmlFor="title" className="block font-medium mb-1 text-gray-700">
              Title
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block font-medium mb-1 text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
          
          <div>
            <label htmlFor="tech_stack" className="block font-medium mb-1 text-gray-700">
              Tech Stack <span className="text-xs text-gray-500">(comma separated)</span>
            </label>
            <input
              id="tech_stack"
              name="tech_stack"
              value={form.tech_stack}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 transition"
              aria-describedby="techStackHelp"
            />
            <span id="techStackHelp" className="text-xs text-gray-500">
              e.g. React, Node.js, MongoDB
            </span>
          </div>

          {/* Links Section */}
          <h2 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Links</h2>
          
          <div>
            <label htmlFor="github_url" className="block font-medium mb-1 text-gray-700">
              GitHub URL
            </label>
            <input
              id="github_url"
              name="github_url"
              type="url"
              value={form.github_url}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          <div>
            <label htmlFor="demo_url" className="block font-medium mb-1 text-gray-700">
              Demo URL
            </label>
            <input
              id="demo_url"
              name="demo_url"
              type="url"
              value={form.demo_url}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          <div>
            <label htmlFor="linkedin" className="block font-medium mb-1 text-gray-700">
              LinkedIn Profile
            </label>
            <input
              id="linkedin"
              name="linkedin"
              type="url"
              value={form.linkedin}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="text-red-600 flex items-center gap-2 justify-center font-semibold animate-fade-in" role="alert">
              <FaExclamationCircle /> {error}
            </div>
          )}
          {success && (
            <div className="text-green-600 flex items-center gap-2 justify-center font-semibold animate-fade-in" role="status">
              <FaCheckCircle /> {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.03] focus:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-offset-2 transition-all duration-200 ease-in-out ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default ProjectSubmissionPage;
