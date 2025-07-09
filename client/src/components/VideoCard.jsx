import { Link } from 'react-router-dom';

export default function VideoCard({ video }) {
  return (
    <div className="bg-white/80 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-200 overflow-hidden flex flex-col font-sans">
      <Link to={`/videos/${video._id}`} className="block">
        <img
          src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 tracking-tight font-sans">{video.title}</h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2 font-sans">{video.description}</p>
          {video.summary && (
            <p className="text-xs text-gray-700 mt-2 line-clamp-3 font-sans">{video.summary}</p>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">{video.duration}</span>
          <Link to={`/videos/${video._id}`} className="text-blue-600 hover:underline text-xs font-medium">View Details</Link>
        </div>
      </div>
    </div>
  );
}
