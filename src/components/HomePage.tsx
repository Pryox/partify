import { useEffect } from 'react';

export type HomePageProps = {
  switchInterval: number;
};

export function HomePage(props: Readonly<HomePageProps>) {
  const { switchInterval } = props;

  useEffect(() => {
    const interval = setInterval(() => {
      // change picture
    }, switchInterval);

    return () => clearInterval(interval);
  });

  return (
    <>
      <div className="w-1/3 bg-stone-700"></div>
      <div className="flex flex-col gap-4 justify-center items-center w-2/3">
        <h2 className="text-4xl font-medium">Welcome to Partify!</h2>
        <p>Please login to Spotify to see content.</p>
      </div>
    </>
  );
}
