import { Clock3, Play, Pause, Heart } from 'lucide-react';
import { formatTime } from '../data/catalog';
import { usePlayer } from '../context/PlayerContext';
import IconButton from './IconButton';
export default function TrackList({ tracks }) {
  const p = usePlayer();
  return (
    <div className="track-table" role="table" aria-label="Tracks">
      <div className="track-head" role="row">
        <span role="columnheader">#</span>
        <span role="columnheader">Title</span>
        <span role="columnheader" className="album-column">
          Album
        </span>
        <span role="columnheader" className="save-column">
          Save
        </span>
        <span role="columnheader">
          <Clock3 size={17} aria-label="Duration" />
        </span>
      </div>
      {tracks.map((track, i) => (
        <div
          className={`track-row ${p.current?.id === track.id ? 'current-track' : ''}`}
          role="row"
          key={track.id}
        >
          <span role="cell">
            <button
              className="row-play"
              aria-label={`${p.current?.id === track.id && p.playing ? 'Pause' : 'Play'} ${track.title}`}
              onClick={() =>
                p.current?.id === track.id
                  ? p.toggle()
                  : p.selectTrack(track, tracks)
              }
            >
              <span className="track-number">{i + 1}</span>
              {p.current?.id === track.id && p.playing ? (
                <Pause size={15} />
              ) : (
                <Play size={15} />
              )}
            </button>
          </span>
          <div role="cell" className="track-title">
            <img src={track.cover} alt="" />
            <button
              className="track-name"
              onClick={() => p.selectTrack(track, tracks)}
              aria-label={`Listen to ${track.title} by ${track.artist}`}
            >
              <strong>{track.title}</strong>
              <small>{track.artist}</small>
            </button>
          </div>
          <span role="cell" className="album-column">
            {track.album}
          </span>
          <span role="cell">
            <IconButton
              icon={Heart}
              label={`${p.liked.includes(track.id) ? 'Unsave' : 'Save'} ${track.title}`}
              aria-pressed={p.liked.includes(track.id)}
              className={p.liked.includes(track.id) ? 'is-active' : ''}
              onClick={() => p.toggleLike(track.id)}
            />
          </span>
          <span role="cell" className="track-duration">
            {formatTime(track.duration)}
          </span>
        </div>
      ))}
    </div>
  );
}
