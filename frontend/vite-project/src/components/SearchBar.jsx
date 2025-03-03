import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [liveResults, setLiveResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const performLiveSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setLiveResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery })
        });
        const data = await response.json();
        setLiveResults(data.slice(0, 6)); // Show only first 6 results in dropdown
      } catch (error) {
        console.error('Live search failed:', error);
      }
      setLoading(false);
    }, 300),
    []
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowDropdown(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(true);
    performLiveSearch(value);
  };

  const handleItemClick = (product) => {
    setQuery(product.title);
    onSearch(product.title);
    setShowDropdown(false);
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="search-form">
        
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => liveResults.length > 0 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder="Search products..."
          className="search-input"
        />
        {query && (
          <button 
            type="button" 
            onClick={() => setQuery('')}
            className="clear-button"
          >
            <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {showDropdown && (query.trim() || loading) && (
        <div className="search-dropdown">
          {loading ? (
            <div className="dropdown-loading">
              <div className="spinner"></div>
              Searching...
            </div>
          ) : liveResults.length > 0 ? (
            <>
              {liveResults.map(product => (
                <div
                  key={product.id}
                  className="dropdown-item"
                  onClick={() => handleItemClick(product)}
                >
                  <div className="dropdown-item-info">
                    <div className="dropdown-item-title">{product.title}</div>
                    <div className="dropdown-item-meta">
                      <span className="dropdown-item-price">₹{product.price}</span>
                      <span className="dropdown-item-category">{product.category}</span>
                    </div>
                  </div>
                </div>
              ))}
              
            </>
          ) : query.trim() ? (
            <div className="no-results-dropdown">No products found</div>
          ) : null}
        </div>
      )}
    </div>
  );
}