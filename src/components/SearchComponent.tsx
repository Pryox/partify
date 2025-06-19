import { useState } from 'react';
import { TextInput } from '@mantine/core';
import { IconSearch, IconPlus } from '@tabler/icons-react';

interface SearchComponentProps {
  searchResult: SpotifyApi.SearchResponse | null;
  performSearch: (query: string) => void;
  clearSearch: () => void;
  onEnqueue: (id: string) => void;
}

export function SearchComponent({ searchResult, performSearch, clearSearch, onEnqueue }: SearchComponentProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [touchedItem, setTouchedItem] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      clearSearch();
      setShowSearchResults(false);
      return;
    }

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

  const handleEnqueue = (id: string) => {
    onEnqueue(id);
    setSearchQuery('');
    clearSearch();
  };

  // Touch event handlers for better tablet experience
  const handleTouchStart = (trackId: string) => {
    setTouchedItem(trackId);
  };

  const handleTouchEnd = () => {
    setTouchedItem(null);
  };

  const handleTouchCancel = () => {
    setTouchedItem(null);
  };

  return (
    <div className="relative w-full max-w-md">
      <TextInput
        placeholder="Search for Songs..."
        value={searchQuery}
        onChange={(event) => handleSearch(event.currentTarget.value)}
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
        leftSection={<IconSearch size={16} color="#6a6a6a" />}
        radius="xl"
        className="w-full"
        styles={{
          input: {
            backgroundColor: '#181818',
            borderColor: '#404040',
            color: '#ffffff',
            '&:focus': {
              borderColor: '#1DB954',
              backgroundColor: '#181818'
            },
            '&::placeholder': {
              color: '#b3b3b3'
            }
          }
        }}
      />

      {showSearchResults && searchResult?.tracks?.items && searchResult.tracks.items.length > 0 && (
        <div className="scrollbar-thin scrollbar-track-[#181818] scrollbar-thumb-[#535353] hover:scrollbar-thumb-[#6a6a6a] absolute top-full left-0 right-0 mt-2 bg-[#181818] border border-[#404040] rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          {searchResult.tracks.items.map((track) => (
            <div
              key={track.id}
              className={`flex items-center gap-3 p-3 hover:bg-[#282828] border-b border-[#404040] last:border-b-0 transition-colors select-none ${
                touchedItem === track.id ? 'bg-[#282828] scale-[0.98]' : ''
              }`}
              onTouchStart={() => handleTouchStart(track.id)}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchCancel}
            >
              <img
                src={track.album.images[2]?.url || track.album.images[1]?.url || track.album.images[0]?.url}
                alt={track.album.name}
                className="w-12 h-12 rounded pointer-events-none"
              />
              <div className="flex-1 min-w-0 pointer-events-none">
                <p className="text-[#ffffff] font-medium truncate">{track.name}</p>
                <p className="text-[#b3b3b3] text-sm truncate">{track.artists.map((artist) => artist.name).join(', ')}</p>
              </div>
              <button
                onClick={() => handleEnqueue(track.id)}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  e.currentTarget.style.transform = 'scale(0.9)';
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                onTouchCancel={(e) => {
                  e.stopPropagation();
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                className="flex items-center justify-center w-10 h-10 bg-[#1DB954] hover:bg-[#1ed760] active:bg-[#169c46] rounded-full transition-all cursor-pointer touch-manipulation"
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                <IconPlus size={18} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
