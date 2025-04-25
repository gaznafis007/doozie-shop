import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemDetails } from '../../api/apiService';

/**
 * ProductDetails component for displaying detailed product information
 */
const ProductDetails = () => {
  const { platform, itemId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getItemDetails(platform, itemId);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (platform && itemId) {
      fetchProductDetails();
    }
  }, [platform, itemId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <button 
          onClick={handleGoBack}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Product not found!</strong>
        <span className="block sm:inline"> The requested product could not be found.</span>
        <button 
          onClick={handleGoBack}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <button 
        onClick={handleGoBack}
        className="mb-6 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 flex items-center"
      >
        <span>← Back to Search</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="flex justify-center items-center">
          <img 
            src={product.imageUrl || 'https://via.placeholder.com/500x500?text=No+Image'} 
            alt={product.name || 'Product'} 
            className="max-w-full max-h-96 object-contain"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-2xl font-bold mb-4">{product.name || 'Unknown Product'}</h1>
          
          <div className="mb-4">
            <span className="text-3xl font-bold text-blue-600">
              ¥{product.price ? product.price.toLocaleString() : 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center mb-4">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{product.reviewAverage || 'N/A'}</span>
            <span className="text-gray-500 text-sm ml-1">({product.reviewCount || 0} reviews)</span>
          </div>
          
          {product.description && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Details</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Platform: {platform.charAt(0).toUpperCase() + platform.slice(1)}</li>
              <li>Item ID: {itemId}</li>
              {product.brand && <li>Brand: {product.brand}</li>}
              {product.availability && <li>Availability: {product.availability}</li>}
              {product.condition && <li>Condition: {product.condition}</li>}
            </ul>
          </div>
          
          {product.url && (
            <a 
              href={product.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded hover:bg-blue-700"
            >
              View on {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
