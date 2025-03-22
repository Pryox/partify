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
          const refreshToken = result.refresh_token;
          console.log(result);

          window.localStorage.setItem('refresh_token', refreshToken);
          window.localStorage.setItem('access_token', accessToken);
          setToken(accessToken);
        }
      });
    }
  }, []);

  // Event Handler
  const handleLogout = () => {
    window.localStorage.removeItem('access_token');
  };

  return (
    <div className="h-8 w-full bg-green-300">
      <p>This Site contains Home</p>
      <button onClick={handleLogout} className="hover:cursor-pointer">
        Logout
      </button>
      <NavLink to="/login">Login</NavLink>
    </div>
  );
}
