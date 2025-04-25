import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ProductCard component for displaying product information in search results
 */
const ProductCard = ({ product }) => {
  // Extract platform and itemId for the detail page link
  const platform = product.platform || 'unknown';
  const itemId = product.itemId || product.itemCode || product.id;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <Link to={`/item/${platform}/${itemId}`} className="block">
        <div className="h-48 overflow-hidden">
          <img 
            src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
            alt={product.name || 'Product'} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name || 'Unknown Product'}</h3>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-blue-600">
              ¥{product.price ? product.price.toLocaleString() : 'N/A'}
            </span>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{product.reviewAverage || 'N/A'}</span>
              <span className="text-gray-500 text-sm ml-1">({product.reviewCount || 0})</span>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Platform: {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
