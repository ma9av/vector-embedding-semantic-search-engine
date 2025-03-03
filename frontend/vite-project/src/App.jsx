import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import TrendingSearches from './components/TrendingSearches';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setSearchResults(data);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Search failed:', error);
    }
    setLoading(false);
  };

  const handleProductSelect = (product, navigate) => {
    setSelectedProduct(product);
    if (navigate) {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-container">
            
            <div className="navbar-search">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={
            <main className="main-content">
              {loading && <div className="loader">Searching...</div>}
              
              <div className="content-container">
                <div className="products-section">
                  <ProductList 
                    products={searchResults} 
                    onProductSelect={(product) => handleProductSelect(product, navigate)}
                  />
                </div>
                
                <aside className="sidebar">
                  <TrendingSearches onSearchClick={handleSearch} />
                </aside>
              </div>
            </main>
          } />
          
          <Route path="/product/:id" element={
            <main className="main-content">
              <ProductDetail 
                product={selectedProduct} 
                onProductSelect={handleProductSelect}
              />
            </main>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
