'use client';

import { useEffect, useState } from 'react';
import SwipeableCard from '../components/SwipeableCard';

type Movie = {
  Title: string;
  Year: string;
  Poster: string;
  imdbID: string;
};

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [liked, setLiked] = useState<Movie[]>([]);
  const [disliked, setDisliked] = useState<Movie[]>([]);

  const API_KEY = 'your_omdb_api_key'; // Replace with your OMDb key

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=star&type=movie`);
      const data = await res.json();
      if (data.Search) setMovies(data.Search);
    };

    fetchMovies();
  }, []);

  const handleSwipe = (dir: 'left' | 'right', movie: Movie) => {
    if (dir === 'right') setLiked(prev => [...prev, movie]);
    else setDisliked(prev => [...prev, movie]);
  };

  return (
    <main className="flex flex-col items-center min-h-screen p-6">
      <h1 className="text-3xl font-bold">🎬 Movie Tinder</h1>
      <SwipeableCard movies={movies} onSwipe={handleSwipe} />
      <p className="mt-4">
        ✅ Liked: {liked.length} | ❌ Disliked: {disliked.length}
      </p>
    </main>
  );
}
