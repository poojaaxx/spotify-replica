import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { tracks, playlists, playlistTracks, filterTracks, formatTime } from '../src/data/catalog.js';

test('search matches titles, artists, and albums without case or whitespace sensitivity', () => {
  assert.equal(filterTracks(tracks, '  MIDNIGHT  ')[0].id, 't0');
  assert.equal(filterTracks(tracks, 'Paper Satellites')[0].id, 't1');
  assert.equal(filterTracks(tracks, 'Golden Hour')[0].id, 't2');
  assert.equal(filterTracks(tracks, '').length, tracks.length);
  assert.deepEqual(filterTracks(tracks, 'unknown song'), []);
});
test('all playlists resolve tracks in the specified order and all local assets exist', () => {
  for (const p of playlists) assert.deepEqual(playlistTracks(p).map(t => t.id), p.tracks);
  for (const t of tracks) for (const path of [t.cover, t.src]) assert.ok(existsSync(`public${path}`), path);
});
test('playback time handles minute boundaries and unavailable metadata', () => {
  assert.equal(formatTime(24.8), '0:24');
  assert.equal(formatTime(65), '1:05');
  assert.equal(formatTime(NaN), '0:00');
  assert.equal(formatTime(Infinity), '0:00');
});
