import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTrashAlt, FaHourglassHalf, FaSignOutAlt, FaExclamationCircle } from 'react-icons/fa';

const PAGE_SIZE = 10;
const TOKEN_KEY = 'admin_token';

function ConfirmModal({ open, onClose, onConfirm, action, projectTitle }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm animate-fade-in">
        <h3 className="text-lg font-bold mb-2">Confirm {action}</h3>
        <p className="mb-4">Are you sure you want to <span className="font-semibold text-red-600">{action}</span> <span className="font-semibold">{projectTitle}</span>?</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Yes, {action}</button>
        </div>
      </div>
    </div>
  );
}

function AdminProjectsPage() {
  const navigate = useNavigate();
  const [pendingProjects, setPendingProjects] = useState([]);
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [playlistForm, setPlaylistForm] = useState({ playlistId: '', name: '', author: '' });
  const [playlistMessage, setPlaylistMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem("Login") || '');
  const observer = useRef();
  const [modal, setModal] = useState({ open: false, action: '', id: '', type: '', title: '' });

  // Redirect to /admin if not logged in
  useEffect(() => {
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  // Fetch pending projects
  const fetchPendingProjects = useCallback(async (pageNum, adminToken) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/pending`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status === 401) {
        setToken('');
        //localStorage.removeItem(TOKEN_KEY);
        setLoading(false);
        // navigate('/admin', { replace: true });
        return;
      }
      const data = await res.json();
      // Simulate pagination for now
      const start = (pageNum - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      setPendingProjects((prev) => [...prev, ...data.slice(start, end)]);
      setHasMore(data.length > end);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch approved projects
  const fetchApprovedProjects = useCallback(async (adminToken) => {
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/approved`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status === 401) {
        setToken('');
        localStorage.removeItem(TOKEN_KEY);
        //navigate('/admin', { replace: true });
        return;
      }
      const data = await res.json();
      setApprovedProjects(data);
    } catch (err) {
      setError(err.message);
    }
  }, [navigate]);

  useEffect(() => {
    if (token) {
      fetchPendingProjects(page, token);
      fetchApprovedProjects(token);
    }
    // eslint-disable-next-line
  }, [page, token, fetchPendingProjects, fetchApprovedProjects]);

  const lastProjectRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleApprove = async (id) => {
    setError('');
    try {
      const res = await fetch(`/api/projects/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        setToken('');
        localStorage.removeItem(TOKEN_KEY);
        //navigate('/admin', { replace: true });
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to approve');
      setPendingProjects((prev) => prev.filter((p) => p._id !== id));
      fetchApprovedProjects(token);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = (id, type, title) => {
    setModal({ open: true, action: 'delete', id, type, title });
  };
  const confirmDelete = async () => {
    setError('');
    try {
      const res = await fetch(`/api/projects/${modal.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        setToken('');
        localStorage.removeItem(TOKEN_KEY);
        setModal({ open: false, action: '', id: '', type: '', title: '' });
        //navigate('/admin', { replace: true });
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      if (modal.type === 'pending') {
        setPendingProjects((prev) => prev.filter((p) => p._id !== modal.id));
      } else {
        setApprovedProjects((prev) => prev.filter((p) => p._id !== modal.id));
      }
      setModal({ open: false, action: '', id: '', type: '', title: '' });
    } catch (err) {
      setError(err.message);
      setModal({ open: false, action: '', id: '', type: '', title: '' });
    }
  };

  const handlePlaylistChange = e => {
    setPlaylistForm({ ...playlistForm, [e.target.name]: e.target.value });
  };

  const handlePlaylistSubmit = async e => {
    e.preventDefault();
    setPlaylistMessage('');
    try {
      const { playlistId, name, author } = playlistForm;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/playlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ playlistId, name, author })
      });
      if (res.ok) {
        setPlaylistMessage('Playlist added!');
        setPlaylistForm({ playlistId: '', name: '', author: '' });
      } else {
        const data = await res.json();
        setPlaylistMessage(data.error || 'Error adding playlist');
      }
    } catch {
      setPlaylistMessage('Error adding playlist');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem("Login");
    setPendingProjects([]);
    setApprovedProjects([]);
    setPage(1);
    navigate('/admin');

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 px-2 py-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-center px-6 py-5 mb-8 border border-white/40 gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-indigo-800 flex items-center gap-2">
            Admin Panel
            <span className="ml-2 text-xs md:text-base font-normal text-gray-500">
              ({pendingProjects.length} pending, {approvedProjects.length} approved)
            </span>
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-base text-red-600 hover:text-red-800 font-semibold transition px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 shadow-sm"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {error && (
          <div className="text-red-600 mb-4 text-center font-semibold" role="alert">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Section */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Pending Projects Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-yellow-700 flex items-center gap-2">
                <FaHourglassHalf /> Pending Project Submissions
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-live="polite">
                {pendingProjects.length === 0 && !loading && (
                  <li className="col-span-2 text-center text-gray-400 py-8">
                    No pending projects.
                  </li>
                )}
                {pendingProjects.map((project, idx) => (
                  <li
                    key={project._id}
                    ref={idx === pendingProjects.length - 1 ? lastProjectRef : null}
                    className="bg-white rounded-xl shadow-lg p-6 border border-yellow-100 hover:shadow-2xl transition group focus-within:ring-2 focus-within:ring-yellow-400 outline-none"
                    tabIndex={0}
                    aria-label={`Project: ${project.title}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className="font-bold text-lg md:text-xl text-gray-900 truncate"
                        title={project.title}
                      >
                        {project.title}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm md:text-base mb-2 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs mb-4">
                      {typeof project.tech_stack === "string" &&
                        project.tech_stack.split(",").map((tech, i) => (
                          <span
                            key={i}
                            className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium shadow-sm"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-auto">
                      <button
                        onClick={() => handleApprove(project._id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        aria-label="Approve project"
                      >
                        <FaCheckCircle /> Approve
                      </button>
                      <button
                        onClick={() => handleDelete(project._id, "pending", project.title)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
                        aria-label="Delete project"
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </div>
                  </li>
                ))}
                {loading && (
                  <li className="col-span-2 flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </li>
                )}
              </ul>
            </section>

            {/* Approved Projects Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center gap-2">
                <FaCheckCircle /> Approved Projects
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {approvedProjects.length === 0 && !loading && (
                  <li className="col-span-2 text-center text-gray-400 py-8">
                    No approved projects.
                  </li>
                )}
                {approvedProjects.map((project) => (
                  <li
                    key={project._id}
                    className="bg-white rounded-xl shadow-lg p-6 border border-green-100 hover:shadow-2xl transition group focus-within:ring-2 focus-within:ring-green-400 outline-none"
                    tabIndex={0}
                    aria-label={`Project: ${project.title}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className="font-bold text-lg md:text-xl text-gray-900 truncate"
                        title={project.title}
                      >
                        {project.title}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Approved
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm md:text-base mb-2 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs mb-4">
                      {typeof project.tech_stack === "string" &&
                        project.tech_stack.split(",").map((tech, i) => (
                          <span
                            key={i}
                            className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium shadow-sm"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-auto">
                      <button
                        onClick={() => handleDelete(project._id, "approved", project.title)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
                        aria-label="Delete project"
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </div>
                  </li>
                ))}
                {loading && (
                  <li className="col-span-2 flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </li>
                )}
              </ul>
            </section>
          </div>

          {/* Playlist Form Section */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="w-full max-w-md">
              <h3 className="text-2xl font-extrabold text-indigo-700 mb-4 text-center">
                Admin Tools
              </h3>
              <form
                onSubmit={handlePlaylistSubmit}
                className="bg-white/95 rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-indigo-200"
              >
                <h4 className="text-xl font-bold text-indigo-600 text-center mb-4">
                  Add New Playlist
                </h4>
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="playlistId" className="block font-medium mb-1 text-gray-700">
                      Playlist ID
                    </label>
                    <input
                      id="playlistId"
                      name="playlistId"
                      value={playlistForm.playlistId}
                      onChange={handlePlaylistChange}
                      placeholder="Enter Playlist ID"
                      className="w-full border-2 border-indigo-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="playlistName" className="block font-medium mb-1 text-gray-700">
                      Playlist Name
                    </label>
                    <input
                      id="playlistName"
                      name="name"
                      value={playlistForm.name}
                      onChange={handlePlaylistChange}
                      placeholder="Enter Playlist Name"
                      className="w-full border-2 border-indigo-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="playlistAuthor" className="block font-medium mb-1 text-gray-700">
                      Author
                    </label>
                    <input
                      id="playlistAuthor"
                      name="author"
                      value={playlistForm.author}
                      onChange={handlePlaylistChange}
                      placeholder="Enter Author Name"
                      className="w-full border-2 border-indigo-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base transition"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:from-indigo-700 hover:to-pink-600 hover:scale-[1.03] focus:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-offset-2 transition-all duration-200 ease-in-out mt-2 ${loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? "Adding..." : "Add Playlist"}
                </button>
                {playlistMessage && (
                  <div
                    className={`flex items-center gap-2 justify-center text-base font-semibold mt-2 ${playlistMessage.toLowerCase().includes("error")
                        ? "text-red-600"
                        : "text-green-700"
                      }`}
                  >
                    {playlistMessage.toLowerCase().includes("error") ? (
                      <FaExclamationCircle />
                    ) : (
                      <FaCheckCircle />
                    )}{" "}
                    {playlistMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Confirm Modal */}
        <ConfirmModal
          open={modal.open}
          onClose={() =>
            setModal({ open: false, action: "", id: "", type: "", title: "" })
          }
          onConfirm={confirmDelete}
          action={modal.action}
          projectTitle={modal.title}
        />
      </div>
    </div>
  );
}

export default AdminProjectsPage; 