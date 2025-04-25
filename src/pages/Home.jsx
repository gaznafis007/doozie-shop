// src/components/pages/Home.jsx
import React, { useEffect } from 'react';
import { useSearch } from '../hooks/useSearch';
import { getInitialProducts } from '../api/apiService';
import SearchBar from '../components/sections/SearchBar';
import FilterPanel from '../components/sections/FilterPanel';
import SortOptions from '../components/sections/SortOptions';
import SearchResults from '../components/sections/SearchResults';
import Pagination from '../components/sections/Pagination';

/**
 * HomePage component for displaying search interface and results
 * Loads initial products on page load
 * @returns {JSX.Element} - HomePage component
 */
const Home = () => {
  const { setSearchResults, setIsLoading, setError, updateSearchParams } = useSearch();

  useEffect(() => {
    const loadInitialProducts = async () => {
      try {
        setIsLoading(true);
        setError(null); // Clear any previous errors
        const products = await getInitialProducts();
        console.log('Initial products loaded:', products);
        updateSearchParams({ keyword: 'shirt' });
        setSearchResults(products);
      } catch (error) {
        const errorMessage = error.response?.data?.detail || 'Failed to load initial products. Please try searching instead.';
        setError(errorMessage);
        console.error('Error loading initial products:', error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialProducts();
  }, [setIsLoading, setError, setSearchResults, updateSearchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">E-Commerce Product Search</h1>

      <SearchBar />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <FilterPanel />
          <SortOptions />
        </div>

        <div className="md:col-span-3">
          <SearchResults />
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default Home;