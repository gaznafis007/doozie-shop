import React, { createContext, useState } from 'react';

// Create context
const SearchContext = createContext();

/**
 * SearchProvider component to manage search state
 */
export const SearchProvider = ({ children }) => {
    const [searchParams, setSearchParams] = useState({
      keyword: '',
      minPrice: '',
      maxPrice: '',
      sort: '',
      sortDirection: 'desc',
      page: 1, // Add page to search params
    });
  
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const updateSearchParams = (newParams) => {
      setSearchParams(prev => ({
        ...prev,
        ...newParams,
      }));
    };
  
    const clearResults = () => {
      setSearchResults([]);
    };
  
    const value = {
      searchParams,
      searchResults,
      isLoading,
      error,
      updateSearchParams,
      setSearchResults,
      setIsLoading,
      setError,
      clearResults,
    };
  
    return (
      <SearchContext.Provider value={value}>
        {children}
      </SearchContext.Provider>
    );
  };

export default SearchContext;
