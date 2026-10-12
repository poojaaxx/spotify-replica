import { Clock3 } from 'lucide-react';
import { formatTime } from '../data/catalog';
export default function TrackList({tracks}) {
  return <div className="track-table"><div className="track-head"><span>#</span><span>Title</span><span className="album-column">Album</span><span><Clock3 size={17} aria-label="Duration"/></span></div>{tracks.map((track,i) => <div className="track-row" key={track.id}><span className="track-number">{i+1}</span><div className="track-title"><img src={track.cover} alt=""/><span><strong>{track.title}</strong><small>{track.artist}</small></span></div><span className="album-column">{track.album}</span><span className="track-duration">{formatTime(track.duration)}</span></div>)}</div>;
}
