export type PlaylistItemProps = {
  playlist: SpotifyApi.SinglePlaylistResponse;
};

export function PlaylistItem(props: Readonly<PlaylistItemProps>) {
  const { playlist } = props;

  return (
    <div className="w-full h-fit rounded-2xl border border-stone-600 flex flex-row gap-3 px-3.5 py-3">
      <img alt="Song Cover" src={playlist.images?.[0]?.url ?? ''} width="64" height="64" />
      <div className="w-full flex flex-col gap-2 pt-1">
        <div className="flex flex-row gap-3 items-center">
          <img alt="Playlist Icon" src="../../public/playlist.png" width="15" height="15" />
          <h3 className="font-bold">{playlist.name}</h3>
        </div>
        {playlist.description ?? <p className="">{playlist.description}</p>}
      </div>
    </div>
  );
}
