import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState } from "../atoms/songAtom";
import useSpotify from "./useSpotify";

const useSongInfo = () => {
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const spotifyApi = useSpotify();

  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackId) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        )
          .then((res) => {
            return res.json();
          })
          .catch((err) => {
            console.log(err);
          });
        setSongInfo(trackInfo);
      }
    };

    fetchSongInfo();
  }, [currentTrackId, spotifyApi]);

  return songInfo;
};

export default useSongInfo;
