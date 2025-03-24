import { NavLink } from 'react-router-dom';
import { useSpotifyToken } from '../hooks/useSpotifyToken';
import { useEffect, useState } from 'react';
import SpotifyLogo from '../assets/SpotifyLogo';
import { Button, Group } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { SongItem } from '../components/SongItem';
import { SongItemType } from '../lib/enums';
import * as SpotifyApiHelper from '../lib/spotifyApiHelper';
import { PlaylistItem } from '../components/PlaylistItem';
import { CurrentlyPlayingResponse } from '../lib/types';

export type HomeProps = {
  refreshInterval: number;
};

export function Home(props: Readonly<HomeProps>) {
  const { refreshInterval } = props;

  const { token, resetToken } = useSpotifyToken();

  // State Definitions
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlayingResponse | null>(null);

  // Side Effects
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      SpotifyApiHelper.getCurrentlyPlaying(token).then((result) => {
        setCurrentlyPlaying(result);
      });
    }, refreshInterval);

    return () => clearInterval(interval);
  });

  // Event Handler
  const handleEnqueue = (id: string) => {
    console.log(id);
  };

  const handleLogout = () => {
    setCurrentlyPlaying(null);
    resetToken();

    notifications.show({
      autoClose: 4000,
      color: '#18ac4d',
      icon: <IconCheck />,
      message: 'Successfully logged out.',
      withBorder: true,
      withCloseButton: true
    });
  };

  return (
    <div className="h-full w-full bg-[#161616]">
      <header className="text-white flex flex-row h-20 bg-stone-800 py-2 px-4 shadow-black shadow-md">
        <div className="flex flex-row gap-2 justify-center items-center">
          <SpotifyLogo diameter={45} />
          <h1 className="text-4xl font-bold h-11">Partify.</h1>
        </div>
        <Group justify="flex-end" className="w-full">
          <p className={`${token ? 'text-green-600' : 'text-red-500'}`}>Token: {token ? 'Available' : 'Unavailable'}</p>
          {!token ? (
            <Button variant="gradient" gradient={{ from: '#18ac4d', to: 'teal', deg: 155 }} radius="xl" style={{ padding: '0' }}>
              <NavLink to="/login" className="h-full flex items-center justify-center px-5">
                Login
              </NavLink>
            </Button>
          ) : (
            <Button variant="outline" color="#18ac4d" radius="xl" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Group>
      </header>
      <div className="p-4 w-full flex flex-col gap-4 text-stone-200">
        {currentlyPlaying?.song && (
          <div style={{ filter: 'drop-shadow(2px 2px 5px #000000)' }} className="p-4 bg-[#1A202C] rounded-2xl flex flex-col gap-3">
            <div className="flex flex-row gap-2 mb-2">
              <SpotifyLogo diameter={30} />
              <h3 className="font-bold text-xl">Now playing</h3>
            </div>
            <SongItem onEnqueue={handleEnqueue} song={currentlyPlaying.song} type={SongItemType.Player} />
            {currentlyPlaying.playlist && <PlaylistItem playlist={currentlyPlaying.playlist} />}
          </div>
        )}
      </div>
    </div>
  );
}
