import React, { useState } from 'react';
import { Movie } from '../types/movie'; 

interface SwipeableCardProps {
  movies: Movie[];
  onSwipeAction: (dir: 'left' | 'right', movie: Movie) => void;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({ movies, onSwipeAction }) => {
  const [showDescription, setShowDescription] = useState(false);
  const movie = movies[0];
  
  if (!movie) return null;

  return (
    <div className="swipe-container">
      {/* Skip Button - Left Side */}
      <button
        onClick={() => onSwipeAction('left', movie)}
        className="swipe-button skip-button"
      >
        ⬅️ Skip
      </button>

      {/* Card */}
      <div className="swipe-card">
        {/* Poster with overlay */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            cursor: 'pointer'
          }}
          onClick={() => setShowDescription((prev: boolean) => !prev)}
        >
          <img
            src={movie.poster_path || movie.poster || ''}
            alt={movie.title}
            style={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
              borderRadius: '12px'
            }}
            onError={(e) => {
              e.currentTarget.src = '/placeholder-movie.png';
            }}
          />
          {showDescription && (
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              right: '8px',
              bottom: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '16px',
              borderRadius: '12px',
              overflowY: 'auto'
            }}>
              <p style={{ fontSize: '0.875rem', textAlign: 'center' }}>
                {movie.overview || movie.plot || 'No description available.'}
              </p>
            </div>
          )}
        </div>

        {/* Title and date */}
        <h2 style={{
          fontSize: '1.25rem',
          color: '#374151',
          fontWeight: 'bold',
          marginTop: '16px',
          textAlign: 'center'
        }}>
          {movie.title}
        </h2>
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          {movie.release_date || movie.year}
        </p>
      </div>

      {/* Like Button - Right Side */}
      <button
        onClick={() => onSwipeAction('right', movie)}
        className="swipe-button like-button"
      >
        Like ➡️
      </button>
    </div>
  );
};

export default SwipeableCard;