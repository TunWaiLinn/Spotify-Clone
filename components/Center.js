import { ChevronDownIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

const Center = () => {
  const spotifyApi = useSpotify();
  const playlistId = useRecoilValue(playlistIdState);
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log("Something went wrong!", err));
  }, [spotifyApi, playlistId]);

  return (
    <div className=" text-white flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center space-x-3 text-white bg-black opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2
        "
          onClick={signOut}
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt=""
          />
          <h2 className="">{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={` flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      >
        <img
          className="w-44 h-44 shadow-2xl"
          src={playlist?.images[0]?.url}
          alt=""
        />
        <div className="">
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name}
          </h1>
        </div>
      </section>

      <div className="">
        <Songs />
      </div>
    </div>
  );
};

export default Center;
