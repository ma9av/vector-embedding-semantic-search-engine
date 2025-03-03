import React from 'react';
import { useNavigate } from 'react-router-dom';
import SimilarProducts from './SimilarProducts';

export default function ProductDetail({ product, onProductSelect }) {
  const navigate = useNavigate();

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-detail">
      <button 
        className="back-button"
        onClick={() => navigate(-1)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Search
      </button>

      <div className="product-detail-content">
        <div className="product-detail-image">
          <img src={product.image_url} alt={product.title} />
        </div>
        
        <div className="product-detail-info">
          <h1>{product.title}</h1>
          <span className="product-detail-category">{product.category}</span>
          <div className="product-detail-price">₹{product.price}</div>
          <p className="product-detail-description">{product.description}</p>
          
          <div className="product-detail-meta">
            <div className="meta-item">
              <span className="meta-label">Brand</span>
              <span className="meta-value">{product.brand || 'Generic'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Rating</span>
              <span className="meta-value">{product.rating || '4.5'}★</span>
            </div>
          </div>
        </div>
      </div>

      <div className="similar-products-section">
        <SimilarProducts 
          productId={product.id} 
          onProductSelect={(p) => {
            onProductSelect(p);
            navigate(`/product/${p.id}`);
          }}
        />
      </div>
    </div>
  );
} 