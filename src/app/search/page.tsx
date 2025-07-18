'use client';

import React, { useState } from 'react';
import { useMovieSearch } from '../../hooks/useMovieSearch';
import { MovieSearchRequest, GenreStats } from '../../types/movie';
import { MovieApiService } from '../../services/movieApi';

export default function SearchPage() {
  const { movies, loading, error, availableGenres, searchMovies, clearResults } = useMovieSearch();
  const [searchForm, setSearchForm] = useState({
    query: '',
    selectedGenres: [] as string[],
    limit: 10,
    minConfidence: 0.3
  });
  const [genreStats, setGenreStats] = useState<GenreStats | null>(null);
  const [showStats, setShowStats] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchForm.query.trim()) {
      const request: MovieSearchRequest = {
        query: searchForm.query.trim(),
        genres: searchForm.selectedGenres.length > 0 ? searchForm.selectedGenres : undefined,
        limit: searchForm.limit,
        minConfidence: searchForm.minConfidence
      };
      await searchMovies(request);
    }
  };

  const handleGenreToggle = (genre: string) => {
    setSearchForm((prev) => ({
      ...prev,
      selectedGenres: prev.selectedGenres.includes(genre)
        ? prev.selectedGenres.filter((g: string) => g !== genre)
        : [...prev.selectedGenres, genre]
    }));
  };

  const loadGenreStats = async () => {
    try {
      const stats = await MovieApiService.getGenreStatistics(
        searchForm.selectedGenres.length > 0 ? searchForm.selectedGenres : undefined
      );
      setGenreStats(stats);
      setShowStats(true);
    } catch (err) {
      console.error('Failed to load genre statistics:', err);
    }
  };

  const handleMovieClick = (movieId: string) => {
    console.log('Movie clicked:', movieId);
  };

  return (
    <div className="container" style={{ padding: '24px 20px', maxWidth: '1200px' }}>
      <h1 className="text-3xl font-bold mb-4 text-center">🔍 Movie Search</h1>
      
      <form onSubmit={handleSubmit} className="card mb-3">
        <div className="grid grid-2 gap-2 mb-3">
          <div className="form-group">
            <label className="form-label">
              Search Query
            </label>
            <input
              type="text"
              value={searchForm.query}
              onChange={(e) => setSearchForm((prev) => ({ ...prev, query: e.target.value }))}
              className="form-input"
              placeholder="Enter movie title, director, or keywords..."
              disabled={loading}
            />
          </div>
          
          <div className="grid grid-2 gap-1">
            <div className="form-group">
              <label className="form-label">
                Limit
              </label>
              <select
                value={searchForm.limit}
                onChange={(e) => setSearchForm((prev) => ({ ...prev, limit: parseInt(e.target.value) }))}
                className="form-select"
                disabled={loading}
              >
                <option value={5}>5 movies</option>
                <option value={10}>10 movies</option>
                <option value={20}>20 movies</option>
                <option value={50}>50 movies</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Min Confidence
              </label>
              <select
                value={searchForm.minConfidence}
                onChange={(e) => setSearchForm((prev) => ({ ...prev, minConfidence: parseFloat(e.target.value) }))}
                className="form-select"
                disabled={loading}
              >
                <option value={0.1}>10% (Low)</option>
                <option value={0.3}>30% (Medium)</option>
                <option value={0.5}>50% (High)</option>
                <option value={0.7}>70% (Very High)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Genres (optional)
          </label>
          <div 
            className="grid grid-4 gap-1" 
            style={{ maxHeight: '120px', overflowY: 'auto', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}
          >
            {availableGenres.map((genre: string) => (
              <label key={genre} className="checkbox-group">
                <input
                  type="checkbox"
                  checked={searchForm.selectedGenres.includes(genre)}
                  onChange={() => handleGenreToggle(genre)}
                  className="checkbox"
                  disabled={loading}
                />
                <span className="text-sm">{genre}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex flex-center gap-2">
          <button
            type="submit"
            disabled={loading || !searchForm.query.trim()}
            className="btn btn-primary"
            style={{ opacity: (loading || !searchForm.query.trim()) ? 0.5 : 1 }}
          >
            {loading ? (
              <span className="flex flex-center gap-1">
                <div className="spinner"></div>
                Searching...
              </span>
            ) : (
              'Search Movies'
            )}
          </button>
          
          <button
            type="button"
            onClick={clearResults}
            className="btn btn-secondary"
          >
            Clear Results
          </button>
          
          <button
            type="button"
            onClick={loadGenreStats}
            className="btn btn-success"
          >
            Show Stats
          </button>
        </div>
      </form>

      {showStats && genreStats && (
        <div className="card mb-3">
          <h2 className="text-xl font-bold mb-3">📊 Genre Statistics</h2>
          <div className="grid grid-3 gap-2 mb-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue">{genreStats.totalMovies}</div>
              <div className="text-sm text-gray">Total Movies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green">{(genreStats.averageConfidence * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>{Object.keys(genreStats.genreDistribution).length}</div>
              <div className="text-sm text-gray">Unique Genres</div>
            </div>
          </div>
          
          <div className="grid grid-4 gap-1">
            {Object.entries(genreStats.genreDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([genre, count]) => (
                <div key={genre} style={{ backgroundColor: '#f9fafb', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
                  <div className="font-semibold">{count}</div>
                  <div className="text-sm text-gray">{genre}</div>
                </div>
              ))}
          </div>
          
          <button
            onClick={() => setShowStats(false)}
            className="btn btn-secondary mt-2"
          >
            Hide Stats
          </button>
        </div>
      )}

      {error && (
        <div className="card" style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5', color: '#dc2626' }}>
          <p>Error: {error}</p>
        </div>
      )}

      {movies.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3">
            Search Results ({movies.length} movies found)
          </h2>
          <div className="grid grid-4 gap-3">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => handleMovieClick(movie.id)}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={movie.poster_path !== 'N/A' ? movie.poster_path : '/placeholder-movie.png'}
                    alt={movie.title}
                    className="movie-poster"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-movie.png';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    ⭐ {movie.imdbRating || movie.imdbRating}
                  </div>
                  {movie.confidence && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {(movie.confidence * 100).toFixed(0)}% match
                    </div>
                  )}
                </div>
                
                <div className="movie-info">
                  <h3 className="movie-title" style={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {movie.title}
                  </h3>
                  <p className="movie-meta">{movie.year} • {movie.runtime}</p>
                  <p className="movie-description" style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {movie.overview}
                  </p>
                  
                  <div className="text-sm text-gray mt-1">
                    <p><strong>Director:</strong> {movie.director}</p>
                    <p><strong>Genre:</strong> {movie.genre}</p>
                  </div>
                  
                  {movie.detectedGenres && movie.detectedGenres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {movie.detectedGenres.slice(0, 3).map((genre, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            fontSize: '12px',
                            borderRadius: '12px'
                          }}
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {movies.length === 0 && !loading && !error && searchForm.query && (
        <div className="text-center" style={{ padding: '48px 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎬</div>
          <h3 className="text-xl font-semibold mb-2">No movies found</h3>
          <p className="text-gray">Try adjusting your search criteria or lowering the confidence threshold.</p>
        </div>
      )}

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
          onClick={() => window.location.href = '/swipe'}
          className="btn btn-primary"
          style={{ borderRadius: '25px' }}
        >
          🎬 Swipe
        </button>
      </div>
    </div>
  );
}