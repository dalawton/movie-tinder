type Movie = {
  id: string;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  runtime?: string;
  director?: string;
  actors?: string;
  awards?: string;
  boxOffice?: string;
  imdbRating?: string;
  imdbVotes?: string;
};

// Type for OMDB API response
type OMDBSearchResponse = {
  Response: string;
  Search?: Array<{
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
  }>;
  totalResults?: string;
  Error?: string;
};

type OMDBMovieResponse = {
  Response: string;
  Title?: string;
  Year?: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Poster?: string;
  Ratings?: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  imdbID?: string;
  Type?: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Error?: string;
};

declare global {
  interface Window {
    likedMovies: Movie[];
  }
}

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={movie.poster_path} alt={movie.title} className="w-full" />
      <h3 className="text-lg font-semibold p-2">
        {movie.title} ({movie.release_date})
        {movie.overview}
      </h3>
    </div>
  );
}