import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductList({ products, onProductSelect }) {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    onProductSelect(product);
    navigate(`/product/${product.id}`);
  };
  
  return (
    <div className="product-container">
      <h2 className="product-heading">Search Results</h2>
      <div className="product-scroll">
        <div className="product-row">
          {products.map(product => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => handleProductClick(product)}
            >
              <div className="product-image-container">
                <img src={product.image_url} alt={product.title} />
              </div>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <div className="product-meta">
                <span className="price">₹{product.price}</span>
                <span className="category">{product.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}