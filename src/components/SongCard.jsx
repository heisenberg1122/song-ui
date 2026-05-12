import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SongCard.css';

const SongCard = ({ song, isCurrentlyPlaying, onClick }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // If we click the play button, just play it
    if (e.target.closest('.card-play-btn')) {
      e.stopPropagation();
      onClick();
    } else {
      // Otherwise navigate to watch page
      navigate(`/watch/${song.id}`);
    }
  };

  return (
    <div className={`song-card ${isCurrentlyPlaying ? 'playing' : ''}`} onClick={handleCardClick}>
      <div className="card-image-container">
        <img src={song.imageUrl} alt={song.title} className="card-image" />
        <div className={`card-overlay ${isCurrentlyPlaying ? 'active' : ''}`}>
          <button className="card-play-btn" onClick={(e) => { e.stopPropagation(); onClick(); }}>
            {isCurrentlyPlaying ? (
              <Pause fill="currentColor" size={24} />
            ) : (
              <Play fill="currentColor" size={24} />
            )}
          </button>
        </div>
      </div>
      <div className="card-info">
        <h4 className="card-title text-truncate" style={{ color: isCurrentlyPlaying ? 'var(--accent-color)' : 'var(--text-primary)'}}>
          {song.title}
        </h4>
        <p className="card-artist text-truncate">{song.artist}</p>
        <div className="card-stats">
          <span>{song.views} views</span>
          <span className="dot">•</span>
          <span>{song.time}</span>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
