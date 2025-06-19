import { Button } from '@mantine/core';
import * as Helper from '../lib/helper';

export function Login() {
  const authEndpoint = 'https://accounts.spotify.com/authorize';
  const clientID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const codeChallenge = Helper.generateCodeChallenge(Helper.generateCodeVerifier());
  const redirectUri = `${Helper.isProductionEnv() ? import.meta.env.VITE_PROD_APPLICATION_URL : import.meta.env.VITE_DEV_APPLICATION_URL}`;
  const responseType = 'code';
  const scope = 'user-read-currently-playing user-read-playback-state user-modify-playback-state ';
  const state = Helper.generateState();

  const loginUrl = `${authEndpoint}?client_id=${clientID}&response_type=${responseType}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#0a0a0a]">
      <div
        className="bg-[#181818] border border-[#404040] text-[#ffffff] h-100 w-100 flex flex-col text-center gap-2 justify-center items-center rounded-3xl p-12"
        style={{ filter: 'drop-shadow(5px 5px 20px rgba(0, 0, 0, 0.7))' }}
      >
        <h1 className="text-6xl font-bold">Partify.</h1>
        <Button
          variant="gradient"
          gradient={{ from: '#1DB954', to: '#169c46', deg: 155 }}
          radius="xl"
          size="lg"
          style={{ padding: '0' }}
          className="mt-14 hover:scale-105 transition-transform"
        >
          <a href={loginUrl} className="h-full flex items-center justify-center font-bold px-10">
            Login to Spotify
          </a>
        </Button>
        <p className="text-xs mt-2 text-[#b3b3b3]">(You need Spotify Premium subscription to proceed)</p>
      </div>
    </div>
  );
}
