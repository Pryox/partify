import { useEffect, useState } from 'react';

export type HomeProps = {};

export function Home(props: HomeProps) {
  const {} = props;

  // State Definitions
  const [token, setToken] = useState<string | null>(null);

  // Side Effects
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      token =
        hash
          .substring(1)
          .split('&')
          .find((element) => element.startsWith('access_token'))
          ?.split('=')?.[1] ?? '';

      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }

    setToken(token);
  }, []);

  // Event Handler
  const handleLogout = () => {
    window.localStorage.removeItem('code_verifier');
  };

  return (
    <div className="h-8 w-full bg-green-300">
      <p>This Site contains Home</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
