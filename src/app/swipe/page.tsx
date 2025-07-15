'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SwipeableCard from '../../components/SwipeableCard';
import { getUserId } from '../../../utils/user';
import { Suspense } from 'react';
import SwipePageContent from './SwipePageContent';

type Movie = {
  Title: string;
  Year: string;
  Poster: string;
  imdbID: string;
};

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

export default function SwipePage() {
  const searchParams = useSearchParams();
  const genre = searchParams.get('genre');
  const USER_ID = getUserId();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [liked, setLiked] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const searchTerm = genre || 'star';
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie`);
      const data = await res.json();
      if (data.Search) setMovies(data.Search);
    };

    fetchMovies();

    const saved = localStorage.getItem(`likes-${USER_ID}`);
    if (saved) setLiked(JSON.parse(saved));
  }, [genre, USER_ID]);

  const handleSwipe = (dir: 'left' | 'right', movie: Movie) => {
    if (dir === 'right') {
      const updated = [...liked, movie];
      setLiked(updated);
      localStorage.setItem(`likes-${USER_ID}`, JSON.stringify(updated));
    }
  };

  return (
    <Suspense fallback={<div className="p-6 text-center">Loading movies...</div>}>
      <SwipePageContent />
    </Suspense>
    <main className="flex flex-col items-center min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">
        {genre ? `${genre} Movies` : `🎲 Random Movies`}
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
