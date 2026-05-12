import React, { useState } from 'react';
import SongCard from '../components/SongCard';
import { useAppContext } from '../context/AppContext';
import '../components/MainContent.css';

const Home = () => {
  // Pull songs and loading state from your API context
  const { songs, isApiLoading, currentSong, isPlaying, playSong, searchQuery } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', 'Pop', 'Rock', 'Indie', 'Acoustic', 'Rap'];

  // Show a loading state while fetching from Render
  if (isApiLoading) {
    return <main className="main-content"><div style={{color: 'white', padding: '2rem'}}>Loading songs from database...</div></main>;
  }

  const filteredSongs = songs.filter(song => {
    // Add optional chaining (?.) just in case any database field is empty
    const titleMatch = song.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const artistMatch = song.artist?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || song.category === activeCategory;
    
    return (titleMatch || artistMatch) && matchesCategory;
  });

  return (
    <main className="main-content">
      <div className="categories">
        {categories.map(category => (
          <button 
            key={category}
            className={`category-chip ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {searchQuery && (
        <h2 className="section-title">Search results for "{searchQuery}"</h2>
      )}

      {filteredSongs.length === 0 ? (
        <div className="no-results">No songs found. Try a different search or category.</div>
      ) : (
        <section className="song-section">
          {!searchQuery && <h2 className="section-title">Explore OPM Hits</h2>}
          <div className="songs-grid">
            {filteredSongs.map(song => (
              <SongCard 
                key={song.id} 
                song={song} 
                isCurrentlyPlaying={currentSong?.id === song.id && isPlaying}
                onClick={() => playSong(song)}
              />
            ))}
          </div>
        </section>
      )}
      
      {!searchQuery && activeCategory === 'All' && (
        <section className="song-section">
          <h2 className="section-title">Trending Now</h2>
          <div className="songs-grid">
            {songs.slice().reverse().map(song => (
              <SongCard 
                key={`trending-${song.id}`} 
                song={song} 
                isCurrentlyPlaying={currentSong?.id === song.id && isPlaying}
                onClick={() => playSong(song)}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default Home;