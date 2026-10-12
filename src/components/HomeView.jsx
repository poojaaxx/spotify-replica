import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { playlists, tracks } from '../data/catalog';
import PlaylistCard from './PlaylistCard';
import TrackList from './TrackList';

export default function HomeView({ navigate }) {
  const [category, setCategory] = useState('All');
  const visible = playlists.filter(
    (p) => category === 'All' || p.category === category,
  );
  return (
    <>
      <div className="category-tabs" aria-label="Playlist mood">
        {['All', 'Chill', 'Focus'].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={category === c ? 'active' : ''}
          >
            {c}
          </button>
        ))}
      </div>
      <section className="home-intro">
        <span className="eyebrow">A SOUNDTRACK FOR EVERY DAY</span>
        <h1>
          Music for your moment<span>.</span>
        </h1>
        <p>Press pause on the noise. Find something that feels like you.</p>
        <div className="quick-grid">
          {visible.slice(0, 4).map((p) => (
            <button key={p.id} onClick={() => navigate(p.id)}>
              <img src={p.cover} alt="" />
              <strong>{p.title}</strong>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      </section>
      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CURATED WITH CARE</span>
            <h2>Made for your everyday</h2>
          </div>
          <button className="text-button" onClick={() => navigate('library')}>
            Explore all <ChevronRight size={16} />
          </button>
        </div>
        <div className="playlist-grid">
          {visible.map((p) => (
            <PlaylistCard key={p.id} playlist={p} onSelect={navigate} />
          ))}
        </div>
      </section>
      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A LITTLE DISCOVERY</span>
            <h2>On repeat</h2>
          </div>
          <span className="subtle-label">Original instrumental samples</span>
        </div>
        <TrackList tracks={tracks.slice(0, 4)} />
      </section>
    </>
  );
}
