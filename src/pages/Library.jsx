import React from 'react';
import { ListMusic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './Pages.css';

const Library = () => {
  const { songs, isApiLoading, playlists } = useAppContext();
  const navigate = useNavigate();

  if (isApiLoading) {
    return <main className="main-content library-page"><div style={{color: 'white'}}>Loading library...</div></main>;
  }

  return (
    <main className="main-content library-page">
      <h1 className="page-header">Your Library</h1>

      <section className="library-section">
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <div className="header-title">
            <ListMusic size={24} className="header-icon" />
            <h2>Saved Playlists</h2>
          </div>
        </div>
        
        {playlists.length === 0 ? (
          <p className="empty-state">You haven't created any playlists yet.</p>
        ) : (
          <div className="playlists-grid">
            {playlists.map(playlist => {
              // Convert ID to string for safe comparison with database IDs
              const firstSong = playlist.songs.length > 0 
                ? songs.find(s => String(s.id) === String(playlist.songs[0]))
                : null;
                
              return (
                <div 
                  key={playlist.id} 
                  className="playlist-card"
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                >
                  <div className="playlist-cover">
                    {firstSong ? (
                      <img src={firstSong.imageUrl} alt={playlist.name} />
                    ) : (
                      <div className="empty-cover"><ListMusic size={40} /></div>
                    )}
                    <div className="playlist-overlay">
                      <span>{playlist.songs.length} tracks</span>
                    </div>
                  </div>
                  <h4 className="text-truncate">{playlist.name}</h4>
                  <p>Playlist</p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default Library;