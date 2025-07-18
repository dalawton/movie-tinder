// Swipe functionality hook
import { useState, useEffect } from 'react';
import { MovieApiService } from '@/services/movieApi';
import { Movie, SwipeAction } from '@/types/movie';

export const useMovieSwipe = (userId: string) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likedMovies, setLikedMovies] = useState<Movie[]>([]);
  
  useEffect(() => {
    if (userId) {
      loadRandomMovies();
      loadLikedMovies();
    }
  }, [userId]);
  
  const loadRandomMovies = async (genres?: string[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const randomMovies = await MovieApiService.getRandomMovies(userId, 10, genres);
      setMovies(randomMovies);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };
  
  const loadLikedMovies = () => {
    try {
      const stored = localStorage.getItem('likedMovies');
      if (stored) {
        setLikedMovies(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load liked movies:', err);
    }
  };
  
  const handleSwipe = async (direction: 'left' | 'right', movie: Movie) => {

    setMovies(prev => prev.filter(m => m.id !== movie.id));
    
    const swipeAction: SwipeAction = {
      userId,
      movieId: movie.imdbID,
      action: direction === 'right' ? 'like' : 'skip',
      timestamp: Date.now()
    };
    
    try {
      await MovieApiService.recordSwipeAction(swipeAction);
      
      if (direction === 'right') {
        const updatedLiked = [...likedMovies, movie];
        setLikedMovies(updatedLiked);
        localStorage.setItem('likedMovies', JSON.stringify(updatedLiked));
      }
      
      if (movies.length <= 3) {
        loadRandomMovies();
      }
    } catch (err) {
      console.error('Failed to record swipe action:', err);
    }
  };
  
  const getRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const recommendations = await MovieApiService.getRecommendations(userId);
      setMovies(recommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };
  
  return {
    movies,
    loading,
    error,
    likedMovies,
    handleSwipe,
    loadRandomMovies,
    getRecommendations
  };
};