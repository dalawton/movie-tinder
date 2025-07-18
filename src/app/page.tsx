'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MovieApiService } from '@/services/movieApi';
import { Movie } from '@/types/movie';

export default function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);


  const loadStats = async () => {
    try {
      const genreStats = await MovieApiService.getGenreStatistics();
      setStats(genreStats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🎬 Movie Swipe
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Discover your next favorite movie with intelligent recommendations
        </p>
      </div>

      {stats && (
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <h3 className="font-semibold text-gray-700 mb-2">Database Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xl font-bold text-blue-600">{stats.totalMovies}</div>
              <div className="text-gray-500">Movies</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-600">
                {Object.keys(stats.genreDistribution).length}
              </div>
              <div className="text-gray-500">Genres</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-600">
                {(stats.averageConfidence * 100).toFixed(0)}%
              </div>
              <div className="text-gray-500">Avg Quality</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        <button
          onClick={() => router.push('/swipe')}
          className="group relative overflow-hidden px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <div className="relative z-10">
            <div className="text-2xl mb-1">🎲</div>
            <div className="font-semibold">Start Swiping</div>
            <div className="text-sm opacity-90">Random movie discovery</div>
          </div>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
        </button>

        <button
          onClick={() => router.push('/search')}
          className="group relative overflow-hidden px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <div className="relative z-10">
            <div className="text-2xl mb-1">🔍</div>
            <div className="font-semibold">Search Movies</div>
            <div className="text-sm opacity-90">Find specific movies</div>
          </div>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
        </button>

        <button
          onClick={() => router.push('/liked')}
          className="group relative overflow-hidden px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <div className="relative z-10">
            <div className="text-2xl mb-1">❤️</div>
            <div className="font-semibold">Liked Movies</div>
            <div className="text-sm opacity-90">Your favorites</div>
          </div>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mt-8">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="font-semibold text-gray-800 mb-2">🤖 Smart Filtering</h3>
          <p className="text-sm text-gray-600">
            Advanced algorithms analyze your preferences and provide personalized movie recommendations
            with confidence scores.
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="font-semibold text-gray-800 mb-2">🎭 Genre Discovery</h3>
          <p className="text-sm text-gray-600">
            Explore movies by genre, get detailed statistics, and discover hidden gems in your
            favorite categories.
          </p>
        </div>
      </div>
    </main>
  );
}