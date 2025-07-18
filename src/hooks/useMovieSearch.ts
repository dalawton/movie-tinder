// Search functionality hook
import { useState, useEffect } from 'react';
import { MovieApiService } from '@/services/movieApi';
import { Movie, MovieSearchRequest } from '@/types/movie';

export const useMovieSearch = () => {
    const [ movies, setMovies ] = useState<Movie[]>([]);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ availableGenres, setAvailableGenres ] = useState<string[]>([]);

    useEffect(() => {
        loadAvailableGenres();
    }, []);

    const loadAvailableGenres = async () => {
        try {
            const genres = await MovieApiService.getAvailableGenres();
            setAvailableGenres(genres);
        } catch (err) {
            console.error('Failed to load genres:', err);
        }
    };

    const searchMovies = async (request: MovieSearchRequest) => {
        setLoading(true);
        setError(null);

        try {
            const results = await MovieApiService.searchMovies(request);
            setMovies(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occured');
        } finally {
            setLoading(false);
        }
    };

    const clearResults = () => {
        setMovies([]);
        setError(null);
    };

    return {
        movies,
        loading,
        error,
        availableGenres,
        searchMovies,
        clearResults
    };
};