import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share2, BookmarkPlus } from 'lucide-react';
import { songs as allSongs } from '../data/songs';
import { useAppContext } from '../context/AppContext';
import SongCard from '../components/SongCard';
import './Pages.css';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playSong, likedSongs, toggleLike, currentSong, isPlaying } = useAppContext();
  
  const song = allSongs.find(s => s.id === id);
  const isLiked = likedSongs.includes(id);

  useEffect(() => {
    if (song && (!currentSong || currentSong.id !== song.id)) {
      playSong(song);
    }
  }, [id]);

  if (!song) {
    return <div className="page-container">Song not found</div>;
  }

  const suggestedSongs = allSongs.filter(s => s.id !== id).slice(0, 8);

  return (
    <div className="watch-page">
      <div className="watch-content">
        <div className="video-player-container">
          <img src={song.imageUrl} alt={song.title} className="video-cover" />
          <div className="video-overlay glass">
            <h2>{isPlaying && currentSong?.id === song.id ? 'Now Playing' : 'Paused'}</h2>
          </div>
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
