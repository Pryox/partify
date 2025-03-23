import SpotifyWebApi from 'spotify-web-api-js';
import { NavLink } from 'react-router-dom';
import { useSpotifyToken } from '../lib/hooks';

export type HomeProps = {};

export function Home(props: HomeProps) {
  const {} = props;

  const spotifyApiHelper = new SpotifyWebApi();
  const { token, resetToken } = useSpotifyToken();

  // Event Handler
  const handleLogout = () => {
    resetToken();
  };

  return (
    <div className="h-full w-full bg-green-300">
      <p>This Site contains Home</p>
      <button onClick={handleLogout} className="hover:cursor-pointer">
        Logout
      </button>
      <NavLink to="/login">Login</NavLink>
      <button onClick={() => console.log(token)} className="hover:cursor-pointer">
        Log Token
      </button>
    </div>
  );
}
