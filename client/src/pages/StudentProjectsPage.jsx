import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';

export default function StudentProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/projects/approved')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => {
        setError('No Projects');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-20 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" aria-label="Loading student projects"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col sm:flex-row items-center gap-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/30 animate-fade-in">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight font-sans drop-shadow-lg">Student Projects</h2>
          </div>
          <Link
            to="/submit-project"
            className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all hover:scale-105"
            aria-label="Submit your project"
          >
            Submit Project
          </Link>
        </div>
        {error && <div className="text-red-600 mb-4 text-center text-lg font-semibold animate-fade-in" role="alert">{error}</div>}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {projects.map(project => (
            <div key={project._id} className="transition-transform duration-200 hover:scale-105">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
        {projects.length === 0 && !error && (
          <div className="text-gray-500 text-center mt-12 text-lg animate-fade-in">No approved student projects found.</div>
        )}
      </div>
    </div>
  );
} 