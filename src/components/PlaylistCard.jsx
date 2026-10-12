import { ArrowUpRight } from 'lucide-react';
export default function PlaylistCard({ playlist, onSelect }) {
  return (
    <button className="playlist-card" onClick={() => onSelect(playlist.id)}>
      <div className="card-art">
        <img
          src={playlist.cover}
          alt={`${playlist.title} original geometric cover artwork`}
        />
        <span className="card-open">
          <ArrowUpRight size={22} />
        </span>
      </div>
      <strong>{playlist.title}</strong>
      <p>{playlist.description}</p>
    </button>
  );
}
