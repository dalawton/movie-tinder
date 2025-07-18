'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MovieApiService } from '../services/movieApi';
import { GenreStats } from '../types/movie';

export default function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState<GenreStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const genreStats = await MovieApiService.getGenreStatistics();
      setStats(genreStats);
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  // Safe function to get genre count
  const getGenreCount = () => {
    if (!stats || !stats.genreDistribution) return 0;
    return Object.keys(stats.genreDistribution).length;
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="text-center mb-4">
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '16px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🎬 Movie Swipe
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: 'rgba(255,255,255,0.9)',
          marginBottom: '32px'
        }}>
          Discover your next favorite movie with intelligent recommendations
        </p>
      </div>

      {loading && (
        <div className="card" style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px', width: '24px', height: '24px' }}></div>
          <p>Loading database stats...</p>
        </div>
      )}

      {error && (
        <div className="card" style={{ 
          marginBottom: '32px', 
          textAlign: 'center',
          backgroundColor: '#fee2e2',
          borderColor: '#fca5a5',
          color: '#dc2626'
        }}>
          <p>⚠️ {error}</p>
          <button 
            onClick={loadStats}
            className="btn btn-primary mt-2"
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            Retry
          </button>
        </div>
      )}

      {stats && !loading && (
        <div className="card" style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h3 style={{ fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
            Database Stats
          </h3>
          <div className="grid grid-3" style={{ textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {stats.totalMovies || 0}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Movies</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                {getGenreCount()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Genres</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                {stats.averageConfidence ? (stats.averageConfidence * 100).toFixed(0) : '0'}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Avg Quality</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-3 gap-3" style={{ width: '100%', maxWidth: '800px' }}>
        <button
          onClick={() => router.push('/swipe')}
          className="btn btn-primary"
          style={{ padding: '24px', borderRadius: '12px' }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎲</div>
          <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Start Swiping</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Random movie discovery</div>
        </button>

        <button
          onClick={() => router.push('/search')}
          className="btn btn-primary"
          style={{ padding: '24px', borderRadius: '12px', background: '#8b5cf6' }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
          <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Search Movies</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Find specific movies</div>
        </button>

        <button
          onClick={() => router.push('/liked')}
          className="btn btn-success"
          style={{ padding: '24px', borderRadius: '12px' }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>❤️</div>
          <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Liked Movies</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Your favorites</div>
        </button>
      </div>

      <div className="grid grid-2 gap-3" style={{ maxWidth: '800px', marginTop: '32px' }}>
        <div className="card">
          <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            🤖 Smart Filtering
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Advanced algorithms analyze your preferences and provide personalized movie recommendations
            with confidence scores.
          </p>
        </div>
        <div className="card">
          <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            🎭 Genre Discovery
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Explore movies by genre, get detailed statistics, and discover hidden gems in your
            favorite categories.
          </p>
        </div>
      </div>

      {/* Footer note about setup */}
      {!stats && !loading && !error && (
        <div className="card mt-4" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h4 style={{ color: '#374151', marginBottom: '8px' }}>🚀 Getting Started</h4>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            To see real movie data, make sure your backend server is running or use the mock API service.
          </p>
        </div>
      )}
    </main>
  );
}