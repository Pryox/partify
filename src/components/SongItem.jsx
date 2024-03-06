import React from "react";
import "../style.css";
import DisplayImageIcon from "./DisplayImageIcon";
import PlayingAnimation from "./PlayingAnimation";

const SongItem = ({
  song,
  button,
  playingAnimation,
  queueFunction,
  imageUrl,
}) => {
  const renderArtists = (artists) => {
    let artistString = "";
    artists?.forEach((artist) => {
      artistString += artist.name + ", ";
    });
    artistString = artistString.slice(0, artistString.length - 2);

    return <p id="interpret">{artistString}</p>;
  };

  return (
    <div className="song-item">
      <DisplayImageIcon url={imageUrl} width="64" height="64" />
      <div id="song-info">
        {playingAnimation ? (
          <div id="name-line">
            <PlayingAnimation />
            <h3>{song.name}</h3>
          </div>
        ) : (
          <h3>{song.name}</h3>
        )}
        {renderArtists(song.artists)}
      </div>
      {button && (
        <button id="add-button" onClick={() => queueFunction(song.id)}>
          +
        </button>
      )}
    </div>
  );
};

export default SongItem;
