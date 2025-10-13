/**
 * External API Service
 *
 * Handles generic API requests to external (non-Liferay) endpoints.
 * Supports authentication tokens and pagination.
 */

import axios from 'axios';

/**
 * Creates an axios instance for external API calls
 *
 * @param {string} token - Optional authentication token
 * @returns {Object} Axios instance
 */
const createExternalApiInstance = (token = '') => {
  const config = {
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  // Add authentication header if token provided
  if (token && token.trim()) {
    // Check if token already includes 'Bearer'
    const authToken = token.trim().startsWith('Bearer ')
      ? token.trim()
      : `Bearer ${token.trim()}`;
    config.headers.Authorization = authToken;
  }

  return axios.create(config);
};

/**
 * Fetches data from external API endpoint
 *
 * @param {string} endpoint - Full API URL
 * @param {string} token - Optional authentication token
 * @param {Object} pagination - Pagination parameters
 * @returns {Promise<Object>} Response with data and pagination
 */
export const fetchData = async (endpoint, token = '', pagination = {}) => {
  try {
    const api = createExternalApiInstance(token);
    const { page = 1, pageSize = 20 } = pagination;

    // Build query parameters
    const params = {
      _page: page,
      _limit: pageSize,
    };

    const response = await api.get(endpoint, { params });

    // Handle different response formats
    let data = response.data;
    let total = 0;

    // If response is array (common in REST APIs)
    if (Array.isArray(data)) {
      total = parseInt(response.headers['x-total-count'] || data.length);
    } else if (data.items && Array.isArray(data.items)) {
      // If response has items property (Liferay-style)
      data = data.items;
      total = data.totalCount || data.length;
    } else if (data.data && Array.isArray(data.data)) {
      // If response has data property
      total = data.total || data.data.length;
      data = data.data;
    }

    return {
      data: Array.isArray(data) ? data : [data],
      pagination: {
        current: page,
        pageSize,
        total,
      },
      success: true,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw {
      message: error.response?.data?.message || error.message || 'Failed to fetch data',
      status: error.response?.status,
      error,
    };
  }
};

/**
 * Tests connection to API endpoint
 *
 * @param {string} endpoint - Full API URL
 * @param {string} token - Optional authentication token
 * @returns {Promise<Object>} Test result with status and sample data
 */
export const testConnection = async (endpoint, token = '') => {
  try {
    const api = createExternalApiInstance(token);

    // Fetch just first item or small sample
    const response = await api.get(endpoint, {
      params: {
        _limit: 1,
        _page: 1,
      },
    });

    let data = response.data;

    // Normalize response format
    if (Array.isArray(data)) {
      data = data[0] || data;
    } else if (data.items && Array.isArray(data.items)) {
      data = data.items[0] || data.items;
    } else if (data.data) {
      data = Array.isArray(data.data) ? data.data[0] : data.data;
    }

    return {
      success: true,
      status: response.status,
      sampleData: data,
      message: 'Connection successful',
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 0,
      message: error.response?.data?.message || error.message || 'Connection failed',
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }
};

/**
 * Parses API response structure and identifies available fields
 *
 * @param {Object|Array} data - API response data
 * @returns {Object} Parsed structure with field suggestions
 */
export const parseResponseStructure = (data) => {
  try {
    // Get first item if array
    const sample = Array.isArray(data) ? data[0] : data;

    if (!sample || typeof sample !== 'object') {
      return {
        fields: [],
        sampleData: sample,
        isValid: false,
      };
    }

    // Extract field names and types
    const fields = Object.keys(sample).map((key) => {
      const value = sample[key];
      const type = Array.isArray(value)
        ? 'array'
        : value === null
        ? 'null'
        : typeof value;

      return {
        name: key,
        type,
        sampleValue: value,
        // Suggest as column if it's a primitive type
        suggestAsColumn: ['string', 'number', 'boolean'].includes(type),
      };
    });

    return {
      fields,
      sampleData: sample,
      isValid: true,
      suggestedColumns: fields
        .filter((f) => f.suggestAsColumn)
        .map((f) => ({
          key: f.name,
          title: f.name.charAt(0).toUpperCase() + f.name.slice(1),
          dataIndex: f.name,
          sortable: true,
          clickable: false,
        })),
    };
  } catch (error) {
    console.error('Error parsing response structure:', error);
    return {
      fields: [],
      sampleData: null,
      isValid: false,
      error: error.message,
    };
  }
};

export default {
  fetchData,
  testConnection,
  parseResponseStructure,
};
