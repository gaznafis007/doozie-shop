import React from 'react';
import { useSearch } from '../../hooks/useSearch';
import { searchItems } from '../../api/apiService';

/**
 * FilterPanel component for filtering products by price range
 */
const FilterPanel = () => {
  const { 
    searchParams, 
    updateSearchParams, 
    setSearchResults, 
    setIsLoading, 
    setError 
  } = useSearch();

  /**
   * Handle minimum price change
   * @param {Event} e - Input change event
   */
  const handleMinPriceChange = (e) => {
    updateSearchParams({ minPrice: e.target.value });
  };

  /**
   * Handle maximum price change
   * @param {Event} e - Input change event
   */
  const handleMaxPriceChange = (e) => {
    updateSearchParams({ maxPrice: e.target.value });
  };

  /**
   * Apply price filter by searching with current params
   */
  const applyFilter = async () => {
    if (!searchParams.keyword) {
      setError('Please enter a search keyword first');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Call search API with current params including price filters
      const results = await searchItems({
        keyword: searchParams.keyword,
        minPrice: searchParams.minPrice,
        maxPrice: searchParams.maxPrice,
        sort: searchParams.sort,
        sortDirection: searchParams.sortDirection
      });
      
      // Update search results in context
      setSearchResults(results);
    } catch (error) {
      setError('Failed to apply filters. Please try again.');
      console.error('Filter error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-3">Filter by Price</h3>
      <div className="space-y-3">
        <div>
          <label htmlFor="min-price" className="block text-sm font-medium text-gray-700">
            Min Price
          </label>
          <input
            type="number"
            id="min-price"
            value={searchParams.minPrice}
            onChange={handleMinPriceChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Min Price"
            min="0"
            data-testid="min-price-input"
          />
        </div>
        <div>
          <label htmlFor="max-price" className="block text-sm font-medium text-gray-700">
            Max Price
          </label>
          <input
            type="number"
            id="max-price"
            value={searchParams.maxPrice}
            onChange={handleMaxPriceChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Max Price"
            min="0"
            data-testid="max-price-input"
          />
        </div>
        <button
          onClick={applyFilter}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="apply-filter-button"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;