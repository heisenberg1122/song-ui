import React from 'react';
import { useParams } from 'react-router-dom';
import { Play } from 'lucide-react';
import { songs as allSongs } from '../data/songs';
import { useAppContext } from '../context/AppContext';
import SongCard from '../components/SongCard';
import './Pages.css';

const Playlist = () => {
  const { id } = useParams();
  const { playlists, currentSong, isPlaying, playSong } = useAppContext();
  
  const playlist = playlists.find(p => p.id === id);

  if (!playlist) {
    return <div className="page-container">Playlist not found</div>;
  }

  const playlistSongs = playlist.songs.map(songId => allSongs.find(s => s.id === songId)).filter(Boolean);
  const firstSong = playlistSongs[0];

  const handlePlayAll = () => {
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0]);
    }
  };

  return (
    <main className="main-content playlist-page">
      <div className="playlist-header">
        <div className="playlist-header-cover">
          {firstSong ? (
            <img src={firstSong.imageUrl} alt={playlist.name} />
          ) : (
            <div className="empty-cover">Empty</div>
          )}
        </div>
        <div className="playlist-header-info">
          <h2>Playlist</h2>
          <h1 className="playlist-title">{playlist.name}</h1>
          <p className="playlist-meta">{playlistSongs.length} songs</p>
          <button 
            className="play-all-btn" 
            onClick={handlePlayAll}
            disabled={playlistSongs.length === 0}
          >
            <Play fill="currentColor" size={20} />
            Play All
          </button>
        </div>
      </div>

      <div className="playlist-songs">
        {playlistSongs.length === 0 ? (
          <p className="empty-state">No songs in this playlist yet.</p>
        ) : (
          <div className="songs-grid">
            {playlistSongs.map(song => (
              <SongCard 
                key={song.id} 
                song={song} 
                isCurrentlyPlaying={currentSong?.id === song.id && isPlaying}
                onClick={() => playSong(song)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Playlist;
