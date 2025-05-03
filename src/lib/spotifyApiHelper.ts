import SpotifyWebApi from 'spotify-web-api-js';
import { CurrentlyPlayingResponse, QueueResponse } from './types';

const spotifyWebApi = new SpotifyWebApi();

/**
 * Returns a Promise with the currently playing song in the spotify player
 * @param token Your access token
 * @returns A Promise with the currently playing song, playlist and queue in the spotify player
 */
export async function getCurrentlyPlaying(token: string) {
  spotifyWebApi.setAccessToken(token);
  const queueResult = await getCurrentQueue(token);
  const currentlyPlayingResult = await spotifyWebApi.getMyCurrentPlayingTrack();

  const playlistId = currentlyPlayingResult.context?.uri?.split(':')[2];
  const playlist = await getPlaylist(token, playlistId);

  const output: CurrentlyPlayingResponse = {
    song: currentlyPlayingResult.item,
    playlist: playlist,
    queue: queueResult?.queue || null
  };
  return output;
}

/**
 * Returns a Promise with the current logged in users profile
 * @param token Your access token
 * @returns Promise of user profile
 */
export async function getMe(token: string) {
  spotifyWebApi.setAccessToken(token);
  const result = await spotifyWebApi.getMe();
  return result;
}

export async function getPlaylist(token: string, playlistId?: string) {
  if (!playlistId) return null;

  spotifyWebApi.setAccessToken(token);
  const result = await spotifyWebApi.getPlaylist(playlistId);
  return result;
}

export async function getCurrentQueue(token: string) {
  const url = 'https://api.spotify.com/v1/me/player/queue';
  const payload = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await fetch(url, payload);
  if (response.status === 200) {
    const result: QueueResponse = await response.json();
    return result;
  }
  return null;
}

export async function search(token: string, query: string) {
  if (!query) return null;

  spotifyWebApi.setAccessToken(token);
  const options: SpotifyApi.SearchForItemParameterObject = {
    limit: 20
  };

  const result = await spotifyWebApi.search(query, ['track'], options);
  return result;
}
