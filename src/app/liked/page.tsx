import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Calendar, Star } from 'lucide-react';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export default function LikedPage() {
  const [likedMovies, setLikedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const handleBackToHome = () => {
    // Handle navigation back to home page
    window.history.back();
  };

  const handleStartSwiping = () => {
    // Handle navigation to swipe page
    window.location.href = '/swipe';
  };

  useEffect(() => {
    // Load liked movies from memory storage
    const stored = window.likedMovies || [];
    setLikedMovies(stored);
    setLoading(false);
  }, []);

  const removeFromLiked = (movieId: number) => {
    const updated = likedMovies.filter(movie => movie.id !== movieId);
    setLikedMovies(updated);
    // Update the global storage
    window.likedMovies = updated;
  };

  const clearAllLiked = () => {
    setLikedMovies([]);
    window.likedMovies = [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading your liked movies...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToHome}
              className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="text-red-500" size={24} />
              Liked Movies ({likedMovies.length})
            </h1>
          </div>
          {likedMovies.length > 0 && (
            <button
              onClick={clearAllLiked}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Movies Grid */}
        {likedMovies.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto mb-4 text-gray-400" size={48} />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              No liked movies yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start swiping to discover movies you'll love!
            </p>
            <button
              onClick={handleStartSwiping}
              className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Start Swiping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {likedMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-movie.jpg'}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => removeFromLiked(movie.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Heart size={16} fill="white" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {movie.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500" />
                      {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {movie.overview || 'No description available.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}