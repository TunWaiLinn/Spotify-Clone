import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
  "user-read-email",
  "user-library-modify",
  "user-library-read",
  "user-read-recently-played",
  "user-top-read",
  "user-follow-read",
  "playlist-read-collaborative",
  "playlist-read-private",
  "streaming",
  "user-read-currently-playing",
  "user-modify-playback-state",
  "user-read-playback-state",
  "user-read-private",
].join(",");

const params = {
  scope: scopes,
};

const queryParamsString = new URLSearchParams(params);

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamsString.toString()}`;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default spotifyApi;

export { LOGIN_URL };
