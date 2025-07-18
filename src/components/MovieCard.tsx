import { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div className="movie-card" onClick={onClick}>
      <img 
        src={movie.poster_path || movie.poster} 
        alt={movie.title} 
        className="movie-poster"
        onError={(e) => {
          e.currentTarget.src = '/placeholder-movie.png';
        }}
      />
      <div className="movie-info">
        <h3 className="movie-title">
          {movie.title}
        </h3>
        <p className="movie-meta">
          {movie.release_date || movie.year}
        </p>
        {movie.overview && (
          <p className="movie-description">
            {movie.overview}
          </p>
        )}
        
        <div className="text-sm text-gray mt-1">
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Genre:</strong> {movie.genre}</p>
          <p><strong>Rating:</strong> ⭐ {movie.imdbRating || movie.imdbRating}</p>
        </div>
      </div>
    </div>
  );
}