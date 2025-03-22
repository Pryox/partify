export async function getAccessToken(clientId: string, clientSecret: string) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grand_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}

export const getNowPlaying = async (accessToken: string) => {
  return fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export async function getNowPlayingItem(accessToken: string) {
  const response = await getNowPlaying(accessToken);
  if (response.status === 204 || response.status > 400) {
    return false;
  }

  const song = await response.json();
  const albumImageUrl = song.item.album.images[0].url;
  const artist = song.item.artists.map((_artist: any) => _artist.name).join(', ');
  const isPlaying = song.is_playing;
  const songUrl = song.item.external_urls.spotify;
  const title = song.item.name;

  return {
    albumImageUrl,
    artist,
    isPlaying,
    songUrl,
    title
  };
}
