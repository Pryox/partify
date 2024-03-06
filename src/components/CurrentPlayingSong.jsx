import React from "react";
import SpotifyLogo from "./SpotifyLogo";
import '../style.css';
import SongItem from "./SongItem/SongItem";
import PlaylistItem from "./SongItem/PlaylistItem";

const CurrentPlayingSong = ({ currentSong, currentPlaylist }) => {
    return (
        <div id="current-song-container">
            <div id="spotify">
                <SpotifyLogo diameter="30" />
                <h3>Now playing</h3>
            </div>
            {!!currentSong ? <>
                <SongItem song={currentSong} button={false} playingAnimation={true} queueFunction={null} imageUrl={currentSong?.album.images[0].url} />
                <PlaylistItem playlist={currentPlaylist} button={false} queueFunction={null} imageUrl={currentPlaylist?.images[0].url} />
            </>
            : <p id="loading">Loading . . .</p>}
        </div>
    );
}

export default CurrentPlayingSong;