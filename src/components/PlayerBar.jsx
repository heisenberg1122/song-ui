import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Maximize2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import './PlayerBar.css';

const PlayerBar = () => {
  const { currentSong, isPlaying, togglePlay, nextSong, prevSong } = useAppContext();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [durationSecs, setDurationSecs] = useState(0);

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgress = (state) => {
    setProgress(state.played * 100);
    setCurrentTime(formatTime(state.playedSeconds));
  };

  const handleDuration = (duration) => {
    setDurationSecs(duration);
    setDuration(formatTime(duration));
  };

  const handleProgressClick = (e) => {
    if (playerRef.current && currentSong) {
      const bar = e.currentTarget;
      const clickPosition = e.nativeEvent.offsetX;
      const barWidth = bar.clientWidth;
      const clickPercentage = clickPosition / barWidth;
      
      playerRef.current.seekTo(clickPercentage, 'fraction');
      setProgress(clickPercentage * 100);
    }
  };

  const handleError = (e) => {
    console.error("ReactPlayer Error:", e);
    // If the video is restricted from embedding, skip to the next song to avoid dead air
    nextSong();
  };

  if (!currentSong) {
    return (
      <div className="player-bar glass">
        <div className="player-placeholder">Select a song to start playing</div>
      </div>
    );
  }

  return (
    <div className="player-bar glass">
      {/* Hidden ReactPlayer to stream YouTube audio - styled specifically to avoid iframe restrictions */}
      <ReactPlayer
        ref={playerRef}
        url={currentSong.youtubeUrl}
        playing={isPlaying}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={nextSong}
        onError={handleError}
        width="1px"
        height="1px"
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', top: '-1000px', left: '-1000px' }}
        config={{
          youtube: {
            playerVars: { 
              showinfo: 0, 
              controls: 0,
              origin: window.location.origin
            }
          }
        }}
      />
      
      <div className="now-playing" onClick={() => navigate(`/watch/${currentSong.id}`)} style={{cursor: 'pointer'}}>
        <img 
          src={currentSong.imageUrl} 
          alt={currentSong.title} 
          className="album-art"
        />
        <div className="song-info">
          <h4 className="song-title text-truncate">{currentSong.title}</h4>
          <p className="song-artist text-truncate">{currentSong.artist}</p>
        </div>
      </div>

      <div className="player-controls-container">
        <div className="player-controls">
          <button className="control-btn small"><Shuffle size={18} /></button>
          <button className="control-btn" onClick={prevSong}><SkipBack size={24} /></button>
          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          <button className="control-btn" onClick={nextSong}><SkipForward size={24} /></button>
          <button className="control-btn small"><Repeat size={18} /></button>
        </div>
        <div className="progress-container">
          <span className="time">{currentTime}</span>
          <div className="progress-bar" onClick={handleProgressClick}>
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="time">{duration}</span>
        </div>
      </div>

      <div className="player-actions">
        <Volume2 size={20} className="action-icon" />
        <div className="volume-bar">
          <div className="volume-fill" style={{ width: '70%' }}></div>
        </div>
        <Maximize2 size={18} className="action-icon" onClick={() => navigate(`/watch/${currentSong.id}`)} />
      </div>
    </div>
  );
};

export default PlayerBar;
