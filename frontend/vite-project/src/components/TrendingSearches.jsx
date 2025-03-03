import React, { useState, useEffect } from 'react';

export default function TrendingSearches({ onSearchClick }) {
  const [trending, setTrending] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch('http://localhost:3000/trending-searches');
        if (!response.ok) {
          throw new Error('Failed to fetch trending searches');
        }
        const data = await response.json();
        setTrending(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch trending searches:', error);
        setError('Failed to load trending searches');
      }
    };

    fetchTrending();
    const interval = setInterval(fetchTrending, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="trending">
        <h2>Trending Searches</h2>
        <div className="trending-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="trending">
      <h2>Trending Searches</h2>
      <div className="trending-list">
        {trending.length === 0 ? (
          <div className="trending-empty">No trending searches yet</div>
        ) : (
          trending.map(([query, count]) => (
            <button
              key={query}
              onClick={() => onSearchClick(query)}
              className="trending-item"
            >
              <span className="trending-query">{query}</span>
              <span className="trending-count">{count}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}