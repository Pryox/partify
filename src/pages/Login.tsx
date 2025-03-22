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
    <div className="">
      <div className="">
        <h1>Partify.</h1>
        <button className="bg-green-300">
          <a href={loginUrl}>Login to Spotify</a>
        </button>
        <p className="">(You need Spotify Premium subscription to proceed)</p>
      </div>
    </div>
  );
}
