import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Heart,
  Music2,
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { formatTime } from '../data/catalog';
import IconButton from './IconButton';

export default function PlayerBar() {
  const p = usePlayer();
  return (
    <footer className="player-bar" aria-label="Now playing">
      <div className="now-playing">
        {p.current ? (
          <img src={p.current.cover} alt={`${p.current.album} cover`} />
        ) : (
          <span className="idle-cover">
            <Music2 size={24} />
          </span>
        )}
        <div>
          <strong>{p.current?.title || 'Your next favorite awaits'}</strong>
          <small>
            {p.current?.artist || 'Pick a track to start listening'}
          </small>
        </div>
        {p.current && (
          <IconButton
            icon={Heart}
            label={
              p.liked.includes(p.current.id)
                ? 'Remove current track from Liked Songs'
                : 'Save current track to Liked Songs'
            }
            aria-pressed={p.liked.includes(p.current.id)}
            className={p.liked.includes(p.current.id) ? 'is-active' : ''}
            onClick={() => p.toggleLike(p.current.id)}
          />
        )}
      </div>
      <div className="player-center">
        <div className="transport">
          <IconButton
            icon={Shuffle}
            label="Shuffle"
            aria-pressed={p.shuffle}
            className={p.shuffle ? 'is-active' : ''}
            onClick={() => p.setShuffle(!p.shuffle)}
          />
          <IconButton
            icon={SkipBack}
            label="Previous track"
            disabled={!p.current}
            onClick={() => p.advance(-1)}
          />
          <IconButton
            icon={p.playing ? Pause : Play}
            label={p.playing ? 'Pause' : 'Play'}
            className="primary-play"
            onClick={p.toggle}
          />
          <IconButton
            icon={SkipForward}
            label="Next track"
            disabled={!p.current}
            onClick={() => p.advance(1)}
          />
          <IconButton
            icon={Repeat}
            label="Repeat track"
            aria-pressed={p.repeat}
            className={p.repeat ? 'is-active' : ''}
            onClick={() => p.setRepeat(!p.repeat)}
          />
        </div>
        <div className="progress">
          <span>{formatTime(p.time)}</span>
          <input
            type="range"
            aria-label="Seek playback"
            min="0"
            max={p.duration || 24}
            step="0.1"
            value={Math.min(p.time, p.duration || 24)}
            disabled={!p.current}
            onChange={(e) => p.seek(Number(e.target.value))}
            style={{
              '--progress': `${p.duration ? (p.time / p.duration) * 100 : 0}%`,
            }}
          />
          <span>{formatTime(p.duration)}</span>
        </div>
      </div>
      <div className="volume-controls">
        <span className="sample-badge">ORIGINAL AUDIO</span>
        <IconButton
          icon={p.muted || !p.volume ? VolumeX : Volume2}
          label={p.muted ? 'Unmute' : 'Mute'}
          onClick={() => p.setMuted(!p.muted)}
        />
        <input
          type="range"
          aria-label="Volume"
          min="0"
          max="1"
          step="0.01"
          value={p.muted ? 0 : p.volume}
          onChange={(e) => {
            p.setMuted(false);
            p.setVolume(Number(e.target.value));
          }}
          style={{ '--progress': `${(p.muted ? 0 : p.volume) * 100}%` }}
        />
      </div>
      {p.error && (
        <p className="playback-error" role="alert">
          {p.error}
        </p>
      )}
    </footer>
  );
}
