// import React from 'react';

// function ProjectCard({ project }) {
//   return (
//     <div className="bg-white/80 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-200 overflow-hidden flex flex-col font-sans">
//       <div className="p-4 flex-1 flex flex-col justify-between">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 tracking-tight font-sans">{project.title}</h3>
//           <p className="text-sm text-gray-500 mb-2 line-clamp-2 font-sans">{project.description}</p>
//           <div className="flex flex-wrap gap-2 mb-2">
//             {project.tech_stack?.map((tech, idx) => (
//               <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">{tech}</span>
//             ))}
//           </div>
//         </div>
//         <div className="flex items-center justify-between mt-2 gap-2">
//           <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-medium" aria-label="GitHub Repository">GitHub</a>
//           <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-xs font-medium" aria-label="Live Demo">Demo</a>
//           <a href={project.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-xs font-medium" aria-label="LinkedIn Profile">LinkedIn</a>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProjectCard; 

import React from "react";
import { FaGithub, FaGlobe, FaLinkedin } from "react-icons/fa";

function ProjectCard({ project }) {
  return (
    <div className="bg-white/80 rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col font-sans">
      <div className="p-4 flex-1 flex flex-col justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 tracking-tight">
            {project.title}
          </h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {project.tech_stack?.map((tech, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 gap-2">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline text-xs font-medium transition"
              aria-label="GitHub Repository"
            >
              <FaGithub className="w-3 h-3" /> GitHub
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:underline text-xs font-medium transition"
              aria-label="Live Demo"
            >
              <FaGlobe className="w-3 h-3" /> Demo
            </a>
          )}
          {project.linkedin && (
            <a
              href={project.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 hover:underline text-xs font-medium transition"
              aria-label="LinkedIn Profile"
            >
              <FaLinkedin className="w-3 h-3" /> LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
