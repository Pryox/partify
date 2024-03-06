import React from "react";
import './songitem.css';
import DisplayImageIcon from "../DisplayImageIcon/DisplayImageIcon";

const PlaylistItem = ({ playlist, button, queueFunction, imageUrl }) => {
    return (
        <div className="song-item">
          <DisplayImageIcon url={imageUrl} width ="64" height="64" />
          <div id="song-info">
            <div id="name-line">
              <img src={require("../../img/playlist.png")} width="15" height="15" />    
              <h3>{playlist?.name}</h3>
            </div>
            <p id="interpret">{playlist?.description}</p>
          </div>
          {button && <div id="add-button">
            <button onClick={() => queueFunction(playlist?.id)}>+</button>
          </div>}
        </div>
    );
}

export default PlaylistItem;