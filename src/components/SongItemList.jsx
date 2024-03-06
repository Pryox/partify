import React from "react";
import "../style.css";
import SongItem from "./SongItem";

const SongItemList = ({ songlist }) => {
  const renderSongs = () => {
    return songlist.map((song) => (
      <SongItem
        id="info-item"
        song={song}
        button={false}
        playingAnimation={false}
        queueFunction={null}
        imageUrl={song.album.images[0].url}
      />
    ));
  };

  return (
    <>
      {!!songlist ? (
        <div className="song-item-container">{renderSongs()}</div>
      ) : (
        <p id="loading">Loading . . .</p>
      )}
    </>
  );
};

export default SongItemList;
