// typescript interfaces

export interface Movie {
    imdbID: string;
    title: string;
    year: string;
    genre: string;
    plot: string;
    director: string;
    actors: string;
    poster: string;
    runtime: string;
    imdb_rating: string;
    confidence: number;
    detected_genres: string[];
    title_keywords: string[];
    id: string;
    poster_path: string;
    overview: string;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
    imdb_votes?: string;
    awards?: string;
    box_office?: string;
}

export interface MovieSearchRequest {
    query: string;
    genres?: string[];
    limit?: number;
    minConfidence?: number;
}

export interface GenreStats {
    genre_distribution: Record<string, number>;
    total_movies: number;
    average_confidence: number;
}

export interface SwipeAction {
    userId: string;
    movieId: string;
    action: 'like' | 'skip';
    timestamp: number;
}
