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
      <div className="w-1/3 bg-[#181818] border-r border-[#404040]"></div>
      <div className="flex flex-col gap-4 justify-center items-center w-2/3">
        <h2 className="text-4xl font-medium text-[#ffffff]">Welcome to Partify!</h2>
        <p className="text-[#b3b3b3]">Please login to Spotify to see content.</p>
      </div>
    </>
  );
}
