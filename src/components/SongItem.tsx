import PlayingAnimation from '../assets/PlayingAnimation';
import { SongItemType } from '../lib/enums';
import { ActionIcon } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

export type SongItemProps = {
  onEnqueue?: (id: string) => void;
  song: SpotifyApi.TrackObjectFull;
  type: SongItemType;
};

export function SongItem(props: Readonly<SongItemProps>) {
  const { onEnqueue, song, type } = props;

  const artistNames: string[] = [];
  song.artists.forEach((artist) => artistNames.push(artist.name));
  const artistString = artistNames.join(', ');

  // Event Handler
  const handleEnqueue = () => {
    if (onEnqueue) onEnqueue(song.id);
  };

  return (
    <div className="w-full h-fit rounded-2xl border border-stone-600 flex flex-row gap-3 px-3.5 py-3">
      <img alt="Song Cover" src={song.album.images?.[0]?.url ?? ''} width="64" height="64" />
      <div className="w-full flex flex-col gap-2 pt-1">
        <div className="flex flex-row gap-3 items-center">
          {type === SongItemType.Player && <PlayingAnimation />}
          {type === SongItemType.Playlist && <img alt="Playlist Icon" src="../../public/playlist.png" width="15" height="15" />}
          <h3 className="font-bold">{song.name}</h3>
        </div>
        <p className="">{artistString}</p>
      </div>
      {type === SongItemType.Queue && onEnqueue && (
        <ActionIcon
          variant="gradient"
          size="xl"
          aria-label="Gradient action icon"
          gradient={{ from: '#18ac4d', to: 'teal', deg: 155 }}
          onClick={handleEnqueue}
        >
          <IconPlus />
        </ActionIcon>
      )}
    </div>
  );
}
