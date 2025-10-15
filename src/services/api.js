/**
 * Simplified API Service
 * Automatically includes token, headers, and body from configuration
 */

class ApiService {
  constructor(config = {}) {
    this.baseURL = config.baseURL || '';
    this.token = config.token || '';
    this.headers = config.headers || []; // [{ key, value }]
    this.body = config.body || []; // [{ key, value }]
    this.errorHandlers = config.errorHandlers || []; // [{ status, message, action, redirectUrl }]
    this.mapping = config.mapping || {}; // { dataPath, currentPage, totalPages, totalItems }
    this.pagination = config.pagination || {}; // Pagination config
  }

  /**
   * Builds headers object from array of key/value pairs
   */
  buildHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Add configured headers
    this.headers.forEach(({ key, value }) => {
      if (key && value) {
        headers[key] = value;
      }
    });

    // Add token if configured
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Builds body object from array of key/value pairs
   */
  buildBody(additionalBody = {}) {
    const body = {};

    // Add configured body params
    this.body.forEach(({ key, value }) => {
      if (key && value) {
        body[key] = value;
      }
    });

    // Merge with additional body
    return { ...body, ...additionalBody };
  }

  /**
   * Builds pagination query params
   */
  buildPaginationParams(page = 1, pageSize = 20) {
    if (!this.pagination || !this.pagination.enabled) {
      return '';
    }

    const {
      pageNumberParam = 'page',
      pageSizeParam = 'limit',
      startFrom = 1,
    } = this.pagination;

    const pageNumber = startFrom === 0 ? page - 1 : page;
    const params = new URLSearchParams();
    params.append(pageNumberParam, pageNumber);
    params.append(pageSizeParam, pageSize);

    return params.toString();
  }

  /**
   * Gets nested value from object using dot notation
   */
  getNestedValue(obj, path) {
    if (!path) return obj;
    return path.split('.').reduce((curr, key) => curr?.[key], obj);
  }

  /**
   * Applies response mapping
   */
  applyMapping(data) {
    // If no mapping configured or mapping is empty, check if data is array
    if (!this.mapping || Object.keys(this.mapping).length === 0) {
      // If data is already an array, return it wrapped
      if (Array.isArray(data)) {
        return {
          data,
          page: 1,
          totalPages: 1,
          total: data.length,
        };
      }
      return data;
    }

    const { dataPath, currentPage, totalPages, totalItems } = this.mapping;

    // Extract data using configured paths
    const extractedData = dataPath ? this.getNestedValue(data, dataPath) : data;
    const extractedPage = currentPage ? this.getNestedValue(data, currentPage) : 1;
    const extractedTotalPages = totalPages ? this.getNestedValue(data, totalPages) : 1;
    const extractedTotal = totalItems ? this.getNestedValue(data, totalItems) :
                           (Array.isArray(extractedData) ? extractedData.length : 0);

    return {
      data: extractedData,
      page: extractedPage,
      totalPages: extractedTotalPages,
      total: extractedTotal,
    };
  }

  /**
   * Handles HTTP errors based on configuration
   */
  handleError(status) {
    const handler = this.errorHandlers.find((h) => parseInt(h.status) === status);

    if (!handler) {
      console.error(`HTTP Error ${status}: No handler configured`);
      return;
    }

    switch (handler.action) {
      case 'alert':
        alert(handler.message);
        break;
      case 'redirect':
        window.location.href = handler.redirectUrl || '/';
        break;
      case 'log':
        console.error(`HTTP ${status}: ${handler.message}`);
        break;
      default:
        console.error(`Unknown error action: ${handler.action}`);
    }
  }

  /**
   * Makes an API request
   */
  async request(endpoint, options = {}) {
    let url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders();

    // Add pagination params to GET requests
    if (options.method === 'GET' && (options.page || options.pageSize)) {
      const paginationParams = this.buildPaginationParams(options.page, options.pageSize);
      if (paginationParams) {
        url += (endpoint.includes('?') ? '&' : '?') + paginationParams;
      }
    }

    const requestOptions = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    // Remove pagination params from options before fetch
    delete requestOptions.page;
    delete requestOptions.pageSize;

    // Add body for POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(options.method?.toUpperCase())) {
      const body = this.buildBody(options.body);
      requestOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        this.handleError(response.status);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return this.applyMapping(data);
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  /**
   * Convenience methods
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body = {}, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body = {}, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export default ApiService;
