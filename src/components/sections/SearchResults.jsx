import React, { useEffect, useState } from 'react';
import { useSearch } from '../../hooks/useSearch';
import ProductCard from './ProductCard';


/**
 * SearchResults component for displaying search results
 */
const SearchResults = () => {
  const { searchParams, searchResults, isLoading, error } = useSearch();
  const [filteredResults, setFilteredResults] = useState([]);

  // Apply filtering and sorting to search results
  useEffect(() => {
    if (!searchResults || !Array.isArray(searchResults)) {
      setFilteredResults([]);
      return;
    }

    let results = [...searchResults];

    // Apply price filter if min or max price is set
    if (searchParams.minPrice || searchParams.maxPrice) {
      results = results.filter(item => {
        const price = item.price || 0;
        const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : 0;
        const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : Infinity;
        
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Apply sorting if sort field is set
    if (searchParams.sort) {
      results.sort((a, b) => {
        let valueA, valueB;
        
        switch (searchParams.sort) {
          case 'price':
            valueA = a.price || 0;
            valueB = b.price || 0;
            break;
          case 'reviewAverage':
            valueA = a.reviewAverage || 0;
            valueB = b.reviewAverage || 0;
            break;
          case 'reviewCount':
            valueA = a.reviewCount || 0;
            valueB = b.reviewCount || 0;
            break;
          default:
            return 0;
        }
        
        // Apply sort direction
        return searchParams.sortDirection === 'asc' 
          ? valueA - valueB 
          : valueB - valueA;
      });
    }

    setFilteredResults(results);
  }, [searchResults, searchParams]);

  console.log(filteredResults)
  if (isLoading) {
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
      </div>
    );
  }

  if (filteredResults.length === 0 && searchParams.keyword) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">No results found!</strong>
        <span className="block sm:inline"> Try a different search term or adjust your filters.</span>
      </div>
    );
  }

  return (
    <div>
      {filteredResults.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredResults.length} results for "{searchParams.keyword}"
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredResults.map((product, index) => (
          <ProductCard key={`${product.platform}-${product.itemId || product.itemCode || index}`} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
