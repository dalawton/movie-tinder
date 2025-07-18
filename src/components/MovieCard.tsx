import { Movie } from "@/types/movie";

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