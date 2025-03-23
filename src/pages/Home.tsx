import SpotifyWebApi from 'spotify-web-api-js';
import { NavLink } from 'react-router-dom';
import { useSpotifyToken } from '../lib/hooks';
import { useEffect } from 'react';
import SpotifyLogo from '../assets/SpotifyLogo';
import { Button, Group } from '@mantine/core';

export type HomeProps = {
  refreshInterval: number;
};

export function Home(props: Readonly<HomeProps>) {
  const { refreshInterval } = props;

  const spotifyApiHelper = new SpotifyWebApi();
  const { token, resetToken } = useSpotifyToken();

  // Side Effects
  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        // TODO: fetch current data and set useStates
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  });

  // Event Handler
  const handleLogout = () => {
    resetToken();
  };

  return (
    <div className="h-full w-full bg-[#161616]">
      <header className="text-white flex flex-row h-20 bg-stone-800 p-2">
        <div className="flex flex-row gap-2">
          <SpotifyLogo diameter={45} />
          <h1 className="text-4xl font-bold">Partify.</h1>
        </div>
        <Group justify="flex-end" className="w-full">
          <p className={`${token ? 'text-green-600' : 'text-red-500'}`}>Token: {token ? 'Available' : 'Unavailable'}</p>
          <Button variant="gradient" gradient={{ from: '#18ac4d', to: 'teal', deg: 155 }} radius="xl">
            <NavLink to="/login">Login</NavLink>
          </Button>
          <Button variant="outline" color="#18ac4d" radius="xl" onClick={handleLogout}>
            Logout
          </Button>
        </Group>
      </header>
    </div>
  );
}
