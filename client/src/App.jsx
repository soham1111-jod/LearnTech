import { Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";

const HomePage = lazy(() => import("./pages/HomePage"));
const VideosPage = lazy(() => import("./pages/VideosPage"));
const VideoDetailPage = lazy(() => import("./pages/VideoDetailPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PlaylistsPage = lazy(() => import("./pages/PlaylistsPage"));
const PlaylistDetailPage = lazy(() => import("./pages/PlaylistDetailPage"));
const ProjectSubmissionPage = lazy(() => import("./pages/ProjectSubmissionPage"));
const AdminProjectsPage = lazy(() => import("./pages/AdminProjectsPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const StudentProjectsPage = lazy(() => import("./pages/StudentProjectsPage"));

function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/videos/:id" element={<VideoDetailPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlists/:playlistId" element={<PlaylistDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/submit-project" element={<ProjectSubmissionPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/projects" element={<AdminProjectsPage />} />
          <Route path="/student-projects" element={<StudentProjectsPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;