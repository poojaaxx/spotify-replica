import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { tracks } from '../data/catalog';

const PlayerContext = createContext(null);
export const usePlayer = () => useContext(PlayerContext);

export default function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const requestRef = useRef(0);
  const [current, setCurrent] = useState(null);
  const [queue, setQueue] = useState(tracks);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.65);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('replica-liked') || '[]');
      return Array.isArray(saved) ? saved.filter(id => tracks.some(t => t.id === id)) : [];
    } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem('replica-liked', JSON.stringify(liked)); } catch { /* Saving is optional when storage is disabled. */ }
  }, [liked]);
  useEffect(() => { audioRef.current.volume = volume; audioRef.current.muted = muted; }, [volume, muted]);

  const safePlay = async () => {
    const request = ++requestRef.current;
    setError('');
    try { await audioRef.current.play(); }
    catch (err) {
      if (request !== requestRef.current || err.name === 'AbortError') return;
      setPlaying(false);
      setError(err.name === 'NotAllowedError' ? 'Your browser paused playback. Press Play to start listening.' : 'This sample could not play. Try again or choose another track.');
    }
  };
  const selectTrack = (track, list = tracks) => {
    setQueue(list.length ? list : [track]);
    if (current?.id !== track.id) {
      requestRef.current++;
      setCurrent(track);
      setTime(0);
      setDuration(track.duration);
      audioRef.current.src = track.src;
      audioRef.current.load();
    }
    safePlay();
  };
  const toggle = () => {
    if (!current) return selectTrack(queue[0] || tracks[0], queue);
    if (!audioRef.current.paused) { requestRef.current++; audioRef.current.pause(); }
    else safePlay();
  };
  const advance = (direction = 1) => {
    if (!current) return selectTrack(queue[0] || tracks[0], queue);
    if (direction < 0 && audioRef.current.currentTime > 3) return seek(0);
    const index = queue.findIndex(t => t.id === current.id);
    const offset = shuffle && direction > 0 && queue.length > 1 ? 1 + Math.floor(Math.random() * (queue.length - 1)) : direction;
    selectTrack(queue[(index + offset + queue.length) % queue.length] || tracks[0], queue);
  };
  const seek = value => {
    if (!current || !Number.isFinite(audioRef.current.duration)) return;
    const next = Math.max(0, Math.min(value, audioRef.current.duration));
    audioRef.current.currentTime = next;
    setTime(next);
  };
  const onEnded = () => {
    if (repeat) { seek(0); safePlay(); }
    else advance(1);
  };
  const toggleLike = id => setLiked(list => list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  return <PlayerContext.Provider value={{ current, queue, playing, time, duration, volume, muted, shuffle, repeat, error, liked, selectTrack, toggle, advance, seek, setVolume, setMuted, setShuffle, setRepeat, toggleLike }}>
    {children}
    <audio ref={audioRef} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={e => setTime(e.currentTarget.currentTime)} onLoadedMetadata={e => setDuration(Number.isFinite(e.currentTarget.duration) ? e.currentTarget.duration : 0)} onEnded={onEnded} onError={() => { setPlaying(false); setError('Audio unavailable. Please choose another track or retry playback.'); }}/>
  </PlayerContext.Provider>;
}
