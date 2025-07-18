// backend api integration
import { SwipeAction, GenreStats } from "@/types/movie";
import { Movie, MovieSearchRequest } from "@/types/movie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class MovieApiService {
    /**
     * 
     * @param inital_movie movie info before fomatting changes
     * 
     * Format movie information
     */
    private static convertToCorrectMovieFormat(inital_movie: any): Movie {
        return {
            ... inital_movie,
            id: inital_movie.imdbID,
            poster_path: inital_movie.poster,
            overview: inital_movie.plot,
            release_date: inital_movie.year,
            vote_average: parseFloat(inital_movie.imdb_rating) || 0,
            genre_ids: [],
        };
    }
    
    /**
     * Get available genres
     */
    static async getAvailableGenres(): Promise<string[]> {
      const response = await fetch(`${API_BASE_URL}/genres`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return await response.json();
    }

    /**
     * 
     * @param request filters
     * 
     * search through movies using filters
     */
    static async searchMovies(request: MovieSearchRequest): Promise<Movie[]> {
        const params = new URLSearchParams({
            query: request.query,
            limit: (request.limit || 10).toString(),
            minConfidence: (request.minConfidence || 0.3).toString()
        });

        if (request.genres && request.genres.length > 0) {
            request.genres.forEach(genre => params.append('genres', genre));
        }

        const response = await fetch(`${API_BASE_URL}/search?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        const movies = await response.json();
        return movies.map(this.convertToCorrectMovieFormat);
    }

    /**
     * 
     * @param imdbID id of movie
     * 
     * gets movie details
     */
    static async getMovieDetails(imdbID: string): Promise<Movie | null> {
        const response = await fetch(`${API_BASE_URL}/${imdbID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const movie = await response.json();
        return this.convertToCorrectMovieFormat(movie);
    }
  /**
   * 
   * @param genres list of genres
   * 
   * Get genre statistics
   */
  static async getGenreStatistics(genres?: string[]): Promise<GenreStats> {
    const params = new URLSearchParams();
    if (genres && genres.length > 0) {
      genres.forEach(genre => params.append('genres', genre));
    }
    
    const response = await fetch(`${API_BASE_URL}/stats?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return await response.json();
  }
  
  /**
   * 
   * @param userId string associated with the user
   * @param limit  number of how many recommendations to return
   * 
   * Get personalized movie recommendations
   */
  static async getRecommendations(userId: string, limit: number = 10): Promise<Movie[]> {
    const params = new URLSearchParams({
      userId,
      limit: limit.toString()
    });
    
    const response = await fetch(`${API_BASE_URL}/recommendations?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const movies = await response.json();
    return movies.map(this.convertToCorrectMovieFormat);
  }
  
  /**
   * 
   * @param swipeAction type of action, either like or skip
   * 
   * Record user swipe action
   */
  static async recordSwipeAction(swipeAction: SwipeAction): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/swipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(swipeAction),
    });
    
  }
  
  /**
   * 
   * @param userId id associated with user
   * @param limit  number of movies to return
   * @param genres list of genres of movies
   * 
   * Get random movies for swiping
   */
  static async getRandomMovies(userId: string, limit: number = 10, genres?: string[]): Promise<Movie[]> {
    const params = new URLSearchParams({
      userId,
      limit: limit.toString()
    });
    
    if (genres && genres.length > 0) {
      genres.forEach(genre => params.append('genres', genre));
    }
    
    const response = await fetch(`${API_BASE_URL}/random?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const movies = await response.json();
    return movies.map(this.convertToCorrectMovieFormat);
  }
  
}
