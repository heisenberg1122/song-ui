import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PlayerBar from './components/PlayerBar';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Library from './pages/Library';
import History from './pages/History';
import LikedSongs from './pages/LikedSongs';
import YourVideos from './pages/YourVideos';
import Playlist from './pages/Playlist';
import AuthModal from './components/AuthModal';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Home />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/library" element={<Library />} />
        <Route path="/history" element={<History />} />
        <Route path="/liked-songs" element={<LikedSongs />} />
        <Route path="/your-videos" element={<YourVideos />} />
        <Route path="/playlist/:id" element={<Playlist />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <PlayerBar />
      <AuthModal />
    </div>
  );
}

export default App;
