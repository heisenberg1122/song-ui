// src/components/PlayerBar.jsx
import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Maximize2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './PlayerBar.css';

const PlayerBar = () => {
  const { 
    currentSong, isPlaying, togglePlay, nextSong, prevSong, 
    playedSeconds, setPlayedSeconds, 
    durationSecs, setDurationSecs, 
    registerPlayer, unregisterPlayer, globalSeekTo 
  } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef(null);
  
  const isWatchPage = currentSong && location.pathname === `/watch/${currentSong.id}`;
  const [hasSeeked, setHasSeeked] = useState(false);

  useEffect(() => {
    if (playerRef.current) registerPlayer(playerRef.current);
    return () => {
      if (playerRef.current) unregisterPlayer(playerRef.current);
    };
  }, [registerPlayer, unregisterPlayer]);

  useEffect(() => {
    setHasSeeked(false);
  }, [currentSong?.id]);

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progress = durationSecs > 0 ? (playedSeconds / durationSecs) * 100 : 0;
  const currentTime = formatTime(playedSeconds);
  const duration = formatTime(durationSecs);

  const handleProgress = (state) => {
    if (!isWatchPage) {
      setPlayedSeconds(state.playedSeconds);
    }
  };

  const handleDuration = (duration) => {
    setDurationSecs(duration);
  };

  const handleReady = () => {
    if (!hasSeeked && playedSeconds > 0 && playerRef.current) {
      playerRef.current.seekTo(playedSeconds, 'seconds');
      setHasSeeked(true);
    }
  };

  const handleProgressClick = (e) => {
    if (currentSong) {
      const bar = e.currentTarget;
      const clickPosition = e.nativeEvent.offsetX;
      const barWidth = bar.clientWidth;
      const clickPercentage = clickPosition / barWidth;
      const targetSeconds = clickPercentage * durationSecs;
      
      globalSeekTo(targetSeconds);
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
      {!isWatchPage && (
        <ReactPlayer
          ref={playerRef}
          url={currentSong.youtubeUrl}
          playing={isPlaying}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onReady={handleReady}
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
      )}
      
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