import React, { useState } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { saveSearchKeyword, searchItems } from '../../api/apiService';


/**
 * SearchBar component for searching products
 */
const SearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const { 
    updateSearchParams, 
    setSearchResults, 
    setIsLoading, 
    setError 
  } = useSearch();

  /**
   * Handle search form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Update search params in context
      updateSearchParams({ keyword: inputValue });
      
      // Call search API
      const results = await searchItems({ keyword: inputValue });
      
      // Save search keyword for recommender
      await saveSearchKeyword(inputValue);
      
      // Update search results in context
      setSearchResults(results);
    } catch (error) {
      setError('Failed to search items. Please try again.');
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search for products..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="search-input"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-r hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="search-button"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
