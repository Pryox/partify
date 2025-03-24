export type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
};

export type CurrentlyPlayingResponse = {
  song: SpotifyApi.TrackObjectFull | null;
  playlist: SpotifyApi.SinglePlaylistResponse | null;
};
