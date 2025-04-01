import { NavLink } from 'react-router-dom';
import { useSpotifyToken } from '../hooks/useSpotifyToken';
import { useEffect, useState } from 'react';
import SpotifyLogo from '../assets/SpotifyLogo';
import { Avatar, Button, Group } from '@mantine/core';
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
  const [userData, setUserData] = useState<SpotifyApi.CurrentUsersProfileResponse | null>(null);

  // Side Effects
  useEffect(() => {
    fetchSpotifyData(token);
    const interval = setInterval(() => {
      fetchSpotifyData(token);
    }, refreshInterval);

    return () => clearInterval(interval);
  });

  // Functions
  const fetchSpotifyData = (token: string | null) => {
    if (!token) return;

    Promise.all([SpotifyApiHelper.getCurrentlyPlaying(token), SpotifyApiHelper.getMe(token)]).then(([currentlyPlayingResult, userDataResult]) => {
      setCurrentlyPlaying(currentlyPlayingResult);
      setUserData(userDataResult);
    });
  };

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
    <div className="flex flex-col h-screen w-full bg-[#161616] max-h-screen">
      <header className="text-white flex flex-row h-20 py-2 px-4 border-b border-stone-600">
        <div className="flex flex-row gap-2 justify-center items-center">
          <SpotifyLogo diameter={45} />
          <h1 className="text-4xl font-bold h-11">Partify.</h1>
        </div>
        <Group justify="flex-end" className="w-full">
          {!token ? (
            <Button variant="gradient" gradient={{ from: '#18ac4d', to: 'teal', deg: 155 }} radius="xl" style={{ padding: '0' }}>
              <NavLink to="/login" className="h-full flex items-center justify-center px-5">
                Login
              </NavLink>
            </Button>
          ) : (
            <button
              className="flex flex-row items-center justify-center gap-2 border border-stone-100 rounded-full p-0.5 hover:cursor-pointer"
              onClick={handleLogout}
            >
              {userData && <p className="font-bold text-stone-100 mb-0.5 ml-3">{userData?.display_name ?? ''}</p>}
              <Avatar variant="outline" radius="xl" src={userData?.images?.[0].url} />
            </button>
          )}
        </Group>
      </header>
      <div className="p-4 w-full flex flex-row gap-4 text-stone-200 h-full overflow-hidden">
        {token &&
          (currentlyPlaying?.song ? (
            <div className="w-1/2 flex flex-col gap-4">
              <div style={{ filter: 'drop-shadow(2px 2px 5px #000000)' }} className="p-4 bg-[#1A202C] rounded-2xl flex flex-col gap-3 h-fit">
                <div className="flex flex-row gap-2 mb-2">
                  <SpotifyLogo diameter={30} />
                  <h3 className="font-bold text-xl">Now playing</h3>
                </div>
                <SongItem song={currentlyPlaying.song as SpotifyApi.TrackObjectFull} type={SongItemType.Player} />
                {currentlyPlaying.playlist && <PlaylistItem playlist={currentlyPlaying.playlist} />}
              </div>
              {currentlyPlaying?.queue && (
                <div
                  style={{ filter: 'drop-shadow(2px 2px 5px #000000)' }}
                  className="p-4 bg-[#1A202C] rounded-2xl flex flex-col gap-3 grow overflow-x-hidden"
                >
                  <h3 className="font-bold text-xl">Next Songs in the Queue:</h3>
                  <div style={{ scrollbarWidth: 'thin', msScrollbarBaseColor: 'transparent' }} className="flex flex-col gap-3 overflow-y-auto">
                    {currentlyPlaying.queue.map((queueItem, i) => (
                      <SongItem key={i} song={queueItem as SpotifyApi.TrackObjectFull} type={SongItemType.Queue} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <p className="text-3xl font-medium">Loading...</p>
            </div>
          ))}
      </div>
    </div>
  );
}
