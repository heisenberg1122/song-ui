import React from 'react';
import SongCard from './SongCard';
import './MainContent.css';

const MainContent = ({ 
  songs, 
  currentSong, 
  isPlaying, 
  onPlaySong, 
  searchQuery, 
  activeCategory, 
  setActiveCategory 
}) => {
  const categories = ['All', 'Music', 'Live', 'Mixes', 'Electronic', 'Lo-fi', 'Vocal'];

  // Filter songs based on search query and active category
  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || song.category === activeCategory;
    return matchesSearch && matchesCategory;
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
          {!searchQuery && <h2 className="section-title">Recommended for you</h2>}
          <div className="songs-grid">
            {filteredSongs.map(song => (
              <SongCard 
                key={song.id} 
                song={song} 
                isCurrentlyPlaying={currentSong?.id === song.id && isPlaying}
                onClick={() => onPlaySong(song)}
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
                onClick={() => onPlaySong(song)}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default MainContent;
