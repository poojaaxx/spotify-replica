import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Music2,
  Disc3,
  Play,
  Pause,
  Heart,
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import PlaylistCard from './components/PlaylistCard';
import TrackList from './components/TrackList';
import IconButton from './components/IconButton';
import HomeView from './components/HomeView';
import SearchView from './components/SearchView';
import PlayerBar from './components/PlayerBar';
import { playlists, tracks, playlistTracks } from './data/catalog';
import { usePlayer } from './context/PlayerContext';

const validViews = [
  'home',
  'search',
  'library',
  'liked',
  ...playlists.map((p) => p.id),
];
const readView = () => {
  const id = window.location.hash.slice(1);
  return validViews.includes(id) ? id : 'home';
};

export default function App() {
  const [history, setHistory] = useState([readView()]);
  const [position, setPosition] = useState(0);
  const [query, setQuery] = useState('');
  const mainRef = useRef(null);
  const p = usePlayer();
  const view = history[position];
  const playlist = playlists.find((item) => item.id === view);
  const likedTracks = tracks.filter((t) => p.liked.includes(t.id));
  const navigate = (id) => {
    if (view !== id) {
      setHistory([...history.slice(0, position + 1), id]);
      setPosition(position + 1);
    }
  };
  useEffect(() => {
    window.history.replaceState(null, '', `#${view}`);
    mainRef.current?.scrollTo(0, 0);
    document.title = `${playlist?.title || { home: 'Home', search: 'Search', library: 'Your Library', liked: 'Liked Songs' }[view]} • Spotify Replica`;
  }, [view, playlist]);
  useEffect(() => {
    const change = () => navigate(readView());
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  });

  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current.focus();
        }}
      >
        Skip to content
      </a>
      <div className="app-shell">
        <Sidebar view={view} navigate={navigate} />
        <main
          ref={mainRef}
          className="main-panel"
          id="main-content"
          tabIndex={-1}
          style={playlist ? { '--hero-color': playlist.color } : {}}
        >
          <header className="topbar">
            <div className="history-controls">
              <IconButton
                icon={ChevronLeft}
                label="Go back"
                disabled={!position}
                onClick={() => setPosition(position - 1)}
              />
              <IconButton
                icon={ChevronRight}
                label="Go forward"
                disabled={position === history.length - 1}
                onClick={() => setPosition(position + 1)}
              />
            </div>
            <span className="topbar-caption">
              YOUR DAILY DOSE OF GOOD MUSIC
            </span>
            <span className="avatar" aria-label="Local listener">
              P
            </span>
          </header>
          {view === 'home' && <HomeView navigate={navigate} />}
          {view === 'search' && (
            <SearchView query={query} setQuery={setQuery} />
          )}
          {playlist && (
            <>
              <section className="playlist-hero">
                <img
                  src={playlist.cover}
                  alt={`${playlist.title} original geometric cover artwork`}
                />
                <div>
                  <span className="eyebrow">PLAYLIST</span>
                  <h1>{playlist.title}</h1>
                  <p>{playlist.description}</p>
                  <span>
                    <strong>Studio collection</strong> •{' '}
                    {playlist.tracks.length} songs • Original samples
                  </span>
                </div>
              </section>
              <section className="content-section">
                <div className="playlist-actions">
                  <IconButton
                    icon={
                      p.playing && playlist.tracks.includes(p.current?.id)
                        ? Pause
                        : Play
                    }
                    label={
                      p.playing && playlist.tracks.includes(p.current?.id)
                        ? `Pause ${playlist.title}`
                        : `Play ${playlist.title}`
                    }
                    className="playlist-play"
                    onClick={() =>
                      p.playing && playlist.tracks.includes(p.current?.id)
                        ? p.toggle()
                        : p.selectTrack(
                            playlistTracks(playlist)[0],
                            playlistTracks(playlist),
                          )
                    }
                  />
                  <span>Listen to the collection</span>
                </div>
                <TrackList tracks={playlistTracks(playlist)} />
              </section>
            </>
          )}
          {view === 'library' && (
            <section className="content-section">
              <span className="eyebrow">ALL YOUR MOMENTS, TOGETHER</span>
              <h1>Your Library</h1>
              <p className="muted">
                Six collections. A world of little escapes.
              </p>
              <button
                className="liked-banner"
                onClick={() => navigate('liked')}
              >
                <Heart size={25} fill="currentColor" />
                <span>
                  <strong>Liked Songs</strong>
                  <small>{likedTracks.length} saved tracks</small>
                </span>
                <ChevronRight />
              </button>
              <div className="playlist-grid library-grid">
                {playlists.map((item) => (
                  <PlaylistCard
                    key={item.id}
                    playlist={item}
                    onSelect={navigate}
                  />
                ))}
              </div>
            </section>
          )}
          {view === 'liked' && (
            <section className="content-section">
              <span className="eyebrow">YOUR COLLECTION</span>
              <h1>Liked Songs</h1>
              <p className="muted">
                {likedTracks.length} saved tracks • Stored on this device
              </p>
              {likedTracks.length ? (
                <div className="liked-tracks">
                  <TrackList tracks={likedTracks} />
                </div>
              ) : (
                <div className="empty-state">
                  <Music2 size={40} />
                  <h2>Your favorites belong here</h2>
                  <p>Tap the heart beside any track to save it.</p>
                  <button
                    className="green-button"
                    onClick={() => navigate('search')}
                  >
                    Find your favorites
                  </button>
                </div>
              )}
            </section>
          )}
          <footer className="main-footer">
            <Disc3 size={21} />
            <span>Made for listening. Built for learning.</span>
            <small>Unofficial Spotify replica • Original music</small>
          </footer>
        </main>
      </div>
      <PlayerBar />
    </>
  );
}
