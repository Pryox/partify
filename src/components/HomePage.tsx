import { Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export type HomePageProps = {
  switchInterval: number;
};

export function HomePage(props: Readonly<HomePageProps>) {
  const { switchInterval } = props;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = ['/partify_home_1.png', '/partify_home_2.png', '/partify_home_3.png'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, switchInterval);

    return () => clearInterval(interval);
  }, [switchInterval, images.length]);

  return (
    <>
      <div className="w-1/3 bg-[#0a0a0a] border-r border-[#404040] relative overflow-hidden">
        {images.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={image} alt={`Partify showcase ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 justify-center items-center w-2/3">
        <h2 className="text-6xl font-medium text-[#ffffff]">Welcome to Partify!</h2>
        <p className="text-[#b3b3b3] text-xl">Please login to Spotify to see content.</p>
        <Button variant="gradient" gradient={{ from: '#1DB954', to: '#169c46', deg: 155 }} radius="xl" style={{ padding: '0' }} size="xl">
          <NavLink to="/login" className="h-full flex items-center justify-center px-5 w-36">
            Login
          </NavLink>
        </Button>
      </div>
    </>
  );
}
