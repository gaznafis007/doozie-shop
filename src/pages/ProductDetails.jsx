// src/components/sections/ItemDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getItemDetails } from '../../api/apiService';
import { useSearch } from '../../hooks/useSearch';

/**
 * ItemDetails component for displaying product details
 */
const ProductDetails = () => {
  const { platform, itemId } = useParams();
  const { setIsLoading, setError } = useSearch();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getItemDetails(platform, itemId);
        setItem(data);
      } catch (error) {
        setError('Failed to load item details. Please try again.');
        console.error('Error fetching item details:', error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [platform, itemId, setIsLoading, setError]);

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading item details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Search
      </Link>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src={item.imageUrl || 'https://via.placeholder.com/400x400?text=No+Image'}
              alt={item.name}
              className="w-full h-auto object-cover rounded"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-4">{item.name}</h1>
            <p className="text-xl text-blue-600 mb-2">¥{item.price.toLocaleString()}</p>
            <p className="text-gray-600 mb-2">
              Platform: {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </p>
            <p className="text-gray-600 mb-2">Shop: {item.shopName}</p>
            <p className="text-gray-600 mb-2">Availability: {item.availability}</p>
            <div className="flex items-center mb-4">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{item.reviewAverage} ({item.reviewCount} reviews)</span>
            </div>
            <p className="text-gray-700 mb-4">{item.description}</p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Visit Product Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;