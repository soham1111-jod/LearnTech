import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/playlists`)
      .then(res => {
        setPlaylists(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-20 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight font-sans">Playlists</h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {playlists.map(pl => (
            <Link
              key={pl._id}
              to={`/playlists/${pl.playlistId}`}
              className="group block bg-white/60 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 overflow-hidden border border-white/30"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 flex items-center justify-center">
                <span className="text-5xl text-indigo-300 group-hover:text-indigo-500 transition">🎬</span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-700 transition font-sans">{pl.name}</h3>
                <p className="text-gray-500 text-sm mb-2 font-sans">By {pl.author}</p>
              </div>
            </Link>
          ))}
        </div>
        {playlists.length === 0 && (
          <div className="text-gray-500 text-center mt-12">No playlists found.</div>
        )}
      </div>
    </div>
  );
} 