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
    imdbRating: string;
    confidence: number;
    detectedGenres: string[];
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
    genreDistribution: Record<string, number>;
    totalMovies: number;
    averageConfidence: number;
}

export interface SwipeAction {
    userId: string;
    movieId: string;
    action: 'like' | 'skip';
    timestamp: number;
}
