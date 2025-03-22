import * as Helper from '../lib/helper';

export type LoginProps = {};

export function Login(props: LoginProps) {
  const {} = props;

  const authEndpoint = 'https://accounts.spotify.com/authorize';
  const clientID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const codeChallenge = Helper.base64encode(Helper.encryptSha256(Helper.getCodeVerifier()));
  const codeChallengeMethod = 'S256';
  const redirectUri = `${Helper.isProductionEnv() ? import.meta.env.VITE_PROD_APPLICATION_URL : import.meta.env.VITE_DEV_APPLICATION_URL}`;
  const responseType = 'code';
  const scope = 'user-read-currently-playing user-read-playback-state user-modify-playback-state';

  const loginUrl = `${authEndpoint}?client_id=${clientID}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${scope}&code_challenge_method=${codeChallengeMethod}&code_challenge=${codeChallenge}`;

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
