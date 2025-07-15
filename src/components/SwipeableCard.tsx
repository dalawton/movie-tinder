'use client';

import { useState } from 'react';
import { useSprings, animated, to as interpolate } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import MovieCard from './MovieCard';

type Movie = {
  Title: string;
  Year: string;
  Poster: string;
  imdbID: string;
};

const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});

const from = () => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });

const trans = (r: number, s: number) =>
  `rotate(${r}deg) scale(${s})`;

export default function SwipeableCard({
  movies,
  onSwipe,
}: {
  movies: Movie[];
  onSwipe: (dir: 'left' | 'right', movie: Movie) => void;
}) {
  const [gone] = useState(() => new Set<number>()); // track swiped cards
  const [currentIndex, setCurrentIndex] = useState(0);

  const [springs, api] = useSprings(movies.length, i => ({
    ...to(i),
    from: from(),
  }));

  const bind = useDrag(
   ({ args: [index], down, movement: [mx], direction: [xDir], velocity: [vx] }) => {
      const trigger = Math.abs(vx) > 0.2;
      const dir = xDir < 0 ? -1 : 1;

      if (!down && trigger) gone.add(index);

      api.start(i => {
        if (index !== i) return;

        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0;
        const rot = mx / 100;
        const scale = down ? 1.1 : 1;

        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
        };
      });

      // After swipe is finished
      if (!down && trigger) {
        const dirLabel = dir === 1 ? 'right' : 'left';
        onSwipe(dirLabel, movies[index]);

        // Show next movie
        setCurrentIndex(prev => prev + 1);
      }
    }
  );

  return (
    <div className="relative w-[300px] h-[440px] mx-auto mt-10">
      {springs.map(({ x, y, rot, scale }, i) => (
        <animated.div
          key={movies[i].imdbID}
          style={{
            transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),
            zIndex: movies.length - i,
          }}
          className="absolute"
        >
          <animated.div
            {...bind(i)}
            style={{
              transform: interpolate([rot, scale], trans),
              touchAction: 'none',
            }}
          >
            {i === currentIndex && <MovieCard movie={movies[i]} />}
          </animated.div>
        </animated.div>
      ))}
    </div>
  );
}