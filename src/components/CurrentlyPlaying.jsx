import React from "react";
import SpotifyLogo from "./SpotifyLogo";
import "../style.css";
import SongItem from "./SongItem";
import PlaylistItem from "./PlaylistItem";

const CurrentlyPlaying = ({ currentSong, currentPlaylist }) => {
  return (
    <div id="currently-playing-container">
      <div id="spotify">
        <SpotifyLogo diameter="30" />
        <h3>Now playing</h3>
      </div>
      {!!currentSong ? (
        <>
          <SongItem
            id="info-item"
            song={currentSong}
            button={false}
            playingAnimation={true}
            queueFunction={null}
            imageUrl={currentSong?.album.images[0].url}
          />
          {!!currentPlaylist && (
            <PlaylistItem
              id="info-item"
              playlist={currentPlaylist}
              button={false}
              queueFunction={null}
              imageUrl={currentPlaylist?.images[0].url}
            />
          )}
        </>
      ) : (
        <p id="loading">Loading . . .</p>
      )}
    </div>
  );
};

export default CurrentlyPlaying;
