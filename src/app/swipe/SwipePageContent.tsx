'use client';

import React, { useEffect, useState } from 'react';
import SwipeableCard from '../../components/SwipeableCard';
import { getUserId } from '../../../utils/user';

export type Movie = {
  id: string;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  runtime?: string;
  director?: string;
  actors?: string;
  awards?: string;
  boxOffice?: string;
  imdbRating?: string;
  imdbVotes?: string;
};

type OMDBSearchResponse = {
  Response: string;
  Search?: Array<{
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
  }>;
  totalResults?: string;
  Error?: string;
};

type OMDBMovieResponse = {
  Response: string;
  Title?: string;
  Year?: string;
  Plot?: string;
  Poster?: string;
  imdbID?: string;
  imdbRating?: string;
  imdbVotes?: string;
  Runtime?: string;
  Director?: string;
  Actors?: string;
  Awards?: string;
  BoxOffice?: string;
  Error?: string;
};

declare global {
  interface Window {
    likedMovies: Movie[];
  }
}

const safeSearchTerms = [
  'love', 'life', 'home', 'time', 'heart', 'world', 'night', 'dream',
  'hope', 'peace', 'light', 'story', 'house', 'water', 'music', 'dance',
  'happy', 'brave', 'quick', 'sweet', 'quiet', 'storm', 'smile', 'truth',
  'magic', 'ocean', 'river', 'mountain', 'forest', 'garden', 'winter',
  'summer', 'spring', 'golden', 'silver', 'beauty', 'wonder', 'journey'
];

const randomIndex = Math.floor(Math.random() * safeSearchTerms.length);

const randomElement = safeSearchTerms[randomIndex];

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

function SwipePageContent() {
  const [userId, setUserId] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [liked, setLiked] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearchTerm, setCurrentSearchTerm] = useState(safeSearchTerms[0]);
  const [searchTermIndex, setSearchTermIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setUserId(getUserId());
  }, []);

  useEffect(() => {
    if (!isClient || !API_KEY) return;

    const init = async () => {
      window.likedMovies ||= [];
      setLiked(window.likedMovies);
      await fetchMovies(randomElement, 1, false);
    };

    init();

    (window as any).loadMoreMovies = loadMoreMovies;
  }, [isClient]);

  const convertOMDBToMovie = (data: OMDBMovieResponse): Movie => ({
    id: data.imdbID || `unknown-${Date.now()}`,
    title: data.Title || 'Unknown Title',
    poster_path: data.Poster || 'N/A',
    overview: data.Plot || 'No description available',
    release_date: data.Year || 'Unknown',
    vote_average: data.imdbRating ? parseFloat(data.imdbRating) : 0,
    genre_ids: [],
    runtime: data.Runtime,
    director: data.Director,
    actors: data.Actors,
    awards: data.Awards,
    boxOffice: data.BoxOffice,
    imdbRating: data.imdbRating,
    imdbVotes: data.imdbVotes,
  });

  const getMovieDetails = async (imdbID: string): Promise<Movie | null> => {
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`);
      const data = await res.json();
      return data.Response === 'True' ? convertOMDBToMovie(data) : null;
    } catch {
      return null;
    }
  };

  const fetchMovies = async (term: string, page: number, append = false): Promise<void> => {
    try {
      setError(null);
      if (!append) setLoading(true);
      else setIsLoadingMore(true);

      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${term}&type=movie&page=${page}&plot=full`);
      const data: OMDBSearchResponse = await res.json();

      if (data.Response === 'False' || !data.Search) {
        loadNextSearchTerm();
        return;
      }

      const moviesWithDetails = await Promise.all(
        data.Search.map(m => getMovieDetails(m.imdbID))
      );

      const newMovies = moviesWithDetails.filter((m): m is Movie => !!m);
      const uniqueNew = newMovies.filter(m => !movies.find(existing => existing.id === m.id));

      setMovies(prev => append ? [...prev, ...uniqueNew] : uniqueNew);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch movies');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadNextSearchTerm = () => {
    const randomIndex = Math.floor(Math.random() * safeSearchTerms.length);
    const randomElement = safeSearchTerms[randomIndex];
    setSearchTermIndex(randomIndex);
    setCurrentSearchTerm(randomElement);
    setCurrentPage(1);
    fetchMovies(randomElement, 1, true);
  };

  const loadMoreMovies = () => {
    if (!isLoadingMore) {
      fetchMovies(currentSearchTerm, currentPage + 1, true);
    }
  };

  const handleSwipe = (dir: 'left' | 'right', movie: Movie) => {
    setMovies(prev => prev.filter(m => m.id !== movie.id));

    if (dir === 'right') {
      const updated = [...liked, movie];
      setLiked(updated);
      window.likedMovies = updated;
      localStorage.setItem('likedMovies', JSON.stringify(updated));
    }

    if (movies.length <= 3 && !isLoadingMore && !loading) {
      loadMoreMovies();
    }
  };

  if (!isClient) return <div className="p-6 text-center">Initializing...</div>;
  if (loading) return <div className="p-6 text-center">Loading movies...</div>;
  if (error) return (
    <div className="p-6 text-center text-red-500">
      Error: {error}
    </div>
  );
  if (movies.length === 0) return (
    <div className="p-6 text-center">
      No movies found. Try again later.
    </div>
  );

  const handleSeeLiked = () => {
    // Handle navigation to swipe page
    window.location.href = '/liked';
  };

  return (
    <main className="flex flex-col items-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">🎲 Tinder (Movie Edition)</h1>
      <div className="relative w-full flex justify-center mb-8">
        <SwipeableCard movies={movies} onSwipeAction={handleSwipe} />
      </div>
      <div className="mt-auto pt-6 text-center">
        <p className="text-lg font-semibold">❤️ Liked: {liked.length}</p>
        {isLoadingMore && <p className="text-sm text-gray-500 mt-2">Loading more movies...</p>}
        <button className="mt-2 text-sm text-gray-500" onClick={handleSeeLiked}>
          See Liked Movies
        </button>
      </div>
    </main>
  );
}

export default SwipePageContent;