import React from "react";
import "../style.css";
import SongItemList from "./SongItemList.jsx";

const Queue = ({ queue }) => {
  return (
    <div className="queue-container">
      <h3>Next Songs in the Queue:</h3>
      <SongItemList songlist={queue} />
    </div>
  );
};

export default Queue;
