import { Search, X } from 'lucide-react';
import { filterTracks, tracks } from '../data/catalog';
import TrackList from './TrackList';
import IconButton from './IconButton';

export default function SearchView({ query, setQuery }) {
  const results = filterTracks(tracks, query);
  return <section className="content-section search-view"><span className="eyebrow">FIND YOUR NEXT FAVORITE</span><h1>Search</h1><label className="search-field"><Search size={22}/><span className="sr-only">Search tracks, artists, or albums</span><input autoFocus type="search" placeholder="What do you want to listen to?" value={query} onChange={e => setQuery(e.target.value)}/>{query && <IconButton icon={X} label="Clear search" onClick={() => setQuery('')}/>}</label><div className="section-heading"><h2>{query ? 'Search results' : 'Explore all tracks'}</h2><span className="muted" role="status">{results.length} {results.length === 1 ? 'track' : 'tracks'}</span></div>{results.length ? <TrackList tracks={results}/> : <div className="empty-state"><Search size={40}/><h2>No tracks found</h2><p>Try another title, artist, or album.</p></div>}</section>;
}
