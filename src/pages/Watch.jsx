// src/pages/Watch.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share2, BookmarkPlus } from 'lucide-react';
import { songs as allSongs } from '../data/songs';
import { useAppContext } from '../context/AppContext';
import './Pages.css';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Safely grab only the base functions from your original AppContext
  const { playSong, likedSongs, toggleLike, currentSong } = useAppContext();

  const song = allSongs.find(s => s.id === id);
  const isLiked = likedSongs.includes(id);

  // Automatically sync the global "Now Playing" state when you load the page
  useEffect(() => {
    if (song && (!currentSong || currentSong.id !== song.id)) {
      playSong(song);
    }
  }, [id, song, currentSong, playSong]);

  if (!song) {
    return <div className="page-container">Song not found</div>;
  }

  // Convert standard YouTube URL to an Embed URL so the iframe can read it
  // Example: "https://www.youtube.com/watch?v=123" -> "https://www.youtube.com/embed/123?autoplay=1"
  const embedUrl = song.youtubeUrl.replace('watch?v=', 'embed/') + '?autoplay=1';

  const suggestedSongs = allSongs.filter(s => s.id !== id).slice(0, 8);

  return (
    <div className="watch-page">
      <div className="watch-content">
        
        {/* Native HTML5 Iframe Embed - Bypasses all React-Player and Vite errors */}
        <div className="video-player-container">
          <iframe 
            src={embedUrl} 
            title={song.title}
            width="100%" 
            height="100%" 
            style={{ position: 'absolute', top: 0, left: 0, border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>

        <h1 className="watch-title">{song.title}</h1>
        
        <div className="watch-metadata">
          <div className="watch-channel">
            <div className="channel-avatar">{song.artist.charAt(0)}</div>
            <div>
              <h3 className="channel-name">{song.artist}</h3>
              <p className="channel-subs">1.5M subscribers</p>
            </div>
            <button className="subscribe-btn">Subscribe</button>
          </div>

          <div className="watch-actions">
            <div className="action-group">
              <button 
                className={`action-btn ${isLiked ? 'active' : ''}`} 
                onClick={() => toggleLike(song.id)}
              >
                <ThumbsUp size={20} fill={isLiked ? "currentColor" : "none"} />
                <span>{song.likes}</span>
              </button>
              <div className="action-divider"></div>
              <button className="action-btn">
                <ThumbsDown size={20} />
              </button>
            </div>
            
            <button className="action-btn solo">
              <Share2 size={20} />
              <span>Share</span>
            </button>
            
            <button className="action-btn solo">
              <BookmarkPlus size={20} />
              <span>Save</span>
            </button>
          </div>
        </div>

        <div className="watch-description">
          <p className="view-count">{song.views} views • {song.time}</p>
          <p className="desc-text">{song.description}</p>
          <div className="tags">
            <span className="tag">#{song.category.toLowerCase()}</span>
            <span className="tag">#opm</span>
            <span className="tag">#music</span>
          </div>
        </div>
      </div>

      <div className="watch-sidebar">
        <h3 className="sidebar-title">Up Next</h3>
        <div className="suggested-list">
          {suggestedSongs.map(s => (
            <div 
              key={s.id} 
              className="suggested-item" 
              onClick={() => navigate(`/watch/${s.id}`)}
            >
              <img src={s.imageUrl} alt={s.title} className="suggested-img" />
              <div className="suggested-info">
                <h4 className="text-truncate">{s.title}</h4>
                <p className="text-truncate">{s.artist}</p>
                <span>{s.views} views</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Watch;