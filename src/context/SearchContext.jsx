import React, { createContext, useState } from 'react';

// Create context
const SearchContext = createContext();

/**
 * SearchProvider component to manage search state
 */
export const SearchProvider = ({ children }) => {
  // Search state
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    minPrice: '',
    maxPrice: '',
    sort: '',
    sortDirection: 'desc'
  });
  
  // Search results state
  const [searchResults, setSearchResults] = useState([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Error state
  const [error, setError] = useState(null);

  /**
   * Update search parameters
   * @param {Object} newParams - New search parameters
   */
  const updateSearchParams = (newParams) => {
    setSearchParams(prev => ({
      ...prev,
      ...newParams
    }));
  };

  /**
   * Clear search results
   */
  const clearResults = () => {
    setSearchResults([]);
  };

  // Context value
  const value = {
    searchParams,
    searchResults,
    isLoading,
    error,
    updateSearchParams,
    setSearchResults,
    setIsLoading,
    setError,
    clearResults
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
