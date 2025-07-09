import React from 'react';

function ProjectCard({ project }) {
  return (
    <div className="bg-white/80 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-200 overflow-hidden flex flex-col font-sans">
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 tracking-tight font-sans">{project.title}</h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2 font-sans">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {project.tech_stack?.map((tech, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">{tech}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 gap-2">
          <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-medium" aria-label="GitHub Repository">GitHub</a>
          <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-xs font-medium" aria-label="Live Demo">Demo</a>
          <a href={project.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-xs font-medium" aria-label="LinkedIn Profile">LinkedIn</a>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard; 