import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
  ],

  //secret
  secret: process.env.JWT_SECRET,

  //pages
  pages: {
    signIn: "/login",
  },

  //callbacks
  callbacks: {
    async jwt({ token, account, user }) {
      // initial signIn
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_at * 1000,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log("EXISTING TOKEN IS VALID");
        return token;
      }

      // Access token has expired, try to update it
      console.log("EXISTING TOKEN HAS EXPIRED, REFRESHING");
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.refreshToken = token.refreshToken;
      session.user.accessToken = token.accessToken;
      session.user.username = token.username;

      return session;
    },
  },
});
