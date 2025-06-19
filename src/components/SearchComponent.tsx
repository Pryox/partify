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

  return (
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
                onClick={() => onEnqueue(track.id)}
                className="flex items-center justify-center w-8 h-8 bg-[#18ac4d] hover:bg-[#40e479] rounded-full transition-colors cursor-pointer"
              >
                <IconPlus size={16} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
