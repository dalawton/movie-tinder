'use client';

import { useEffect, useState } from 'react';
import { Movie } from '../../types/movie';

export default function LikedPage() {
  const [likedMovies, setLikedMovies] = useState<Movie[]>([]);
  const [activeMovieId, setActiveMovieId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('likedMovies');
      const parsed: Movie[] = stored ? JSON.parse(stored) : [];
      setLikedMovies(parsed);
    } catch {
      setLikedMovies([]);
    }
  }, []);

  const toggleDescription = (movieId: string) => {
    setActiveMovieId((prev: string | null) => (prev === movieId ? null : movieId));
  };

  const removeFromLiked = (movieId: string) => {
    const updatedMovies = likedMovies.filter(movie => movie.id !== movieId);
    setLikedMovies(updatedMovies);
    localStorage.setItem('likedMovies', JSON.stringify(updatedMovies));
  };

  return (
    <main style={{ padding: '24px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div className="container">
        <div className="flex flex-between" style={{ alignItems: 'center', marginBottom: '24px' }}>
          <h1 className="text-3xl font-bold">❤️ Liked Movies</h1>
          <div className="flex gap-1">
            <button
              onClick={() => window.location.href = '/'}
              className="btn btn-secondary"
            >
              🏠 Home
            </button>
            <button
              onClick={() => window.location.href = '/swipe'}
              className="btn btn-primary"
            >
              🎬 Continue Swiping
            </button>
          </div>
        </div>

        {likedMovies.length === 0 ? (
          <div className="text-center" style={{ padding: '64px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💔</div>
            <h2 className="text-xl font-semibold mb-2">No liked movies yet</h2>
            <p className="text-gray mb-4">Start swiping to build your collection!</p>
            <button
              onClick={() => window.location.href = '/swipe'}
              className="btn btn-primary"
            >
              Start Swiping Movies
            </button>
          </div>
        ) : (
          <>
            <div style={{ 
              marginBottom: '24px', 
              padding: '16px', 
              backgroundColor: 'white', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <p className="text-lg">
                <strong>{likedMovies.length}</strong> movie{likedMovies.length !== 1 ? 's' : ''} in your collection
              </p>
            </div>

            <div className="grid grid-3 gap-3">
              {likedMovies.map((movie: Movie) => (
                <div
                  key={movie.id}
                  className="movie-card"
                  style={{ position: 'relative' }}
                >
                  <div 
                    onClick={() => toggleDescription(movie.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={movie.poster_path || movie.poster}
                      alt={movie.title}
                      className="movie-poster"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-movie.png';
                      }}
                    />

                    {activeMovieId === movie.id && (
                      <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        color: 'white',
                        padding: '16px',
                        borderRadius: '12px 12px 0 0',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <h3 className="font-bold mb-2">{movie.title}</h3>
                        <p className="text-sm" style={{ 
                          whiteSpace: 'pre-line',
                          overflowY: 'auto',
                          flexGrow: 1
                        }}>
                          {movie.overview || movie.plot}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDescription(movie.id);
                          }}
                          className="btn btn-danger mt-2"
                          style={{ alignSelf: 'flex-end', padding: '4px 8px', fontSize: '12px' }}
                        >
                          ✖ Close
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="movie-info">
                    <div className="flex flex-between" style={{ alignItems: 'flex-start' }}>
                      <div style={{ flexGrow: 1 }}>
                        <h2 className="movie-title">{movie.title}</h2>
                        <p className="movie-meta">{movie.release_date || movie.year}</p>
                        
                        <div className="text-sm text-gray mt-1">
                          <p><strong>Director:</strong> {movie.director}</p>
                          <p><strong>Genre:</strong> {movie.genre}</p>
                          <p><strong>Rating:</strong> ⭐ {movie.imdbRating || movie.imdbRating}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromLiked(movie.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '18px',
                          cursor: 'pointer',
                          padding: '4px',
                          color: '#ef4444',
                          marginLeft: '8px'
                        }}
                        title="Remove from liked"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-4">
              <button
                onClick={() => window.location.href = '/search'}
                className="btn btn-secondary"
                style={{ marginRight: '8px' }}
              >
                🔍 Search More Movies
              </button>
              <button
                onClick={() => window.location.href = '/swipe'}
                className="btn btn-primary"
              >
                🎬 Continue Swiping
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}