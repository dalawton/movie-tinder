'use client';

import { useState } from 'react';
import { useSprings, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import MovieCard from './MovieCard';

type Movie = {
  Title: string;
  Year: string;
  Poster: string;
  imdbID: string;
};

export default function SwipeableCard({
  movies,
  onSwipe,
}: {
  movies: Movie[];
  onSwipe: (dir: 'left' | 'right', movie: Movie) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [springs, api] = useSprings(movies.length, i => ({
    x: 0,
    scale: 1,
    display: 'block',
  }));

  const handleSwipe = (dir: 'left' | 'right') => {
    if (currentIndex >= movies.length) return;
    const movie = movies[currentIndex];
    const direction = dir === 'left' ? -1 : 1;

    // Animate the card off-screen
    api.start(i => {
      if (i !== currentIndex) return;
      return {
        x: (200 + window.innerWidth) * direction,
        scale: 1,
        display: 'none',
      };
    });

    onSwipe(dir, movie);
    setCurrentIndex(prev => prev + 1);
  };

  const bind = useDrag(
    ({ args: [index], down, movement: [mx], direction: [xDir], velocity: [vx] }) => {
      const trigger = Math.abs(vx) > 0.2;
      const dir = xDir < 0 ? -1 : 1;

      if (!down && trigger) {
        handleSwipe(dir === 1 ? 'right' : 'left');
      } else {
        api.start(i => {
          if (i !== index) return;
          return {
            x: down ? mx : 0,
            scale: down ? 1.1 : 1,
            display: 'block',
          };
        });
      }
    }
  );

  return (
    <>
      <div className="relative w-[300px] h-[450px] mx-auto mt-10">
        {springs.map(({ x, scale, display }, i) => (
          <animated.div
            key={movies[i].imdbID}
            style={{
              display,
              transform: x.to(x => `translateX(${x}px)`),
              scale,
            }}
            className="absolute"
            {...bind(i)}
          >
            {i === currentIndex && <MovieCard movie={movies[i]} />}
          </animated.div>
        ))}
      </div>

      {/* Accessibility Buttons */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={() => handleSwipe('left')}
          className="px-5 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          ❌ Dislike
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="px-5 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          ❤️ Like
        </button>
      </div>
    </>
  );
}