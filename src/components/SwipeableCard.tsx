import React, {useState} from 'react';
import { Movie } from '@/types/movie'; 

interface SwipeableCardProps {
  movies: Movie[];
  onSwipeAction: (dir: 'left' | 'right', movie: Movie) => void;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({ movies, onSwipeAction }) => {
  const [showDescription, setShowDescription] = useState(false);
  const movie = movies[0];
  if (!movie) return null;

  return (
    <div className="flex items-center justify-center space-x-4">
      {/* Skip Button - Left Side */}
      <button
        onClick={() => onSwipeAction('left', movie)}
        className="bg-red-500 text-white rounded-full px-4 py-2"
      >
        ⬅️ Skip
      </button>

      {/* Card */}
      <div className="w-80 h-[600px] bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
        {/* Poster with overlay */}
        <div
          className="relative h-120 w-full cursor-pointer"
          onClick={() => setShowDescription((prev) => !prev)}
        >
          <img
            src={movie.poster_path ?? ''}
            alt={movie.title}
            className="w-full h-full object-cover rounded"
          />
          {showDescription && (
            <div className="absolute inset-2 bg-black bg-opacity-80 text-white p-4 rounded overflow-y-auto">
              <p className="text-sm text-center">{movie.overview || 'No description available.'}</p>
            </div>
          )}
        </div>

        {/* Title and date */}
        <h2 className="text-xl text-gray-600 font-bold mt-2 text-center">{movie.title}</h2>
        <p className="text-sm text-gray-600 text-center">{movie.release_date}</p>
      </div>

      {/* Like Button - Right Side */}
      <button
        onClick={() => onSwipeAction('right', movie)}
        className="bg-green-500 text-white rounded-full px-4 py-2"
      >
        Like ➡️
      </button>
    </div>
  );
};

export default SwipeableCard;
