import React from 'react';
import { ThumbsUp } from 'lucide-react';
import { songs as allSongs } from '../data/songs';
import { useAppContext } from '../context/AppContext';
import SongCard from '../components/SongCard';
import './Pages.css';

const LikedSongs = () => {
  const { likedSongs, currentSong, isPlaying, playSong } = useAppContext();
  
  const likedSongObjects = likedSongs.map(id => allSongs.find(s => s.id === id)).filter(Boolean);

  return (
    <main className="main-content library-page">
      <div className="section-header">
        <div className="header-title">
          <ThumbsUp size={32} className="header-icon" />
          <h1 className="page-header" style={{ marginBottom: 0 }}>Liked Songs</h1>
        </div>
      </div>
      
      {likedSongObjects.length === 0 ? (
        <p className="empty-state">Songs you like will appear here.</p>
      ) : (
        <div className="songs-grid">
          {likedSongObjects.map(song => (
            <SongCard 
              key={`like-${song.id}`} 
              song={song} 
              isCurrentlyPlaying={currentSong?.id === song.id && isPlaying}
              onClick={() => playSong(song)}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default LikedSongs;
