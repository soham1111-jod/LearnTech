
import { useEffect, useState } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

const API_URL = import.meta.env.VITE_API_URL;


export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/videos`)
      .then(res => {
        setVideos(res.data);
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
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8 flex items-center gap-4 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/30">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight font-sans">Concept Videos</h2>
        </div>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {videos.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
        {videos.length === 0 && (
          <div className="text-gray-500 text-center mt-12">No concept videos found.</div>
        )}
      </div>
    </div>
  );
}
