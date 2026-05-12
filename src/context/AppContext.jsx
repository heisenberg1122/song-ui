import React, { createContext, useState, useContext, useEffect } from 'react';
import { songs as allSongs, defaultPlaylists } from '../data/songs';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
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
    { id: 1, text: "Welcome to OPM Vibe! Discover the best Filipino music.", isRead: false },
    { id: 2, text: "New playlist 'Chill Vibes' is ready for you.", isRead: false }
  ]);

  // Load user from local storage on mount
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
      addToHistory(song.id);
    }
  };

  const togglePlay = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    if (!currentSong) return;
    const currentIndex = allSongs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % allSongs.length;
    playSong(allSongs[nextIndex]);
  };

  const prevSong = () => {
    if (!currentSong) return;
    const currentIndex = allSongs.findIndex(s => s.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? allSongs.length - 1 : currentIndex - 1;
    playSong(allSongs[prevIndex]);
  };

  // State Management
  const toggleLike = (songId) => {
    setLikedSongs(prev => {
      const isLiked = prev.includes(songId);
      if (!isLiked) {
        const songName = allSongs.find(s => s.id === songId)?.title;
        addNotification(`Added "${songName}" to Liked Songs`);
      }
      return isLiked ? prev.filter(id => id !== songId) : [...prev, songId];
    });
  };

  const addToHistory = (songId) => {
    setHistory(prev => {
      const newHistory = prev.filter(id => id !== songId);
      return [songId, ...newHistory].slice(0, 50); // Keep last 50
    });
  };

  const createPlaylist = (name) => {
    if (!name.trim()) return;
    const newPlaylist = {
      id: `p_${Date.now()}`,
      name,
      songs: []
    };
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
      currentSong, isPlaying, playSong, togglePlay, nextSong, prevSong,
      likedSongs, toggleLike,
      history,
      playlists, createPlaylist, addToPlaylist,
      searchQuery, setSearchQuery,
      currentUser, login, logout,
      isAuthModalOpen, setIsAuthModalOpen,
      notifications, markNotificationsRead
    }}>
      {children}
    </AppContext.Provider>
  );
};
