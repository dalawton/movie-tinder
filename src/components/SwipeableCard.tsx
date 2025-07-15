// src/components/SwipeableCard.tsx
'use client';

import { useState } from 'react';
import { useSprings, animated } from 'react-spring';
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
    opacity: 1,
    transform: 'translateX(0%)',
    from: { opacity: 0, transform: 'translateX(100%)' },
  }));

  const handleSwipe = (dir: 'left' | 'right') => {
    if (currentIndex >= movies.length) return;

    api.start(i => {
      if (i === currentIndex) {
        return {
          opacity: 0,
          transform: `translateX(${dir === 'left' ? '-' : ''}100%)`,
        };
      }
      return {};
    });

    onSwipe(dir, movies[currentIndex]);
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="flex flex-col items-center mt-8">
      {movies.map((movie, i) => (
        <animated.div
          key={movie.imdbID}
          style={springs[i]}
          className="absolute w-[300px]"
        >
          {i === currentIndex && <MovieCard movie={movie} />}
        </animated.div>
      ))}
      <div className="flex gap-10 mt-56">
        <button onClick={() => handleSwipe('left')} className="text-4xl">👎</button>
        <button onClick={() => handleSwipe('right')} className="text-4xl">👍</button>
      </div>
    </div>
  );
}
