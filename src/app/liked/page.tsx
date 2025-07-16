'use client';

import { useEffect, useState } from 'react';
import { Movie } from '../swipe/SwipePageContent'; // adjust path if needed

export default function LikedPage() {
  const [likedMovies, setLikedMovies] = useState<Movie[]>([]);
  const [activeMovieId, setActiveMovieId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('likedMovies');
      const parsed = stored ? JSON.parse(stored) : [];
      setLikedMovies(parsed);
    } catch {
      setLikedMovies([]);
    }
  }, []);

  const toggleDescription = (movieId: string) => {
    setActiveMovieId(prev => (prev === movieId ? null : movieId));
  };

  return (
    <main className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">❤️ Liked Movies</h1>
      {likedMovies.length === 0 ? (
        <p>No liked movies yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {likedMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white rounded shadow overflow-hidden cursor-pointer transition-transform hover:scale-105"
              onClick={() => toggleDescription(movie.id)}
              >
              <img
                src={movie.poster_path}
                alt={movie.title}
                className="w-full object-cover aspect-[2/3]"
              />

              {activeMovieId === movie.id && (
                <div className="bg-black bg-opacity-80 text-white p-4">
                  <h2 className="text-lg font-bold mb-2">{movie.title}</h2>
                  <p className="text-sm whitespace-pre-line">{movie.overview}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDescription(movie.id);
                    }}
                    className="mt-2 bg-red-600 px-2 py-1 rounded text-sm"
                  >
                    ✖ Close
                  </button>
                </div>
              )}

              <div className="p-2">
                <h2 className="text-lg text-gray-800 font-semibold">{movie.title}</h2>
                <p className="text-sm text-gray-600">{movie.release_date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
