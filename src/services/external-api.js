/**
 * External API Service
 *
 * Handles generic API requests to external (non-Liferay) endpoints.
 * Supports authentication tokens, custom pagination parameters, and flexible response parsing.
 * Updated to support new URL builder system with path params and query params
 */

import axios from 'axios';
import { buildApiUrl } from './url-builder';

/**
 * Gets value from nested object using dot notation
 * Example: getNestedValue({data: {items: [1,2,3]}}, 'data.items') returns [1,2,3]
 */
const getNestedValue = (obj, path) => {
  if (!path) return obj;
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Loads token expiration configuration from localStorage
 */
const loadTokenExpirationConfig = () => {
  try {
    const stored = localStorage.getItem('dxp-token-expiration-config');
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading token expiration config:', error);
    return null;
  }
};

/**
 * Handles token expiration based on configuration
 */
const handleTokenExpiration = (error, config) => {
  if (!config || !config.enabled) {
    return;
  }

  let isExpired = false;

  // Check based on detection type
  if (config.detectType === 'statusCode') {
    const statusCodes = config.statusCodes || [401, 403];
    isExpired = statusCodes.includes(error.response?.status);
  } else if (config.detectType === 'responseProperty') {
    const propertyPath = config.propertyPath || 'error.code';
    const expectedValue = config.propertyValue || 'TOKEN_EXPIRED';
    const actualValue = getNestedValue(error.response?.data, propertyPath);
    isExpired = actualValue === expectedValue;
  } else if (config.detectType === 'customFunction') {
    try {
      if (config.functionName && typeof window[config.functionName] === 'function') {
        isExpired = window[config.functionName](error);
      }
    } catch (err) {
      console.error('Error executing custom token detection function:', err);
    }
  }

  if (isExpired) {
    console.log('Token expired detected, redirecting...', {
      timestamp: new Date().toISOString(),
      error: error.message,
      status: error.response?.status,
    });

    // Show message if configured
    if (config.message) {
      alert(config.message);
    }

    // Clear storage if configured
    if (config.clearStorage) {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (err) {
        console.error('Error clearing storage:', err);
      }
    }

    // Redirect after delay
    const delay = (config.redirectDelay || 0) * 1000;
    setTimeout(() => {
      if (config.redirectUrl) {
        window.location.href = config.redirectUrl;
      }
    }, delay);
  }
};

/**
 * Creates an axios instance for external API calls
 */
const createExternalApiInstance = (token = '') => {
  const config = {
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  if (token && token.trim()) {
    const authToken = token.trim().startsWith('Bearer ')
      ? token.trim()
      : `Bearer ${token.trim()}`;
    config.headers.Authorization = authToken;
  }

  const instance = axios.create(config);

  // Add response interceptor for token expiration detection
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const tokenConfig = loadTokenExpirationConfig();
      handleTokenExpiration(error, tokenConfig);
      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Fetches data from external API endpoint with customizable parameters
 *
 * @param {Object} apiConfig - Complete API configuration
 * @param {string} apiConfig.baseURL - Base URL
 * @param {string} apiConfig.path - API path
 * @param {Array} apiConfig.pathParams - Path parameters
 * @param {Array} apiConfig.queryParams - Query parameters
 * @param {string} apiConfig.token - Optional authentication token
 * @param {Object} dynamicValues - Dynamic values for query params (page, pageSize, etc)
 * @param {Object} mapping - Response mapping configuration
 * @returns {Promise<Object>} Response with data and pagination
 */
export const fetchData = async (apiConfig = {}, dynamicValues = {}, mapping = {}) => {
  try {
    const { token = '', headers: customHeaders = [] } = apiConfig;

    console.log('🚀 [fetchData] Iniciando requisição');
    console.log('  📋 API Config:', apiConfig);
    console.log('  🔄 Dynamic Values:', dynamicValues);

    // Cria instância do axios com token
    const api = createExternalApiInstance(token);

    // Adiciona headers personalizados
    customHeaders.forEach(header => {
      if (header.key && header.value) {
        api.defaults.headers.common[header.key] = header.value;
        console.log(`  📎 Header adicionado: ${header.key} = ${header.value}`);
      }
    });

    // Constrói URL completa usando url-builder (COM DEBUG ATIVADO)
    const fullUrl = buildApiUrl(apiConfig, dynamicValues, true);

    console.log('  🌐 Fazendo requisição GET para:', fullUrl);

    // Faz a requisição
    const response = await api.get(fullUrl);

    console.log('  ✅ Resposta recebida:', response.status, response.statusText);
    console.log('  📦 Dados recebidos:', Array.isArray(response.data) ? `Array com ${response.data.length} itens` : typeof response.data);

    // Extrai dados usando configuração de mapping
    const dataPath = mapping.dataPath || '';
    let data = dataPath
      ? getNestedValue(response.data, dataPath)
      : response.data;

    // Garante que data é um array
    if (!Array.isArray(data)) {
      data = [data];
    }

    // Extrai informações de paginação do mapping
    let total = data.length; // Fallback padrão
    let currentPage = 1;
    let totalPages = 1;

    // Total de itens
    if (mapping.totalItems) {
      const totalValue = getNestedValue(response.data, mapping.totalItems);
      total = totalValue !== undefined ? parseInt(totalValue, 10) : data.length;
    }

    // Página atual
    if (mapping.currentPage) {
      const currentValue = getNestedValue(response.data, mapping.currentPage);
      currentPage = currentValue !== undefined ? parseInt(currentValue, 10) : 1;
    }

    // Total de páginas
    if (mapping.totalPages) {
      const pagesValue = getNestedValue(response.data, mapping.totalPages);
      totalPages = pagesValue !== undefined ? parseInt(pagesValue, 10) : 1;
    }

    return {
      data,
      pagination: {
        current: currentPage,
        total,
        totalPages,
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
 * @param {Object} apiConfig - API configuration
 * @param {Object} mapping - Response mapping configuration
 * @returns {Promise<Object>} Test result
 */
export const testConnection = async (apiConfig = {}, mapping = {}) => {
  try {
    const { token = '', headers: customHeaders = [] } = apiConfig;

    console.log('🧪 [testConnection] Testando conexão');

    // Cria instância do axios com token
    const api = createExternalApiInstance(token);

    // Adiciona headers personalizados
    customHeaders.forEach(header => {
      if (header.key && header.value) {
        api.defaults.headers.common[header.key] = header.value;
      }
    });

    // Testa com valores mínimos (sem paginação para simplicidade)
    const testDynamicValues = {};

    // Constrói URL completa (COM DEBUG)
    const fullUrl = buildApiUrl(apiConfig, testDynamicValues, true);

    console.log('  🌐 Testando URL:', fullUrl);

    const response = await api.get(fullUrl);

    console.log('  ✅ Teste bem-sucedido:', response.status);

    // Tenta extrair dados usando configuração de mapping
    const dataPath = mapping.dataPath || '';
    let data = dataPath
      ? getNestedValue(response.data, dataPath)
      : response.data;

    // Normaliza para um único item para preview
    if (Array.isArray(data)) {
      data = data[0] || data;
    }

    return {
      success: true,
      status: response.status,
      sampleData: data,
      message: 'Conexão bem-sucedida',
      fullResponse: response.data, // Inclui resposta completa para debug
      url: fullUrl, // Inclui URL testada
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 0,
      message: error.response?.data?.message || error.message || 'Falha na conexão',
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }
};

/**
 * Parses API response structure and identifies available fields
 * Enhanced to work with configured data paths
 */
export const parseResponseStructure = (data, dataPath = '') => {
  try {
    // Extract data from nested path if provided
    let targetData = dataPath ? getNestedValue(data, dataPath) : data;

    // Get first item if array
    const sample = Array.isArray(targetData) ? targetData[0] : targetData;

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
        suggestAsColumn: ['string', 'number', 'boolean'].includes(type),
      };
    });

    // Generate suggested columns with IDs
    const suggestedColumns = fields
      .filter((f) => f.suggestAsColumn)
      .map((f, index) => ({
        id: `col_${Date.now()}_${index}`,
        key: f.name,
        title: f.name.charAt(0).toUpperCase() + f.name.slice(1).replace(/_/g, ' '),
        dataIndex: f.name,
        sortable: true,
        clickable: false,
      }));

    return {
      fields,
      sampleData: sample,
      isValid: true,
      suggestedColumns,
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

/**
 * Auto-generates columns from data if no columns configured
 * Uses first row to determine column structure
 */
export const autoGenerateColumns = (data) => {
  if (!data || data.length === 0) {
    return [];
  }

  const firstRow = data[0];
  const columns = [];

  Object.keys(firstRow).forEach((key, index) => {
    const value = firstRow[key];
    const isObject = typeof value === 'object' && value !== null;
    const isArray = Array.isArray(value);

    // Only create columns for primitive values
    if (!isObject && !isArray) {
      columns.push({
        id: `col_auto_${Date.now()}_${index}`,
        key,
        title: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        dataIndex: key,
        sortable: false,
        clickable: false,
      });
    }
  });

  return columns;
};

export default {
  fetchData,
  testConnection,
  parseResponseStructure,
  autoGenerateColumns,
  getNestedValue,
};
