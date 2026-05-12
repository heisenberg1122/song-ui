import React from 'react';
import { Clock } from 'lucide-react';
import { songs as allSongs } from '../data/songs';
import { useAppContext } from '../context/AppContext';
import SongCard from '../components/SongCard';
import './Pages.css';

const History = () => {
  const { history, currentSong, isPlaying, playSong } = useAppContext();
  
  const historyObjects = history.map(id => allSongs.find(s => s.id === id)).filter(Boolean);

  return (
    <main className="main-content library-page">
      <div className="section-header">
        <div className="header-title">
          <Clock size={32} className="header-icon" />
          <h1 className="page-header" style={{ marginBottom: 0 }}>Watch History</h1>
        </div>
      </div>
      
      {historyObjects.length === 0 ? (
        <p className="empty-state">You haven't watched any videos yet. Start exploring!</p>
      ) : (
        <div className="songs-grid">
          {historyObjects.map((song, index) => (
            <SongCard 
              key={`hist-${song.id}-${index}`} 
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

export default History;
