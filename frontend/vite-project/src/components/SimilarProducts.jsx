import React, { useState, useEffect } from 'react';

export default function SimilarProducts({ productId, onProductSelect }) {
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${productId}/similar`);
        const data = await response.json();
        setSimilar(data);
      } catch (error) {
        console.error('Failed to fetch similar products:', error);
      }
    };

    if (productId) fetchSimilar();
  }, [productId]);

  if (!similar.length) return null;

  return (
    <div className="similar">
      <h2>Similar Products</h2>
      <div className="similar-list">
        {similar.map(product => (
          <div 
            key={product.id}
            className="similar-card"
            onClick={() => onProductSelect(product)}
          >
            <img src={product.image_url} alt={product.title} />
            <h4>{product.title}</h4>
            <span className="price">₹{product.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}