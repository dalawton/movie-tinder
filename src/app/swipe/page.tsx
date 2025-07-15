'use client';

import { useEffect, useState } from 'react';
import SwipeableCard from '../../components/SwipeableCard';
import { getUserId } from '../../../utils/user';
import { Suspense } from 'react';

type Movie = {
  Title: string;
  Year: string;
  Poster: string;
  imdbID: string;
};

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

function SwipePageContent() {
  const USER_ID = getUserId();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [liked, setLiked] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=""&type=movie`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch movies');
        }
        
        const data = await res.json();
        
        if (data.Response === 'False') {
          throw new Error(data.Error || 'No movies found');
        }
        
        if (data.Search) {
          setMovies(data.Search);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();

    // Load saved likes from localStorage
    try {
      const saved = localStorage.getItem(`likes-${USER_ID}`);
      if (saved) {
        setLiked(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load saved likes:', err);
    }
  }, [genre, USER_ID]);

  const handleSwipe = (dir: 'left' | 'right', movie: Movie) => {
    if (dir === 'right') {
      const updated = [...liked, movie];
      setLiked(updated);
      
      try {
        localStorage.setItem(`likes-${USER_ID}`, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save likes:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-xl">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-xl text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">
        {`🎲 Random Movies`}
      </h1>

      {/* Card Area */}
      <div className="relative w-full flex justify-center mb-8">
        <SwipeableCard movies={movies} onSwipe={handleSwipe} />
      </div>

      {/* Liked Counter */}
      <div className="mt-auto pt-6 z-10">
        <p className="text-lg font-semibold">❤️ Liked: {liked.length}</p>
      </div>
    </main>
  );
}

export default function SwipePage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading movies...</div>}>
      <SwipePageContent />
    </Suspense>
  );
}