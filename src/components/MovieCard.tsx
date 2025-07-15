type Movie = {
  Title: string;
  Year: string;
  Poster: string;
  imdbID: string;
};

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={movie.Poster} alt={movie.Title} className="w-full" />
      <h3 className="text-lg font-semibold p-2">
        {movie.Title} ({movie.Year})
      </h3>
    </div>
  );
}