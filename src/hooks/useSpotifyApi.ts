import { useEffect, useState, useCallback, useRef } from 'react';
import * as SpotifyApiHelper from '../lib/spotifyApiHelper';
import { CurrentlyPlayingResponse } from '../lib/types';

interface UseSpotifyApiProps {
  token: string | null;
  queueRefreshInterval: number;
  userDataRefreshInterval: number;
  searchDebounceMs: number;
}

interface UseSpotifyApiReturn {
  currentlyPlaying: CurrentlyPlayingResponse | null;
  userData: SpotifyApi.CurrentUsersProfileResponse | null;
  searchResult: SpotifyApi.SearchResponse | null;
  performSearch: (query: string) => void;
  clearSearch: () => void;
  refreshQueue: () => void;
}

/**
 * Custom hook that manages Spotify API calls with optimized intervals to prevent rate limiting
 * Implements separation of concerns by handling different data types with appropriate refresh rates
 */
export function useSpotifyApi({ token, queueRefreshInterval, userDataRefreshInterval, searchDebounceMs }: UseSpotifyApiProps): UseSpotifyApiReturn {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlayingResponse | null>(null);
  const [userData, setUserData] = useState<SpotifyApi.CurrentUsersProfileResponse | null>(null);
  const [searchResult, setSearchResult] = useState<SpotifyApi.SearchResponse | null>(null);

  const queueIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userDataIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchQueueData = useCallback(async (accessToken: string) => {
    try {
      const result = await SpotifyApiHelper.getCurrentlyPlaying(accessToken);
      setCurrentlyPlaying(result);
    } catch (error) {
      console.error('Error fetching queue data:', error);
    }
  }, []);

  const fetchUserData = useCallback(async (accessToken: string) => {
    try {
      const result = await SpotifyApiHelper.getMe(accessToken);
      setUserData(result);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  const performSearch = useCallback(
    (query: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (!token || !query.trim()) {
        setSearchResult(null);
        return;
      }

      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const result = await SpotifyApiHelper.search(token, query);
          setSearchResult(result);
        } catch (error) {
          console.error('Error performing search:', error);
          setSearchResult(null);
        }
      }, searchDebounceMs);
    },
    [token, searchDebounceMs]
  );

  const clearSearch = useCallback(() => {
    setSearchResult(null);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, []);

  const refreshQueue = useCallback(() => {
    if (token) {
      fetchQueueData(token);
    }
  }, [token, fetchQueueData]);

  useEffect(() => {
    if (!token) {
      setCurrentlyPlaying(null);
      if (queueIntervalRef.current) {
        clearInterval(queueIntervalRef.current);
      }
      return;
    }

    fetchQueueData(token);

    queueIntervalRef.current = setInterval(() => {
      fetchQueueData(token);
    }, queueRefreshInterval);

    return () => {
      if (queueIntervalRef.current) {
        clearInterval(queueIntervalRef.current);
      }
    };
  }, [token, queueRefreshInterval, fetchQueueData]);

  useEffect(() => {
    if (!token) {
      setUserData(null);
      if (userDataIntervalRef.current) {
        clearInterval(userDataIntervalRef.current);
      }
      return;
    }

    fetchUserData(token);

    userDataIntervalRef.current = setInterval(() => {
      fetchUserData(token);
    }, userDataRefreshInterval);

    return () => {
      if (userDataIntervalRef.current) {
        clearInterval(userDataIntervalRef.current);
      }
    };
  }, [token, userDataRefreshInterval, fetchUserData]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    currentlyPlaying,
    userData,
    searchResult,
    performSearch,
    clearSearch,
    refreshQueue
  };
}
