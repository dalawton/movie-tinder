'use client';

import React, { useEffect, useState } from 'react';
import SwipeableCard from '../../components/SwipeableCard';
import { getUserId } from '../../utils/user';
import { useMovieSwipe } from '../../hooks/useMovieSwipe';
import { MovieApiService } from '../../services/movieApi';
import { Movie } from '../../types/movie';

function SwipePageContent() {
  const [userId, setUserId] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  
  const {
    movies,
    likedMovies,
    loading,
    error,
    handleSwipe,
    loadRandomMovies,
    getRecommendations
  } = useMovieSwipe(userId);

  useEffect(() => {
    setIsClient(true);
    const id = getUserId();
    setUserId(id);

    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const genres = await MovieApiService.getAvailableGenres();
      setAvailableGenres(genres);
    } catch (err) {
      console.error('Failed to initialize app:', err);
    }
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev: string[]) => 
      prev.includes(genre) 
        ? prev.filter((g: string) => g !== genre)
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

  if (loading) {
    return (
      <div className="flex flex-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 16px' }}></div>
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-center" style={{ minHeight: '100vh' }}>
        <div className="card text-center">
          <h2 className="text-xl font-bold mb-2">⚠️ Error</h2>
          <p className="text-red mb-3">{error}</p>
          <button 
            onClick={() => loadRandomMovies()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-center" style={{ minHeight: '100vh', padding: '24px' }}>
        <div className="card text-center" style={{ maxWidth: '400px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎬</div>
          <h2 className="text-xl font-bold mb-2">No more movies!</h2>
          <p className="text-gray mb-4">You've seen all available movies with your current filters.</p>
          <div className="flex flex-column gap-2">
            <button 
              onClick={() => loadRandomMovies()}
              className="btn btn-primary"
            >
              Load More Movies
            </button>
            <button 
              onClick={clearGenreFilter}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
            <button 
              onClick={() => window.location.href = '/liked'}
              className="btn btn-success"
            >
              View Liked Movies ({likedMovies.length})
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <main className="flex flex-column" style={{ minHeight: '100vh', padding: '24px' }}>
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-3">🎬 Movie Swiper</h1>
        
        <div className="flex flex-wrap gap-2" style={{ justifyContent: 'center', marginBottom: '24px' }}>
          <button
            onClick={() => setShowGenreFilter(!showGenreFilter)}
            className="btn"
            style={{ 
              background: showGenreFilter ? '#8b5cf6' : '#6366f1',
              color: 'white'
            }}
          >
            🎭 Filter by Genre
          </button>
          <button
            onClick={handleGetRecommendations}
            className="btn btn-warning"
          >
            ⭐ Get Recommendations
          </button>
          <button
            onClick={() => loadRandomMovies()}
            className="btn btn-primary"
          >
            🎲 Random Movies
          </button>
        </div>
      </div>
      
      {showGenreFilter && (
        <div className="card mb-4" style={{ maxWidth: '600px', margin: '0 auto 24px' }}>
          <h3 className="font-bold mb-3">Select Genres:</h3>
          <div className="grid grid-3 gap-1 mb-3">
            {availableGenres.map((genre: string) => (
              <label key={genre} className="checkbox-group">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreToggle(genre)}
                  className="checkbox"
                  style={{ accentColor: '#8b5cf6' }}
                />
                <span className="text-sm">{genre}</span>
              </label>
            ))}
          </div>
          <div className="flex flex-center gap-2">
            <button
              onClick={applyGenreFilter}
              className="btn btn-success"
            >
              Apply Filter
            </button>
            <button
              onClick={clearGenreFilter}
              className="btn btn-secondary"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {selectedGenres.length > 0 && (
        <div className="text-center mb-3">
          <div style={{ 
            display: 'inline-block',
            padding: '8px 16px', 
            backgroundColor: '#dbeafe', 
            borderRadius: '20px',
            color: '#1e40af'
          }}>
            <span className="text-sm font-medium">Filtered by: </span>
            <span className="text-sm">{selectedGenres.join(', ')}</span>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SwipeableCard movies={movies} onSwipeAction={handleSwipe} />
      </div>

      {movies.length > 0 && (
        <div className="card text-center" style={{ maxWidth: '400px', margin: '24px auto 0' }}>
          <h3 className="font-bold text-lg mb-2">{movies[0].title}</h3>
          <div className="text-sm text-gray" style={{ lineHeight: '1.6' }}>
            <p><strong>Year:</strong> {movies[0].year}</p>
            <p><strong>Director:</strong> {movies[0].director}</p>
            <p><strong>Genre:</strong> {movies[0].genre}</p>
            <p><strong>Runtime:</strong> {movies[0].runtime}</p>
            <p><strong>IMDB Rating:</strong> ⭐ {movies[0].imdbRating || movies[0].imdbRating}</p>
            {movies[0].confidence && (
              <p><strong>Match Confidence:</strong> {(movies[0].confidence * 100).toFixed(1)}%</p>
            )}
          </div>
        </div>
      )}

      <div className="text-center mt-4">
        <div style={{ 
          display: 'inline-block',
          padding: '16px 24px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <p className="text-lg font-semibold text-green">❤️ Liked: {likedMovies.length}</p>
          <p className="text-sm text-gray">🎬 Remaining: {movies.length}</p>
          <button 
            className="btn btn-primary mt-2" 
            onClick={handleSeeLiked}
          >
            View Liked Movies
          </button>
        </div>
      </div>

      {/* Navigation buttons */}
      <div style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={() => window.location.href = '/'}
          className="btn btn-secondary"
          style={{ borderRadius: '25px' }}
        >
          🏠 Home
        </button>
        <button
          onClick={() => window.location.href = '/search'}
          className="btn"
          style={{ 
            borderRadius: '25px',
            background: '#8b5cf6',
            color: 'white'
          }}
        >
          🔍 Search
        </button>
      </div>
    </main>
  );
}

export default SwipePageContent;