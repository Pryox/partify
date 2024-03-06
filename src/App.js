import React from "react";
import { useEffect, useState, useRef } from "react";
import "./style.css";
import CurrentlyPlaying from "./components/CurrentlyPlaying";
import SpotifyLogo from "./components/SpotifyLogo";
import Queue from "./components/Queue";
import SongItem from "./components/SongItem";

//Spotify Web API credentials
//Client ID Prod: 07fcc0c7be2b4a2db69a663f8dd67b0e Dev: 6c76143fe7c34632a15eb0bb3d95e664
//Client Secret: 1f4f62a8eb8b45c5b6c0568c29986865

export default function App() {
  const clientID = "6c76143fe7c34632a15eb0bb3d95e664";
  const redirectUri = "http://localhost:4000";
  const authEndpoint = "https://accounts.spotify.com/authorize";
  const responseType = "token";
  const scope =
    "user-read-currently-playing user-read-playback-state user-modify-playback-state";

  const [token, setToken] = useState("");
  const [site, setSite] = useState("login");
  const [searchResult, setSearchResult] = useState([]);
  const [actSong, setActSong] = useState(null);
  const [actPlaylist, setActPlaylist] = useState(null);
  const [actPlaylistID, setActPlaylistID] = useState("");
  const [queue, setQueue] = useState([]);
  const searchKeyRef = useRef();

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);
    if (!!token) {
      setSite("index");
    }
  }, []);

  useEffect(() => {
    if (!!token) {
      Promise.all([getCurrentQueueData()]).then((result) => {
        if (!!result[0]) {
          setActPlaylistID(result[0]?.playlistUri?.split(":")[2]);
          setActSong(result[0]?.currentSong);
          setQueue(result[0]?.queue);
        }
      });

      //console.log(actSong);
    }
  });

  useEffect(() => {
    if (!!token) {
      Promise.all([getCurrentPlaylist()]).then((result) => {
        if (!!result[0]) {
          setActPlaylist(result[0]);
        }
      });

      console.log(actPlaylist);
    }
  }, [actPlaylistID]);

  const getCurrentQueueData = async () => {
    await sleep(1000);
    const result = await fetch("https://api.spotify.com/v1/me/player/queue", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(console.error);
    if (result.status === 200) {
      const data = await result.json();
      const playlistUri = await getCurrentPlayingContext();
      return {
        currentSong: data?.currently_playing,
        playlistUri: playlistUri,
        queue: data?.queue,
      };
    }
  };

  const getCurrentPlayingContext = async () => {
    const result = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).catch(console.error);
    if (result.status === 200) {
      const data = await result.json();
      return data?.context?.uri;
    }
  };

  const getCurrentPlaylist = async () => {
    const result = await fetch(
      `https://api.spotify.com/v1/playlists/${actPlaylistID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).catch(console.error);
    if (result.status === 200) {
      const data = await result.json();
      return data;
    }
  };

  const search = async (e) => {
    e.preventDefault();
    const searchKey = searchKeyRef.current.value;
    const result = await fetch(
      "https://api.spotify.com/v1/search?q=" +
        searchKey +
        "&type=track&limit=20",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await result.json();
    const songs = data?.tracks?.items;
    const foundSongs = [];

    if (!!songs) {
      songs.forEach((song) => {
        const addSong = {
          id: song.id,
          name: song.name,
          artists: song.artists,
          image: song.album.images[0],
        };
        foundSongs.push(addSong);
      });
    }
    setSearchResult(foundSongs);
  };

  const addToQueue = (songID) => {
    fetch(
      `https://api.spotify.com/v1/me/player/queue?uri=spotify:track:${songID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).catch(console.error);
  };

  const renderSongs = () => {
    if (!!searchResult) {
      return searchResult.map((song) => (
        <SongItem
          song={song}
          button={true}
          playingAnimation={false}
          queueFunction={addToQueue}
          imageUrl={song.image.url}
        />
      ));
    }
  };

  const logout = () => {
    setToken("");
    setSite("login");
    window.localStorage.removeItem("token");
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  switch (site) {
    case "login": {
      return (
        <div className="login">
          <div className="login-contents">
            <h1 id="login-title">Partify.</h1>
            {!token && (
              <a
                className="href-button"
                href={`${authEndpoint}?client_id=${clientID}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`}>
                Login to Spotify
              </a>
            )}
            <p id="login-text">
              (You need Spotify Premium subscription to proceed)
            </p>
          </div>
        </div>
      );
    }
    case "index": {
      return (
        <>
          <header className="index-header">
            <div className="name">
              <SpotifyLogo diameter="40px" />
              <h1 id="title-1">Partify.</h1>
            </div>
            <div className="menu">
              <button className="menu-button" onClick={logout}>
                Logout
              </button>
            </div>
          </header>
          <div id="search">
            <form className="search-form" onSubmit={search}>
              <input
                type="text"
                ref={searchKeyRef}
                placeholder="Search in Spotify..."
              />
              <button type={"submit"}>Go</button>
            </form>
          </div>
          <div id="content">
            <div id="current-information">
              <CurrentlyPlaying
                currentSong={actSong}
                currentPlaylist={actPlaylist}
              />
              <Queue queue={queue} />
            </div>
            <div id="search-result-container">{renderSongs()}</div>
          </div>
        </>
      );
    }
    default: {
      return (
        <div className="failToLoad">
          <p>Failed to load!</p>
        </div>
      );
    }
  }
}
