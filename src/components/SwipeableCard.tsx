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

  const bind = useDrag(
    ({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
      const trigger = velocity > 0.2;
      const dir = xDir < 0 ? -1 : 1;

      if (!down && trigger) {
        const newIndex = currentIndex + 1;
        api.start(i => {
          if (i !== index) return;
          return {
            x: (200 + window.innerWidth) * dir,
            scale: 1,
            display: 'none',
          };
        });

        onSwipe(dir === 1 ? 'right' : 'left', movies[index]);
        setCurrentIndex(newIndex);
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
  );
}
