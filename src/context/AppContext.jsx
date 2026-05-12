// src/context/AppContext.jsx
import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { defaultPlaylists } from '../data/songs';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [isApiLoading, setIsApiLoading] = useState(true);

  // FETCH FROM RENDER API & TRANSLATE DATA
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('https://song-api-8q2h.onrender.com/quiambao/songs');
        if (!response.ok) throw new Error("Failed to fetch");
        
        const backendData = await response.json();
        
        // 🔥 TRANSLATE JAVA DATA TO REACT DATA 🔥
        const translatedSongs = backendData.map(song => {
          // Extract the YouTube Video ID from the URL to generate the thumbnail
          let youtubeId = "dQw4w9WgXcQ"; // Fallback video ID
          
          if (song.url) {
            if (song.url.includes("watch?v=")) {
              youtubeId = song.url.split("watch?v=")[1].split("&")[0];
            } else if (song.url.includes("youtu.be/")) {
              youtubeId = song.url.split("youtu.be/")[1].split("?")[0];
            } else if (song.url.includes("embed/")) {
              youtubeId = song.url.split("embed/")[1].split("?")[0];
            }
          }

          return {
            id: String(song.id),
            title: song.title,
            artist: song.artist,
            category: song.genre || "Pop", 
            description: `Album: ${song.album || 'Single'}`,
            views: "1M", // Fake data since Java DB doesn't have it
            time: "Recently", 
            likes: "10K",
            youtubeUrl: song.url,
            // Automatically generate the YouTube Thumbnail!
            imageUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` 
          };
        });

        setSongs(translatedSongs);
      } catch (error) {
        console.error("Error fetching songs from API:", error);
      } finally {
        setIsApiLoading(false);
      }
    };
    fetchSongs();
  }, []);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);
  const [history, setHistory] = useState([]);
  const [playlists, setPlaylists] = useState(defaultPlaylists);
  const [searchQuery, setSearchQuery] = useState('');

  // Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to OPM Vibe! Discover the best Filipino music.", isRead: false }
  ]);

  // Player Sync State
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [durationSecs, setDurationSecs] = useState(0);
  const playerRefs = useRef([]);

  const registerPlayer = useCallback((ref) => {
    if (ref && !playerRefs.current.includes(ref)) {
      playerRefs.current.push(ref);
    }
  }, []);

  const unregisterPlayer = useCallback((ref) => {
    playerRefs.current = playerRefs.current.filter(r => r !== ref);
  }, []);

  const globalSeekTo = useCallback((seconds) => {
    playerRefs.current.forEach(ref => {
      if (ref && ref.seekTo) ref.seekTo(seconds, 'seconds');
    });
    setPlayedSeconds(seconds);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('opm_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username) => {
    const user = { username };
    localStorage.setItem('opm_user', JSON.stringify(user));
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    addNotification(`Welcome back, ${username}!`);
  };

  const logout = () => {
    localStorage.removeItem('opm_user');
    setCurrentUser(null);
    addNotification("You have been logged out.");
  };

  const addNotification = (text) => {
    setNotifications(prev => [{ id: Date.now(), text, isRead: false }, ...prev]);
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Audio Playback
  const playSong = (song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      setPlayedSeconds(0); 
      addToHistory(song.id);
    }
  };

  const togglePlay = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex]);
  };

  const prevSong = () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    playSong(songs[prevIndex]);
  };

  const toggleLike = (songId) => {
    setLikedSongs(prev => {
      const isLiked = prev.includes(songId);
      if (!isLiked) {
        const songName = songs.find(s => s.id === songId)?.title;
        if (songName) addNotification(`Added "${songName}" to Liked Songs`);
      }
      return isLiked ? prev.filter(id => id !== songId) : [...prev, songId];
    });
  };

  const addToHistory = (songId) => {
    setHistory(prev => {
      const newHistory = prev.filter(id => id !== songId);
      return [songId, ...newHistory].slice(0, 50); 
    });
  };

  const createPlaylist = (name) => {
    if (!name.trim()) return;
    const newPlaylist = { id: `p_${Date.now()}`, name, songs: [] };
    setPlaylists([...playlists, newPlaylist]);
    addNotification(`Created new playlist: ${name}`);
  };

  const addToPlaylist = (playlistId, songId) => {
    setPlaylists(playlists.map(p => {
      if (p.id === playlistId && !p.songs.includes(songId)) {
        return { ...p, songs: [...p.songs, songId] };
      }
      return p;
    }));
  };

  return (
    <AppContext.Provider value={{
      songs, isApiLoading, 
      currentSong, isPlaying, playSong, togglePlay, nextSong, prevSong,
      likedSongs, toggleLike,
      history,
      playlists, createPlaylist, addToPlaylist,
      searchQuery, setSearchQuery,
      currentUser, login, logout,
      isAuthModalOpen, setIsAuthModalOpen,
      notifications, markNotificationsRead,
      playedSeconds, setPlayedSeconds,
      durationSecs, setDurationSecs,
      registerPlayer, unregisterPlayer, globalSeekTo
    }}>
      {children}
    </AppContext.Provider>
  );
};