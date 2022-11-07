import { getProviders, signIn } from "next-auth/react";
import React from "react";

const login = ({ providers }) => {
  return (
    <div className="flex flex-col justify-center items-center bg-black min-h-screen w-full">
      <img className="w-52 mb-5" src="https://links.papareact.com/9xl" alt="" />
      {Object.values(providers).map((provider) => (
        <div key={provider.id}>
          <button
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            className="bg-[#18D860] text-white p-5 rounded-full hover:bg-[#0bf163] hover:shadow-md"
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default login;

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
