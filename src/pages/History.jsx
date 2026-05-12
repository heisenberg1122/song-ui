import React from 'react';
import { Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import SongCard from '../components/SongCard';
import './Pages.css';

const History = () => {
  const { songs, isApiLoading, history, currentSong, isPlaying, playSong } = useAppContext();
  
  if (isApiLoading) {
    return <main className="main-content library-page"><div style={{color: 'white'}}>Loading history...</div></main>;
  }

  // Safe matching between local storage strings and database numbers
  const historyObjects = history
    .map(id => songs.find(s => String(s.id) === String(id)))
    .filter(Boolean);

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