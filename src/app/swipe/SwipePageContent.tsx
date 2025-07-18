'use client';

import React, { useEffect, useState } from 'react';
import SwipeableCard from '@/components/SwipeableCard';
import { getUserId } from '@/utils/user';
import { useMovieSwipe } from '@/hooks/useMovieSwipe';
import { MovieApiService } from '@/services/movieApi';
import { Movie } from '@/types/movie';

function SwipePageContent() {
  const [userId, setUserId] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  
  const {
    movies,
    likedMovies,
    handleSwipe,
    loadRandomMovies,
    getRecommendations
  } = useMovieSwipe(userId);

  useEffect(() => {
    setIsClient(true);
    const id = getUserId();
    setUserId(id);

    initalizeApp();
  }, []);

  const initalizeApp = async () => {
    try {
      const genres = await MovieApiService.getAvailableGenres();
      setAvailableGenres(genres);
    } catch (err) {
      console.error('Failed to initialize app:', err);
    }
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const applyGenreFilter = () => {
    loadRandomMovies(selectedGenres.length > 0 ? selectedGenres : undefined);
    setShowGenreFilter(false);
  };

  const clearGenreFilter = () => {
    setSelectedGenres([]);
    loadRandomMovies();
    setShowGenreFilter(false);
  };

  const handleSeeLiked = () => {
    window.location.href = '/liked';
  };

  const handleGetRecommendations = () => {
    getRecommendations();
  };

  if (movies.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">No more movies!</h2>
        <p className="mb-4">You've seen all available movies with your current filters.</p>
        <div className="space-y-2">
          <button 
            onClick={() => loadRandomMovies()}
            className="block mx-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Load More Movies
          </button>
          <button 
            onClick={clearGenreFilter}
            className="block mx-auto px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear Filters
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <main className="flex flex-col items-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">🎬 Movie Swiper</h1>
      
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setShowGenreFilter(!showGenreFilter)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          🎭 Filter by Genre
        </button>
        <button
          onClick={handleGetRecommendations}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          ⭐ Get Recommendations
        </button>
        <button
          onClick={() => loadRandomMovies()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          🎲 Random Movies
        </button>
      </div>
      {showGenreFilter && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg w-full max-w-2xl">
          <h3 className="font-bold mb-3">Select Genres:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {availableGenres.map(genre => (
              <label key={genre} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreToggle(genre)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm">{genre}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={applyGenreFilter}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Apply Filter
            </button>
            <button
              onClick={clearGenreFilter}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {selectedGenres.length > 0 && (
        <div className="mb-4 p-2 bg-blue-100 rounded">
          <span className="text-sm font-medium">Filtered by: </span>
          <span className="text-sm">{selectedGenres.join(', ')}</span>
        </div>
      )}

      <div className="relative w-full flex justify-center mb-8">
        <SwipeableCard movies={movies} onSwipeAction={handleSwipe} />
      </div>

      {movies.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md max-w-md text-center mb-6">
          <h3 className="font-bold text-lg mb-2">{movies[0].title}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Year:</strong> {movies[0].year}</p>
            <p><strong>Director:</strong> {movies[0].director}</p>
            <p><strong>Genre:</strong> {movies[0].genre}</p>
            <p><strong>Runtime:</strong> {movies[0].runtime}</p>
            <p><strong>IMDB Rating:</strong> {movies[0].imdbRating}</p>
            {movies[0].confidence && (
              <p><strong>Match Confidence:</strong> {(movies[0].confidence * 100).toFixed(1)}%</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-auto pt-6 text-center">
        <p className="text-lg font-semibold">❤️ Liked: {likedMovies.length}</p>
        <p className="text-sm text-gray-500">🎬 Remaining: {movies.length}</p>
        <button 
          className="mt-2 text-sm text-blue-500 hover:text-blue-700" 
          onClick={handleSeeLiked}
        >
          View Liked Movies
        </button>
      </div>
    </main>
  );
}

export default SwipePageContent;