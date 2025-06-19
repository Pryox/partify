export type PlaylistItemProps = {
  playlist: SpotifyApi.SinglePlaylistResponse;
};

export function PlaylistItem(props: Readonly<PlaylistItemProps>) {
  const { playlist } = props;

  return (
    <div className="w-full h-fit rounded-2xl border border-[#404040] flex flex-row gap-3 px-3.5 py-3 hover:bg-[#282828] transition-colors">
      <img alt="Song Cover" src={playlist.images?.[0]?.url ?? ''} className="w-16 h-16 object-cover flex-shrink-0 rounded" />
      <div className="w-full flex flex-col gap-2 pt-1">
        <div className="flex flex-row gap-3 items-center">
          <img alt="Playlist Icon" src="/playlist.png" width="15" height="15" />
          <h3 className="font-bold text-[#ffffff]">{playlist.name}</h3>
        </div>
        {playlist.description && <p className="text-[#b3b3b3]">{playlist.description}</p>}
      </div>
    </div>
  );
}
