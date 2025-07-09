import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTrashAlt, FaHourglassHalf, FaSignOutAlt } from 'react-icons/fa';

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
  }, [token, navigate]);

  // Fetch pending projects
  const fetchPendingProjects = useCallback(async (pageNum, adminToken) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/projects/pending', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status === 401) {
        setToken('');
        localStorage.removeItem(TOKEN_KEY);
        setLoading(false);
        navigate('/admin', { replace: true });
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
      const res = await fetch('/api/projects/approved', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status === 401) {
        setToken('');
        localStorage.removeItem(TOKEN_KEY);
        navigate('/admin', { replace: true });
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
        navigate('/admin', { replace: true });
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
        navigate('/admin', { replace: true });
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

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem("Login");
    setPendingProjects([]);
    setApprovedProjects([]);
    setPage(1);
    navigate('/admin', { replace: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-2 py-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md rounded-xl shadow flex justify-between items-center px-6 py-4 mb-6 border border-white/30">
          <h1 className="text-3xl font-bold tracking-tight text-indigo-800 flex items-center gap-2">
            Admin Panel
            <span className="ml-2 text-xs font-normal text-gray-500">({pendingProjects.length} pending, {approvedProjects.length} approved)</span>
          </h1>
          <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 font-semibold transition"><FaSignOutAlt /> Logout</button>
        </div>
        {error && <div className="text-red-600 mb-2" role="alert">{error}</div>}
        {/* Pending Projects Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-yellow-700 flex items-center gap-2"><FaHourglassHalf /> Pending Project Submissions</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-live="polite">
            {pendingProjects.length === 0 && !loading && (
              <li className="col-span-2 text-center text-gray-400 py-8">No pending projects.</li>
            )}
            {pendingProjects.map((project, idx) => (
              <li
                key={project._id}
                ref={idx === pendingProjects.length - 1 ? lastProjectRef : null}
                className="bg-yellow-50 rounded-xl shadow p-6 flex flex-col gap-2 border border-yellow-100 hover:shadow-lg transition group"
                tabIndex={0}
                aria-label={`Project: ${project.title}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-lg text-gray-900 truncate" title={project.title}>{project.title}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800">Pending</span>
                </div>
                <div className="text-gray-700 text-sm mb-2 line-clamp-3">{project.description}</div>
                <div className="flex flex-wrap gap-2 text-xs mb-2">
                  {project.tech_stack?.split(',').map((tech, i) => (
                    <span key={i} className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{tech.trim()}</span>
                  ))}
                </div>
                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => handleApprove(project._id)}
                    className="flex items-center gap-1 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition text-sm font-semibold shadow"
                    aria-label="Approve project"
                  >
                    <FaCheckCircle /> Approve
                  </button>
                  <button
                    onClick={() => handleDelete(project._id, 'pending', project.title)}
                    className="flex items-center gap-1 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition text-sm font-semibold shadow"
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
          <h2 className="text-xl font-semibold mb-3 text-green-700 flex items-center gap-2"><FaCheckCircle /> Approved Projects</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approvedProjects.length === 0 && !loading && (
              <li className="col-span-2 text-center text-gray-400 py-8">No approved projects.</li>
            )}
            {approvedProjects.map((project) => (
              <li
                key={project._id}
                className="bg-green-50 rounded-xl shadow p-6 flex flex-col gap-2 border border-green-100 hover:shadow-lg transition group"
                tabIndex={0}
                aria-label={`Project: ${project.title}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-lg text-gray-900 truncate" title={project.title}>{project.title}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-200 text-green-800">Approved</span>
                </div>
                <div className="text-gray-700 text-sm mb-2 line-clamp-3">{project.description}</div>
                <div className="flex flex-wrap gap-2 text-xs mb-2">
                  {project.tech_stack?.split(',').map((tech, i) => (
                    <span key={i} className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{tech.trim()}</span>
                  ))}
                </div>
                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => handleDelete(project._id, 'approved', project.title)}
                    className="flex items-center gap-1 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition text-sm font-semibold shadow"
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
      {/* Confirm Modal */}
      <ConfirmModal
        open={modal.open}
        onClose={() => setModal({ open: false, action: '', id: '', type: '', title: '' })}
        onConfirm={confirmDelete}
        action={modal.action}
        projectTitle={modal.title}
      />
    </div>
  );
}

export default AdminProjectsPage; 