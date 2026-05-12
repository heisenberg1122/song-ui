import React from 'react';
import { PlaySquare, UploadCloud } from 'lucide-react';
import './Pages.css';

const YourVideos = () => {
  return (
    <main className="main-content library-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div className="empty-cover" style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', marginBottom: '1.5rem' }}>
        <PlaySquare size={48} style={{ color: 'var(--text-secondary)' }} />
      </div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Manage your videos</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center', maxWidth: '400px' }}>
        Videos you upload will show up here. You can manage and organize them into playlists.
      </p>
      <button className="play-all-btn" style={{ borderRadius: '8px' }}>
        <UploadCloud size={20} />
        Upload Video
      </button>
    </main>
  );
};

export default YourVideos;
