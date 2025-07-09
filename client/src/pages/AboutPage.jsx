import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { HiOutlineUserCircle } from 'react-icons/hi';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center px-4 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-2xl w-full border border-white/40 transition-all duration-300">
        {/* Hero Section */}
        <div className="flex flex-col items-center mb-8">
          <span className="text-6xl text-indigo-500 mb-2 animate-bounce-slow">
            <HiOutlineUserCircle />
          </span>
          <h2 className="text-4xl font-extrabold mb-2 text-gray-900 font-sans drop-shadow-lg tracking-tight">About LearnTech</h2>
          <p className="text-lg text-gray-700 font-sans text-center max-w-xl">
            <span className="font-semibold text-indigo-700">LearnTech</span> is a modern platform for educators and learners to explore the latest in Generative AI and technology. Discover concept explanations, hands-on projects, and AI-powered video summaries—all in one place.
          </p>
        </div>
        {/* Tech Stack Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-3 text-indigo-700 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-indigo-400 rounded-full"></span>Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">React</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">Tailwind CSS</span>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">Vite</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">Python</span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">Flask</span>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">MongoDB</span>
            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold">Gemini API</span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">YouTube Transcript API</span>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">Marshmallow</span>
          </div>
        </div>
        {/* Features Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-3 text-indigo-700 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-indigo-400 rounded-full"></span>Key Features
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1 pl-2">
            <li>Curated concept and project videos (YouTube integration)</li>
            <li>Student project submission with admin moderation</li>
            <li>AI-powered video summarization (Gemini API)</li>
            <li>Responsive, accessible, and modern UI</li>
            <li>Admin panel for project approvals and management</li>
            <li>Secure token-based admin access</li>
            <li>Modular, scalable backend structure</li>
          </ul>
        </div>
        {/* Creator Section */}
        <div className="mb-2">
          <h3 className="text-2xl font-bold mb-3 text-indigo-700 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-indigo-400 rounded-full"></span>About the Creator
          </h3>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-3xl" aria-hidden>👨‍💻</span>
            <div>
              <span className="font-semibold">Soham Chafale</span> <br/>
              <span className="text-gray-600 text-sm">Full Stack Developer</span>
            </div>
          </div>
          <div className="flex gap-4 mt-2">
            <a href="https://www.linkedin.com/in/soham-chafale/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 transition-colors duration-200 flex items-center gap-1 group">
              <FaLinkedin className="group-hover:scale-110" /> LinkedIn
            </a>
            <a href="https://github.com/soham1111-jod" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black transition-colors duration-200 flex items-center gap-1 group">
              <FaGithub className="group-hover:scale-110" /> GitHub
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-400">&copy; {new Date().getFullYear()} Soham Chafale. All rights reserved.</div>
      </div>
    </div>
  );
}
