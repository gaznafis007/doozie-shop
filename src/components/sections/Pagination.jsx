import React from 'react';
import { useSearch } from '../../hooks/useSearch';
import { searchItems } from '../../api/apiService';

/**
 * Pagination component for navigating search results
 */
const Pagination = () => {
  const { searchParams, updateSearchParams, setSearchResults, setIsLoading, setError } = useSearch();

  const handlePageChange = async (newPage) => {
    if (newPage < 1 || !searchParams.keyword) return;

    try {
      setIsLoading(true);
      setError(null);
      updateSearchParams({ page: newPage });
      const results = await searchItems({
        ...searchParams,
        page: newPage,
      });
      setSearchResults(results);
    } catch (error) {
      setError('Failed to load page. Please try again.');
      console.error('Pagination error:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center space-x-2 mt-6">
      <button
        onClick={() => handlePageChange(searchParams.page - 1)}
        disabled={searchParams.page === 1}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
      >
        Previous
      </button>
      <span className="px-4 py-2 bg-gray-100 rounded">
        Page {searchParams.page}
      </span>
      <button
        onClick={() => handlePageChange(searchParams.page + 1)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;