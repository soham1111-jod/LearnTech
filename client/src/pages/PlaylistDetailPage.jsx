import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

const API_URL = import.meta.env.VITE_API_URL;


export default function PlaylistDetailPage() {
  const { playlistId } = useParams();
  const [videos, setVideos] = useState([]);
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    axios.get(`${API_URL}/videos?playlistId=${playlistId}`)
      .then(res => {
        setVideos(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
      axios.get(`${API_URL}/playlists`)
      .then(res => {
        const found = res.data.find(pl => pl.playlistId === playlistId);
        setPlaylist(found || null);
      });
  }, [playlistId]);

  if (loading) return (
    <div className="flex justify-center items-center py-20 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/playlists" className="text-indigo-600 hover:underline text-sm font-medium">&larr; Back to Playlists</Link>
          <span className="text-3xl">🎬</span>
        </div>
        {playlist && (
          <div className="mb-8 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/30">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2 font-sans">{playlist.name}</h2>
            <p className="text-gray-500 text-lg font-sans">By {playlist.author}</p>
          </div>
        )}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {videos.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
        {videos.length === 0 && (
          <div className="text-gray-500 text-center mt-12">No videos found in this playlist.</div>
        )}
      </div>
    </div>
  );
} 