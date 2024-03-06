import React from "react";
import './queue.css';
import SongItem from "../SongItem/SongItem.jsx";
import SongItemList from "../SongItemList/SongItemList.jsx";

const Queue = ({ queue }) => {
    return (
        <div className="queue-container">
            <div className="title">
                <h3>Next Songs in the Queue:</h3>
            </div>
            <SongItemList songlist={queue} />
        </div>
    );
}

export default Queue;