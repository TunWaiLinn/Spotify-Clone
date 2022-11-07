import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Center from "../components/Center";
import Player from "../components/Player";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session.expires < Date.now()) {
      signOut;
    }
  }, [session]);

  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify Clone</title>
        <meta
          name="description"
          content="Spotify clone created using Next.js"
        />
        <link
          rel="icon"
          href="https://www.freeiconspng.com/uploads/spotify-icon-18.png"
        ></link>
      </Head>

      <main className="flex">
        <Sidebar />

        <Center />
      </main>

      <div className="sticky bottom-0 text-white">
        <Player />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
