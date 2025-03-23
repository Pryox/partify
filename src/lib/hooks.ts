import { useEffect, useState } from 'react';
import * as SpotifyTokenHelper from '../lib/spotifyTokenHelper';

/**
 * Custom Hook used for Token Handling with Spotify Web Api
 * @returns Object with current token and callback for resetting token
 */
export function useSpotifyToken() {
  // State Definitions
  const [token, setToken] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(65);

  // Side Effects
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let authorizationCode = null;

    if (urlParams.has('code')) {
      authorizationCode = urlParams.get('code');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    let accessToken = window.localStorage.getItem('access_token');

    if (accessToken) {
      setToken(accessToken);
    } else if (authorizationCode) {
      SpotifyTokenHelper.getAccessToken(authorizationCode).then((result) => {
        if (result) {
          accessToken = result.access_token;
          window.localStorage.setItem('refresh_token', result.refresh_token);
          window.localStorage.setItem('access_token', accessToken);

          setExpiresIn(result.expires_in);
          setToken(accessToken);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!token || !expiresIn) return;
    const timer = setTimeout(() => {
      const refreshToken = window.localStorage.getItem('refresh_token');
      if (refreshToken) {
        SpotifyTokenHelper.refreshAccessToken(refreshToken).then((result) => {
          if (result) {
            const newAccessToken = result.access_token;

            window.localStorage.setItem('access_token', newAccessToken);
            setExpiresIn(result.expires_in);
            setToken(newAccessToken);
          }
        });
      }
    }, (expiresIn - 60) * 1000);

    return () => clearTimeout(timer);
  }, [token, expiresIn]);

  const resetToken = () => {
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('refresh_token');

    setExpiresIn(null);
    setToken(null);
  };

  return { token, resetToken };
}
