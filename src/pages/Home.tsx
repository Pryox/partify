import { NavLink } from 'react-router-dom';
import { useSpotifyToken } from '../hooks/useSpotifyToken';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import SpotifyLogo from '../assets/SpotifyLogo';
import { Button, Group } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { SongItem } from '../components/SongItem';
import { SongItemType } from '../lib/enums';
import * as SpotifyApiHelper from '../lib/spotifyApiHelper';
import { PlaylistItem } from '../components/PlaylistItem';
import { HomePage } from '../components/HomePage';
import { ProfileMenu } from '../components/ProfileMenu';
import { SearchComponent } from '../components/SearchComponent';

export type HomeProps = {
  refreshInterval: number;
};

export function Home(props: Readonly<HomeProps>) {
  const { refreshInterval } = props;

  const { token, resetToken } = useSpotifyToken();

  const API_CONFIG = {
    queueRefreshInterval: refreshInterval,
    userDataRefreshInterval: 60000,
    searchDebounceMs: 400
  };

  const { currentlyPlaying, userData, searchResult, performSearch, clearSearch, refreshQueue } = useSpotifyApi({
    token,
    ...API_CONFIG
  });

  // State Definitions

  // Event Handlers
  const handleEnqueue = async (id: string) => {
    if (!token) return;

    try {
      const success = await SpotifyApiHelper.addToQueue(token, id);

      if (success) {
        // Immediately refresh the queue to show the newly added song
        refreshQueue();

        notifications.show({
          autoClose: 3000,
          color: '#1DB954',
          icon: <IconCheck />,
          message: 'Song added to queue successfully!',
          withBorder: true,
          withCloseButton: true
        });
      } else {
        notifications.show({
          autoClose: 4000,
          color: 'red',
          message: 'Failed to add song to queue. Make sure Spotify is playing.',
          withBorder: true,
          withCloseButton: true
        });
      }
    } catch {
      notifications.show({
        autoClose: 4000,
        color: 'red',
        message: 'Error adding song to queue. Please try again.',
        withBorder: true,
        withCloseButton: true
      });
    }
  };

  const handleLogout = () => {
    resetToken();
    clearSearch();

    notifications.show({
      autoClose: 4000,
      color: '#1DB954',
      icon: <IconCheck />,
      message: 'Successfully logged out.',
      withBorder: true,
      withCloseButton: true
    });
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0a0a0a] max-h-screen">
      <header className="text-white flex flex-row h-20 py-2 px-4 border-b border-[#404040] relative">
        <div className="flex flex-row gap-3 justify-center items-center">
          <SpotifyLogo diameter={45} />
          <h1 className="text-4xl font-bold h-11">Partify.</h1>
        </div>

        {token && (
          <div className="flex-1 flex justify-center items-center mx-8 relative">
            <SearchComponent searchResult={searchResult} performSearch={performSearch} clearSearch={clearSearch} onEnqueue={handleEnqueue} />
          </div>
        )}

        <Group justify="flex-end" gap="xl" className={token ? 'shrink-0' : 'w-full'}>
          <a href="https://open.spotify.com" target="_blank" className="hover:underline text-[#1DB954] hover:text-[#1ed760] transition-colors">
            Open Spotify
          </a>
          {!token ? (
            <Button variant="gradient" gradient={{ from: '#1DB954', to: '#169c46', deg: 155 }} radius="xl" style={{ padding: '0' }}>
              <NavLink to="/login" className="h-full flex items-center justify-center px-5">
                Login
              </NavLink>
            </Button>
          ) : (
            <ProfileMenu userData={userData} onLogout={handleLogout} />
          )}
        </Group>
      </header>
      <div className="w-full flex flex-row gap-4 text-[#ffffff] h-full overflow-hidden">
        {token &&
          (currentlyPlaying?.song ? (
            <div className="flex flex-col gap-4 m-4 w-full">
              <div
                style={{ filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.5))' }}
                className="p-4 bg-[#181818] rounded-2xl flex flex-col gap-3 h-fit border border-[#404040]"
              >
                <div className="flex flex-row gap-2 mb-2">
                  <SpotifyLogo diameter={30} />
                  <h3 className="font-bold text-xl">Now playing</h3>
                </div>
                <SongItem song={currentlyPlaying.song as SpotifyApi.TrackObjectFull} type={SongItemType.Player} />
                {currentlyPlaying.playlist && <PlaylistItem playlist={currentlyPlaying.playlist} />}
              </div>
              {currentlyPlaying?.queue && (
                <div
                  style={{ filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.5))' }}
                  className="p-4 bg-[#181818] rounded-2xl flex flex-col gap-3 grow overflow-x-hidden border border-[#404040]"
                >
                  <h3 className="font-bold text-xl">Next Songs in the Queue:</h3>
                  <div className="scrollbar-thin scrollbar-track-[#181818] scrollbar-thumb-[#535353] hover:scrollbar-thumb-[#6a6a6a] flex flex-col gap-3 overflow-y-auto pr-1">
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
        {!token && <HomePage switchInterval={6000} />}
      </div>
    </div>
  );
}
