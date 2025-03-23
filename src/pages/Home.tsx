import { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import * as SpotifyTokenHelper from '../lib/spotifyTokenHelper';
import { NavLink } from 'react-router-dom';

export type HomeProps = {};

export function Home(props: HomeProps) {
  const {} = props;

  const spotifyApiHelper = new SpotifyWebApi();

  // State Definitions
  const [token, setToken] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

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

  // Event Handler
  const handleLogout = () => {
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('refresh_token');
    setToken(null);
  };

  return (
    <div className="h-full w-full bg-green-300">
      <p>This Site contains Home</p>
      <button onClick={handleLogout} className="hover:cursor-pointer">
        Logout
      </button>
      <NavLink to="/login">Login</NavLink>
      <button onClick={() => console.log(token)} className="hover:cursor-pointer">
        Log Token
      </button>
    </div>
  );
}
