import * as Helper from './helper';
import { AccessTokenResponse } from './types';

/**
 * Gets access Data Object from Spotify Api
 * @param authorizationCode Auth code from previous step
 * @returns an AccessTokenResponse containing access data
 */
export async function getAccessToken(authorizationCode: string) {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET as string;
  const redirectUri = `${Helper.isProductionEnv() ? import.meta.env.VITE_PROD_APPLICATION_URL : import.meta.env.VITE_DEV_APPLICATION_URL}`;
  const encodedCredentials = btoa(`${clientId}:${clientSecret}`);

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${encodedCredentials}`
  };

  const body = new URLSearchParams();
  body.append('grant_type', 'authorization_code');
  body.append('code', authorizationCode);
  body.append('redirect_uri', redirectUri);

  const url = 'https://accounts.spotify.com/api/token';
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: body.toString()
  });

  if (response.status === 200) {
    const result = await response?.json();
    return (result as AccessTokenResponse) ?? null;
  }
  return null;
}

/**
 * Refreshes the access token using the refresh token
 * @param refreshToken The refresh token from the previous step
 * @returns An AccessTokenResponse containing the new access data
 */
export async function refreshAccessToken(refreshToken: string) {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET as string;
  const encodedCredentials = btoa(`${clientId}:${clientSecret}`);

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${encodedCredentials}`
  };

  const body = new URLSearchParams();
  body.append('grant_type', 'refresh_token');
  body.append('refresh_token', refreshToken);

  const url = 'https://accounts.spotify.com/api/token';
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: body.toString()
  });

  if (response.status === 200) {
    const result = await response?.json();
    return (result as AccessTokenResponse) ?? null;
  }
  return null;
}
