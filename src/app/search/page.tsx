// Movie search interface

import React, { useState } from 'react';
import { useMovieSearch } from '@/hooks/useMovieSearch';
import { MovieSearchRequest } from '@/types/movie';
import { MovieApiService } from '@/services/movieApi';

export default function SearchPage() {
  const { movies, loading, error, availableGenres, searchMovies, clearResults } = useMovieSearch();
  const [searchForm, setSearchForm] = useState({
    query: '',
    selectedGenres: [] as string[],
    limit: 10,
    minConfidence: 0.3
  });
  const [genreStats, setGenreStats] = useState(null);
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
    setSearchForm(prev => ({
      ...prev,
      selectedGenres: prev.selectedGenres.includes(genre)
        ? prev.selectedGenres.filter(g => g !== genre)
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
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">🔍 Movie Search</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Query
            </label>
            <input
              type="text"
              value={searchForm.query}
              onChange={(e) => setSearchForm(prev => ({ ...prev, query: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter movie title, director, or keywords..."
              disabled={loading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Limit
              </label>
              <select
                value={searchForm.limit}
                onChange={(e) => setSearchForm(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value={5}>5 movies</option>
                <option value={10}>10 movies</option>
                <option value={20}>20 movies</option>
                <option value={50}>50 movies</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Confidence
              </label>
              <select
                value={searchForm.minConfidence}
                onChange={(e) => setSearchForm(prev => ({ ...prev, minConfidence: parseFloat(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genres (optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
            {availableGenres.map(genre => (
              <label key={genre} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={searchForm.selectedGenres.includes(genre)}
                  onChange={() => handleGenreToggle(genre)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="text-sm">{genre}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex gap-3 justify-center">
          <button
            type="submit"
            disabled={loading || !searchForm.query.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search Movies'}
          </button>
          
          <button
            type="button"
            onClick={clearResults}
            className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Clear Results
          </button>
          
          <button
            type="button"
            onClick={loadGenreStats}
            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Show Stats
          </button>
        </div>
      </form>

      {showStats && genreStats && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📊 Genre Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{genreStats.totalMovies}</div>
              <div className="text-sm text-gray-600">Total Movies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{(genreStats.averageConfidence * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Object.keys(genreStats.genreDistribution).length}</div>
              <div className="text-sm text-gray-600">Unique Genres</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.entries(genreStats.genreDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([genre, count]) => (
                <div key={genre} className="bg-gray-50 p-2 rounded text-center">
                  <div className="font-semibold">{count}</div>
                  <div className="text-xs text-gray-600">{genre}</div>
                </div>
              ))}
          </div>
          
          <button
            onClick={() => setShowStats(false)}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Hide Stats
          </button>
        </div>
      )}

      {movies.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Search Results ({movies.length} movies found)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleMovieClick(movie.id)}
              >
                <div className="relative">
                  <img
                    src={movie.poster_path !== 'N/A' ? movie.poster_path : '/placeholder-movie.png'}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-movie.png';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    ⭐ {movie.imdbRating}
                  </div>
                  {movie.confidence && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                      {(movie.confidence * 100).toFixed(0)}% match
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">{movie.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{movie.year} • {movie.runtime}</p>
                  <p className="text-sm text-gray-700 mb-2 line-clamp-3">{movie.overview}</p>
                  
                  <div className="text-xs text-gray-500">
                    <p><strong>Director:</strong> {movie.director}</p>
                    <p><strong>Genre:</strong> {movie.genre}</p>
                  </div>
                  
                  {movie.detectedGenres && movie.detectedGenres.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {movie.detectedGenres.slice(0, 3).map((genre, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
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
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold mb-2">No movies found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or lowering the confidence threshold.</p>
        </div>
      )}

      <div className="fixed bottom-4 right-4 flex gap-2">
        <button
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700"
        >
          🏠 Home
        </button>
        <button
          onClick={() => window.location.href = '/swipe'}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          🎬 Swipe
        </button>
      </div>
    </div>
  );
}