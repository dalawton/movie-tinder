'use client';

import { useRouter } from 'next/navigation';

const genres = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Romance',
  'Sci-Fi', 'Thriller', 'Fantasy', 'Animation', 'Adventure'
];

export default function HomePage() {
  const router = useRouter();

  const handleSelect = (genre: string | null) => {
    const encoded = genre ? `?genre=${encodeURIComponent(genre)}` : '';
    router.push(`/swipe${encoded}`);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-4 p-4">
      <h1 className="text-3xl font-bold">🎬 Choose a Genre</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => handleSelect(genre)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {genre}
          </button>
        ))}
      </div>
      <button
        onClick={() => handleSelect(null)}
        className="mt-8 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        🎲 No Preference
      </button>
    </main>
  );
}
