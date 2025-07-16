// /components/SwipeableCard.tsx
import React from 'react';
import { Movie } from '../app/swipe/SwipePageContent'; // adjust import as needed

type Props = {
  movies: Movie[];
  onSwipeAction: (dir: 'left' | 'right', movie: Movie) => void;
};

const SwipeableCard: React.FC<Props> = ({ movies, onSwipeAction }) => {
  // Render one card at a time (top of stack)
  const movie = movies[0];

  if (!movie) return null;

  return (
    <div className="relative w-80 h-[500px] bg-white rounded-xl shadow-lg p-4">
    <img
      src={movie.poster_path ?? ''}
      alt={movie.title}
      className="w-full h-96 object-cover rounded"
    />
    <h2 className="text-xl font-bold mt-4 text-center">{movie.title}</h2>
    <p className="text-sm text-gray-600 text-center">{movie.release_date}</p>

    {/* Buttons on the sides */}
    <div className="absolute top-1/2 transform -translate-y-1/2 left-0">
      <button
        onClick={() => onSwipeAction('left', movie)}
        className="ml-2 bg-red-500 text-white rounded-full px-4 py-2"
      >
        ⬅️ Skip
      </button>
    </div>
    <div className="absolute top-1/2 transform -translate-y-1/2 right-0">
      <button
        onClick={() => onSwipeAction('right', movie)}
        className="mr-2 bg-green-500 text-white rounded-full px-4 py-2"
      >
        Like ➡️
      </button>
    </div>
  </div>

    );
  };

export default SwipeableCard;
