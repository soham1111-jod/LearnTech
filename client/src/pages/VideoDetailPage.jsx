import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function VideoDetailPage() {
  const { id: mongo_id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/videos/mongo/${mongo_id}`)
      .then(res => {
        setVideo(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setVideo(null);
      });
  }, [mongo_id]);

  if (loading) return (
    <div className="flex justify-center items-center py-10">
      <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!video) return <div className="max-w-2xl mx-auto py-20 text-center text-gray-500">Video not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to={video.type === 'project' ? '/projects' : '/videos'} className="text-blue-600 hover:underline text-sm mb-4 inline-block">&larr; Back to {video.type === 'project' ? 'Projects' : 'Videos'}</Link>
      <h1 className="text-3xl font-bold mb-4 text-gray-900 tracking-tight font-sans">{video.title}</h1>
      <div className="aspect-w-16 aspect-h-9 mb-6">
        <iframe
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.title}
          allowFullScreen
          className="w-full h-72 rounded-lg shadow"
        />
      </div>
      <div className="mb-4 text-gray-700 text-lg font-sans">{video.description}</div>
      <div className="flex flex-wrap gap-2 mb-4">
        {video.tags && video.tags.map(tag => (
          <span key={tag} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-medium">{tag}</span>
        ))}
      </div>
      <div className="text-sm text-gray-400 mb-8">Duration: {video.duration} | Published: {video.publishedAt}</div>
      {video.summary && (
        <div className="bg-white/80 rounded-2xl shadow-xl p-6 mt-8 font-sans">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 tracking-tight">AI-Generated Summary</h2>
          <p className="whitespace-pre-line text-gray-800 leading-relaxed">{video.summary}</p>
        </div>
      )}
    </div>
  );
}