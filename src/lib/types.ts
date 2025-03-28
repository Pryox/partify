export type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
};

export type CurrentlyPlayingResponse = {
  song: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull | null;
  playlist: SpotifyApi.SinglePlaylistResponse | null;
  queue: SpotifyApi.TrackObjectFull[] | SpotifyApi.EpisodeObjectFull[] | null;
};

export type QueueResponse = {
  item: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull | null;
  queue: SpotifyApi.TrackObjectFull[] | SpotifyApi.EpisodeObjectFull[];
};
