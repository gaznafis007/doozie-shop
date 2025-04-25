import React from 'react';
import { useSearch } from '../../hooks/useSearch';
import { searchItems } from '../../api/apiService';

/**
 * SortOptions component for sorting products
 */
const SortOptions = () => {
  const { 
    searchParams, 
    updateSearchParams,
    setSearchResults,
    setIsLoading,
    setError
  } = useSearch();

  /**
   * Handle sort option change and trigger search
   * @param {Event} e - Select change event
   */
  const handleSortChange = async (e) => {
    const [field, direction] = e.target.value.split('-');
    
    // Update sort params in context
    updateSearchParams({ 
      sort: field,
      sortDirection: direction
    });
    
    // Only perform search if we have a keyword
    if (!searchParams.keyword) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Call search API with updated sort params
      const results = await searchItems({
        keyword: searchParams.keyword,
        minPrice: searchParams.minPrice,
        maxPrice: searchParams.maxPrice,
        sort: field,
        sortDirection: direction
      });
      
      // Update search results in context
      setSearchResults(results);
    } catch (error) {
      setError('Failed to sort items. Please try again.');
      console.error('Sort error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-3">Sort By</h3>
      <select
        value={`${searchParams.sort || ''}-${searchParams.sortDirection || 'desc'}`}
        onChange={handleSortChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        data-testid="sort-select"
      >
        <option value="-">Default Sorting</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="reviewAverage-desc">Review Average: High to Low</option>
        <option value="reviewAverage-asc">Review Average: Low to High</option>
        <option value="reviewCount-desc">Review Count: High to Low</option>
        <option value="reviewCount-asc">Review Count: Low to High</option>
      </select>
    </div>
  );
};

export default SortOptions;