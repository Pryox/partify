import { NavLink } from 'react-router-dom';
import { useSpotifyToken } from '../hooks/useSpotifyToken';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { useState } from 'react';
import SpotifyLogo from '../assets/SpotifyLogo';
import { Avatar, Button, Group, TextInput } from '@mantine/core';
import { IconCheck, IconSearch, IconPlus } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { SongItem } from '../components/SongItem';
import { SongItemType } from '../lib/enums';
import * as SpotifyApiHelper from '../lib/spotifyApiHelper';
import { PlaylistItem } from '../components/PlaylistItem';
import { HomePage } from '../components/HomePage';

export type HomeProps = {
  refreshInterval: number;
};

export function Home(props: Readonly<HomeProps>) {
  const { refreshInterval } = props;

  const { token, resetToken } = useSpotifyToken();

  const API_CONFIG = {
    queueRefreshInterval: refreshInterval,
    userDataRefreshInterval: 20000,
    searchDebounceMs: 500
  };

  const { currentlyPlaying, userData, searchResult, performSearch, clearSearch } = useSpotifyApi({
    token,
    ...API_CONFIG
  });

  // State Definitions
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  // Event Handlers
  const handleEnqueue = async (id: string) => {
    if (!token) return;

    try {
      const success = await SpotifyApiHelper.addToQueue(token, id);

      if (success) {
        notifications.show({
          autoClose: 3000,
          color: '#18ac4d',
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
    setSearchQuery('');
    setShowSearchResults(false);

    notifications.show({
      autoClose: 4000,
      color: '#18ac4d',
      icon: <IconCheck />,
      message: 'Successfully logged out.',
      withBorder: true,
      withCloseButton: true
    });
  };

  // Optimized search handler with debouncing
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      clearSearch();
      setShowSearchResults(false);
      return;
    }

    // Use debounced search from the hook
    performSearch(query);
    setShowSearchResults(true);
  };

  const handleSearchFocus = () => {
    if (searchResult && searchQuery.trim()) {
      setShowSearchResults(true);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };

  // TODO: logout menu
  return (
    <div className="flex flex-col h-screen w-full bg-[#161616] max-h-screen">
      <header className="text-white flex flex-row h-20 py-2 px-4 border-b border-stone-600 relative">
        <div className="flex flex-row gap-3 justify-center items-center">
          <SpotifyLogo diameter={45} />
          <h1 className="text-4xl font-bold h-11">Partify.</h1>
        </div>

        {token && (
          <div className="flex-1 flex justify-center items-center mx-8 relative">
            <div className="relative w-full max-w-md">
              <TextInput
                placeholder="Search for Songs..."
                value={searchQuery}
                onChange={(event) => handleSearch(event.currentTarget.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                leftSection={<IconSearch size={16} color="#161616" />}
                radius="xl"
                className="w-full"
                styles={{
                  input: {
                    backgroundColor: '#18ac4d',
                    borderColor: '#4B4B4B',
                    color: 'white',
                    '&:focus': {
                      borderColor: '#18ac4d'
                    }
                  }
                }}
              />

              {showSearchResults && searchResult?.tracks?.items && searchResult.tracks.items.length > 0 && (
                <div className="scrollbar-thin scrollbar-track-[#1A202C] scrollbar-thumb-[#4B4B4B] absolute top-full left-0 right-0 mt-2 bg-[#1A202C] border border-[#4B4B4B] rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchResult.tracks.items.map((track) => (
                    <div key={track.id} className="flex items-center gap-3 p-3 hover:bg-[#2D3748] border-b border-[#4B4B4B] last:border-b-0">
                      <img
                        src={track.album.images[2]?.url || track.album.images[1]?.url || track.album.images[0]?.url}
                        alt={track.album.name}
                        className="w-12 h-12 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{track.name}</p>
                        <p className="text-stone-400 text-sm truncate">{track.artists.map((artist) => artist.name).join(', ')}</p>
                      </div>
                      <button
                        onClick={() => handleEnqueue(track.id)}
                        className="flex items-center justify-center w-8 h-8 bg-[#18ac4d] hover:bg-[#40e479] rounded-full transition-colors cursor-pointer"
                      >
                        <IconPlus size={16} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <Group justify="flex-end" gap="xl" className={token ? 'shrink-0' : 'w-full'}>
          <a href="https://open.spotify.com" target="_blank" className="hover:underline text-[#18ac4d] hover:text-[#40e479]">
            Open Spotify
          </a>
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
      <div className="w-full flex flex-row gap-4 text-stone-200 h-full overflow-hidden">
        {token &&
          (currentlyPlaying?.song ? (
            <div className="flex flex-col gap-4 m-4 w-full">
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
                  <div className="scrollbar-thin scrollbar-track-[#1A202C] scrollbar-thumb-[#4B4B4B] flex flex-col gap-3 overflow-y-auto pr-1">
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
