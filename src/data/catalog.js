export const tracks = [
  ['Midnight Motion','Studio North','After Hours'], ['A Little Space','Paper Satellites','Soft Focus'], ['Sunlit Streets','The Sunday Club','Golden Hour'], ['Between the Lines','Blue Interior','Blue Room'], ['Take Your Time','Quiet Company','Slow Sunday'], ['Somewhere Green','Field Notes','Green Escape']
].map(([title,artist,album],i) => ({id:`t${i}`,title,artist,album,cover:`/covers/${i}.svg`,src:`/audio/${i}.wav`,duration:24}));
export const playlists = [
  ['after-hours','After Hours','Late nights. Low lights. A little escape.','Chill','#22685b',['t0','t3','t1']],
  ['soft-focus','Soft Focus','Find your flow, one gentle beat at a time.','Focus','#67418b',['t1','t4','t3']],
  ['golden-hour','Golden Hour','Warm sounds for the brighter side of life.','Chill','#a6532c',['t2','t5','t0']],
  ['blue-room','Blue Room','Instrumental moments to get lost in.','Focus','#315e89',['t3','t1','t5']],
  ['slow-sunday','Slow Sunday','No rush. Just good music and a slower morning.','Chill','#925965',['t4','t2','t1']],
  ['green-escape','Green Escape','Step outside. Let your mind wander.','Focus','#65702f',['t5','t4','t0']]
].map(([id,title,description,category,color,tracks],i) => ({id,title,description,category,color,tracks,cover:`/covers/${i}.svg`}));
export const playlistTracks = playlist => playlist.tracks.map(id => tracks.find(track => track.id === id));
export const filterTracks = (list,query) => list.filter(track => `${track.title} ${track.artist} ${track.album}`.toLowerCase().includes(query.trim().toLowerCase()));
export const formatTime = seconds => `${Math.floor((Number.isFinite(seconds) ? seconds : 0)/60)}:${String(Math.floor((Number.isFinite(seconds) ? seconds : 0)%60)).padStart(2,'0')}`;
