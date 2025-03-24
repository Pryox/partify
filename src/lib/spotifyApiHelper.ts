import SpotifyWebApi from 'spotify-web-api-js';
import { CurrentlyPlayingResponse } from './types';

const spotifyWebApi = new SpotifyWebApi();

/**
 * Returns a Promise with the currently playing song in the spotify player
 * @param token Your access token
 * @returns A Promise with the currently playing song in the spotify player
 */
export async function getCurrentlyPlaying(token: string) {
  spotifyWebApi.setAccessToken(token);
  const result = await spotifyWebApi.getMyCurrentPlayingTrack();

  const playlistId = result.context?.uri?.split(':')[2];
  const playlist = await getPlaylist(token, playlistId);

  const output: CurrentlyPlayingResponse = {
    song: result.item,
    playlist: playlist
  };
  return output;
}

export async function getPlaylist(token: string, playlistId?: string) {
  if (!playlistId) return null;

  spotifyWebApi.setAccessToken(token);
  const result = await spotifyWebApi.getPlaylist(playlistId);
  return result;
}
