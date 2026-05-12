import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Library as LibraryIcon, PlaySquare, Clock, ThumbsUp, PlusCircle, ListMusic } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { playlists, createPlaylist } = useAppContext();

  const handleCreatePlaylist = () => {
    const name = window.prompt("Enter playlist name:");
    if (name) {
      createPlaylist(name);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-logo">
        <PlaySquare size={28} className="logo-icon" />
        <h2>OPM Vibe</h2>
      </Link>

      <nav className="sidebar-nav">
        <ul className="nav-group">
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            <Home size={22} />
            <span>Home</span>
          </Link>
          <Link to="/explore" className={`nav-item ${isActive('/explore') ? 'active' : ''}`}>
            <Compass size={22} />
            <span>Explore</span>
          </Link>
          <Link to="/library" className={`nav-item ${isActive('/library') ? 'active' : ''}`}>
            <LibraryIcon size={22} />
            <span>Library</span>
          </Link>
        </ul>

        <div className="nav-divider"></div>

        <ul className="nav-group">
          <Link to="/history" className={`nav-item ${isActive('/history') ? 'active' : ''}`}>
            <Clock size={22} />
            <span>History</span>
          </Link>
          <Link to="/your-videos" className={`nav-item ${isActive('/your-videos') ? 'active' : ''}`}>
            <PlaySquare size={22} />
            <span>Your Videos</span>
          </Link>
          <Link to="/liked-songs" className={`nav-item ${isActive('/liked-songs') ? 'active' : ''}`}>
            <ThumbsUp size={22} />
            <span>Liked Songs</span>
          </Link>
        </ul>

        <div className="nav-divider"></div>

        <h3 className="nav-heading">Playlists</h3>
        <ul className="nav-group playlists">
          <li className="nav-item create-playlist" onClick={handleCreatePlaylist}>
            <PlusCircle size={22} />
            <span>New Playlist</span>
          </li>
          
          {playlists.map(playlist => (
            <Link 
              to={`/playlist/${playlist.id}`} 
              key={playlist.id} 
              className={`nav-item ${isActive(`/playlist/${playlist.id}`) ? 'active' : ''}`}
            >
              <ListMusic size={18} style={{ opacity: 0.7 }} />
              <span className="text-truncate">{playlist.name}</span>
            </Link>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
