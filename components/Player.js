import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import spotifyApi from "../lib/spotify";

const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const [clickSkip, setClickSkip] = useState(0);

  const fetchCurrentSong = () => {
    spotifyApi.getMyCurrentPlayingTrack().then((data) => {
      // console.log("Now playing: ", data);
      setCurrentTrackId(data.body?.item?.id);

      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        // console.log("Now playing: ", data.body);
        setIsPlaying(data.body?.is_playing);
      });
    });
  };

  const skipBack = () => {
    spotifyApi.skipToPrevious().then(() => {
      fetchCurrentSong();
    });
  };

  const skipNext = () => {
    spotifyApi.skipToNext().then(() => {
      fetchCurrentSong();
    });
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause().catch((err) => console.log(err));
        setIsPlaying(false);
      } else {
        spotifyApi.play().catch((err) => console.log(err));
        setIsPlaying(true);
      }
    });
  };

  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => console.log(err));
    }, 500),
    []
  );

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* left side */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline w-10 h-10"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />

        <div className="">
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0].name}</p>
        </div>
      </div>

      {/* center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />

        <RewindIcon onClick={skipBack} className="button" />

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}

        <FastForwardIcon onClick={skipNext} className="button" />

        <ReplyIcon className="button" />
      </div>

      {/* right */}
      <div className="flex items-center justify-end space-x-3 md:space-x-4 pr-5">
        <VolumeDownIcon
          className="button "
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          className="w-14 md:w-28"
          type="range"
          name=""
          id=""
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button "
        />
      </div>
    </div>
  );
};

export default Player;
