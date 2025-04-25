import axios from 'axios';

const API_BASE_URL = 'https://api.doozie.shop/v1';

/**
 * Search items from Rakuten and Yahoo Japan API
 * @param {Object} params - Search parameters
 * @returns {Promise<Array>} - Search results
 */
export const searchItems = async (params) => {
  try {
    // Validate keyword
    if (!params.keyword || typeof params.keyword !== 'string' || params.keyword.trim() === '') {
      throw new Error('A valid keyword is required for search');
    }

    // Create the request body, excluding undefined values
    const requestBody = {
      rakuten_query_parameters: {
        keyword: params.keyword,
        sort: getSortParam(params.sort, params.sortDirection, 'rakuten'),
        hits: 20,
      },
      yahoo_query_parameters: {
        query: params.keyword,
        sort: getSortParam(params.sort, params.sortDirection, 'yahoo'),
        results: 20,
        ...(params.minPrice && { price_from: parseInt(params.minPrice) }),
        ...(params.maxPrice && { price_to: parseInt(params.maxPrice) }),
      },
      from_scheduler: false,
    };

    console.log('Sending request to API:', {
        url: `${API_BASE_URL}/items/search`,
        body: requestBody,
      });
    const response = await axios.post(`${API_BASE_URL}/items/search`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(response, response?.data)
    // Combine and normalize results from both platforms
    const combinedResults = [
      ...(response.data.rakuten?.Items?.map(item => normalizeRakutenItem(item)) || []),
      ...(response.data.yahoo?.hits?.map(item => normalizeYahooItem(item)) || []),
    ];
    console.log('Normalized results:', combinedResults);
    return combinedResults;
  } catch (error) {
    console.error('Error searching items:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    console.error('Error searching items:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get item details from specific platform
 * @param {string} platform - Platform (rakuten, yahoo)
 * @param {string} itemId - Item ID
 * @returns {Promise<Object>} - Item details
 */
export const getItemDetails = async (platform, itemId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/items/${platform}/${itemId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (platform === 'rakuten') {
      return normalizeRakutenItem(response.data);
    } else if (platform === 'yahoo') {
      return normalizeYahooItem(response.data);
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching ${platform} item details:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Save search keyword for recommender training
 * @param {string} keyword - Search keyword
 * @returns {Promise<Object>} - Response data
 */
export const saveSearchKeyword = async (keyword) => {
  try {
    if (!keyword || typeof keyword !== 'string' || keyword.trim() === '') {
      return null;
    }
    const response = await axios.post(`${API_BASE_URL}/search/save-keywords`, { keyword }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error saving search keyword:', error.response?.data || error.message);
    return null;
  }
};

/**
 * Get products for initial page load
 * @returns {Promise<Array>} - Popular products
 */
export const getInitialProducts = async () => {
  try {
    // Use a valid default keyword
    const defaultKeyword = 'shirt';
    return await searchItems({ keyword: defaultKeyword });
  } catch (error) {
    console.error('Error fetching initial products:', error.response?.data || error.message);
    return [];
  }
};

/**
 * Helper function to convert sort parameters to platform-specific format
 * @param {string} sortField - Sort field
 * @param {string} sortDirection - Sort direction (asc/desc)
 * @param {string} platform - Platform (rakuten/yahoo)
 * @returns {string} - Platform-specific sort parameter
 */
const getSortParam = (sortField, sortDirection, platform) => {
  if (!sortField) return platform === 'rakuten' ? 'standard' : '-score';

  if (platform === 'rakuten') {
    switch (sortField) {
      case 'price':
        return sortDirection === 'asc' ? '+itemPrice' : '-itemPrice';
      case 'reviewAverage':
        return '-reviewAverage'; // Rakuten only supports descending for reviews
      case 'reviewCount':
        return '-reviewCount'; // Rakuten only supports descending for count
      default:
        return 'standard';
    }
  } else if (platform === 'yahoo') {
    switch (sortField) {
      case 'price':
        return sortDirection === 'asc' ? '+price' : '-price';
      case 'reviewAverage':
        return sortDirection === 'asc' ? '+review_average' : '-review_average';
      case 'reviewCount':
        return sortDirection === 'asc' ? '+review_count' : '-review_count';
      default:
        return '-score';
    }
  }

  return '';
};

/**
 * Normalize Rakuten item data to common format
 * @param {Object} item - Rakuten item data
 * @returns {Object} - Normalized item data
 */
const normalizeRakutenItem = (item) => {
  const itemData = item.Item || item;

  return {
    itemId: itemData.itemCode,
    name: itemData.itemName,
    price: parseInt(itemData.itemPrice) || 0,
    imageUrl: itemData.mediumImageUrls?.[0]?.imageUrl || itemData.smallImageUrls?.[0]?.imageUrl || '',
    reviewAverage: parseFloat(itemData.reviewAverage) || 0,
    reviewCount: parseInt(itemData.reviewCount) || 0,
    platform: 'rakuten',
    url: itemData.itemUrl || '',
    description: itemData.itemCaption || '',
    shopName: itemData.shopName || '',
    availability: itemData.availability || 'Unknown',
    originalData: itemData,
  };
};

/**
 * Normalize Yahoo item data to common format
 * @param {Object} item - Yahoo item data
 * @returns {Object} - Normalized item data
 */
const normalizeYahooItem = (item) => {
  return {
    itemId: item.id,
    name: item.name || 'Unknown Product',
    price: parseInt(item.price) || 0,
    imageUrl: item.image?.medium || item.image?.small || '',
    reviewAverage: parseFloat(item.review?.rating) || 0,
    reviewCount: parseInt(item.review?.count) || 0,
    platform: 'yahoo',
    url: item.url || '',
    description: item.description || '',
    shopName: item.seller?.name || '',
    availability: item.in_stock ? 'Available' : 'Out of Stock',
    originalData: item,
  };
};

export default {
  searchItems,
  getItemDetails,
  saveSearchKeyword,
  getInitialProducts,
};