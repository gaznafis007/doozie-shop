import React, { useEffect } from 'react';
import { useSearch } from '../hooks/useSearch';
import { getInitialProducts } from '../api/apiService';
import SearchBar from '../components/sections/SearchBar';
import FilterPanel from '../components/sections/FilterPanel';
import SortOptions from '../components/sections/SortOptions';
import SearchResults from '../components/sections/SearchResults';


/**
 * HomePage component for displaying search interface and results
 * Loads initial products on page load
 * @returns {JSX.Element} - HomePage component
 */
const Home = () => {
  const { setSearchResults, setIsLoading, setError } = useSearch();

  // Load initial products on page load
  useEffect(() => {
    const loadInitialProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getInitialProducts();
        setSearchResults(products);
      } catch (error) {
        setError('Failed to load initial products. Please try searching instead.');
        console.error('Error loading initial products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialProducts();
    
    


  }, []);


  console.log(SearchResults)
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
        </div>
      </div>
    </div>
  );
};

export default Home;