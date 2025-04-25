import axios from 'axios';

const API_BASE_URL = 'https://api.doozie.shop/v1/sandbox';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Search for items from Rakuten and Yahoo Japan
 * @param {Object} searchParams - Search parameters
 * @param {string} searchParams.keyword - Search keyword
 * @param {string} searchParams.sort - Sort option
 * @param {number} searchParams.minPrice - Minimum price filter
 * @param {number} searchParams.maxPrice - Maximum price filter
 * @returns {Promise} - Promise with search results
 */
export const searchItems = async (searchParams) => {
  try {
    const response = await apiClient.post('/v1/items/search', {
      rakuten_query_parameters: {
        keyword: searchParams.keyword,
        sort: searchParams.sort || 'standard',
      },
      yahoo_query_parameters: {
        query: searchParams.keyword,
        sort: searchParams.sort || '-score',
        price_from: searchParams.minPrice,
        price_to: searchParams.maxPrice,
      },
      from_scheduler: false
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching items:', error);
    throw error;
  }
};

/**
 * Get item details by platform and item ID
 * @param {string} platform - Platform (rakuten, yahoo, asos, amazon)
 * @param {string} itemId - Item ID
 * @returns {Promise} - Promise with item details
 */
export const getItemDetails = async (platform, itemId) => {
  try {
    const response = await apiClient.get(`/v1/items/${platform}/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting item details:', error);
    throw error;
  }
};

/**
 * Save search keyword for recommender training
 * @param {string} keyword - Search keyword to save
 * @returns {Promise} - Promise with response
 */
export const saveSearchKeyword = async (keyword) => {
  try {
    const response = await apiClient.post('/v1/search/save-keywords', {
      keyword
    });
    return response.data;
  } catch (error) {
    console.error('Error saving search keyword:', error);
    throw error;
  }
};

export default {
  searchItems,
  getItemDetails,
  saveSearchKeyword
};
