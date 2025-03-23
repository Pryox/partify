import * as Helper from '../lib/helper';

export type LoginProps = {};

export function Login(props: LoginProps) {
  const {} = props;

  const authEndpoint = 'https://accounts.spotify.com/authorize';
  const clientID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = `${Helper.isProductionEnv() ? import.meta.env.VITE_PROD_APPLICATION_URL : import.meta.env.VITE_DEV_APPLICATION_URL}`;
  const responseType = 'code';
  const scope = 'user-read-currently-playing user-read-playback-state user-modify-playback-state';
  const state = Helper.generateRandomString(16);

  const loginUrl = `${authEndpoint}?client_id=${clientID}&response_type=${responseType}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#161616]">
      <div
        className="bg-black text-stone-200 h-100 w-100 flex flex-col text-center gap-2 justify-center items-center rounded-3xl"
        style={{ filter: 'drop-shadow(5px 5px 10px #000000)' }}
      >
        <h1 className="text-6xl font-bold">Partify.</h1>
        <button className="bg-[#18ac4d] hover:bg-[#1bc456] mt-14 h-16 rounded-full duration-100 hover:cursor-pointer">
          <a href={loginUrl} className="mx-10 font-bold">
            Login to Spotify
          </a>
        </button>
        <p className="text-xs mt-2">(You need Spotify Premium subscription to proceed)</p>
      </div>
    </div>
  );
}
