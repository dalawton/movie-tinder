'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-4 p-4">
      <h1 className="text-3xl font-bold">🎬 Movie Swipe</h1>
      <div className="flex flex-col gap-4 mt-6">
        <button
          onClick={() => router.push('/swipe')}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-lg"
        >
          Start Swiping
        </button>
        <button
          onClick={() => router.push('/liked')}
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 text-lg"
        >
          View Liked Movies
        </button>
      </div>
    </main>
  );
}