/**
 * URL Builder Service
 *
 * Serviço responsável por construir URLs dinâmicas com interpolação de variáveis
 * e montagem de query strings baseado nas configurações da API
 *
 * @module url-builder
 */

/**
 * Interpola path params na URL substituindo placeholders
 * Suporta ambos os formatos: {variableName} e :variableName
 *
 * @param {string} path - Path com placeholders (ex: /users/{userId} ou /users/:userId)
 * @param {Array} pathParams - Array de path params [{name, value, enabled}]
 * @returns {string} Path com valores interpolados
 *
 * @example
 * interpolatePathParams('/users/{userId}/posts/{postId}', [
 *   {name: 'userId', value: '123', enabled: true},
 *   {name: 'postId', value: '456', enabled: true}
 * ])
 * // returns: '/users/123/posts/456'
 *
 * interpolatePathParams('/users/:userId/posts/:postId', [
 *   {name: 'userId', value: '123', enabled: true},
 *   {name: 'postId', value: '456', enabled: true}
 * ])
 * // returns: '/users/123/posts/456'
 */
export const interpolatePathParams = (path, pathParams = []) => {
  let interpolatedPath = path;

  // Filtra apenas params habilitados com nome e valor
  const enabledParams = pathParams.filter(p => p.enabled && p.name && p.value);

  // Substitui cada placeholder pelo seu valor
  enabledParams.forEach(param => {
    // Suporte a {variableName}
    const curlyPlaceholder = `{${param.name}}`;
    interpolatedPath = interpolatedPath.replace(new RegExp(escapeRegex(curlyPlaceholder), 'g'), param.value);

    // Suporte a :variableName
    const colonPlaceholder = `:${param.name}`;
    interpolatedPath = interpolatedPath.replace(new RegExp(`${escapeRegex(colonPlaceholder)}(?=/|$)`, 'g'), param.value);
  });

  return interpolatedPath;
};

/**
 * Escapa caracteres especiais de regex
 * @param {string} string - String para escapar
 * @returns {string} String escapada
 */
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Constrói query string a partir de query params
 *
 * @param {Array} queryParams - Array de query params [{name, value, enabled}]
 * @param {Object} dynamicValues - Valores dinâmicos para sobrescrever (ex: {page: 2})
 * @returns {string} Query string formatada (ex: 'page=2&limit=20')
 *
 * @example
 * buildQueryString([
 *   {name: 'page', value: '1', enabled: true},
 *   {name: 'limit', value: '20', enabled: true}
 * ], {page: 2})
 * // returns: 'page=2&limit=20'
 */
export const buildQueryString = (queryParams = [], dynamicValues = {}) => {
  // Filtra apenas params habilitados com nome
  const enabledParams = queryParams.filter(p => p.enabled && p.name);

  // Mapeia para pares key=value
  const paramPairs = enabledParams.map(param => {
    // Usa valor dinâmico se disponível, senão usa valor configurado
    const value = dynamicValues.hasOwnProperty(param.name)
      ? dynamicValues[param.name]
      : param.value;

    return `${encodeURIComponent(param.name)}=${encodeURIComponent(value || '')}`;
  });

  return paramPairs.join('&');
};

/**
 * Normaliza a concatenação de base URL e path
 * Remove e adiciona barras conforme necessário
 *
 * @param {string} baseURL - URL base
 * @param {string} path - Path a ser concatenado
 * @returns {string} URL normalizada
 */
const normalizeUrl = (baseURL, path) => {
  // Remove trailing slash da baseURL
  let normalized = baseURL.trim();
  while (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  // Normaliza path
  let normalizedPath = path.trim();

  // Garante que path comece com / se não estiver vazio
  if (normalizedPath && !normalizedPath.startsWith('/')) {
    normalizedPath = '/' + normalizedPath;
  }

  // Remove leading slashes duplicadas do path
  while (normalizedPath.startsWith('//')) {
    normalizedPath = normalizedPath.slice(1);
  }

  return normalized + normalizedPath;
};

/**
 * Constrói URL completa com base nas configurações
 * FONTE DA VERDADE - Esta função é usada tanto para preview quanto para requisições reais
 *
 * @param {Object} config - Configuração da API
 * @param {string} config.baseURL - URL base (ex: https://api.example.com)
 * @param {string} config.path - Path da API (ex: /users/{userId} ou /users/:userId)
 * @param {Array} config.pathParams - Array de path params
 * @param {Array} config.queryParams - Array de query params
 * @param {Object} dynamicValues - Valores dinâmicos para query params
 * @param {boolean} debug - Se true, imprime logs no console
 * @returns {string} URL completa montada
 *
 * @example
 * buildApiUrl({
 *   baseURL: 'https://api.example.com',
 *   path: '/users/{userId}',
 *   pathParams: [{name: 'userId', value: '123', enabled: true}],
 *   queryParams: [{name: 'page', value: '1', enabled: true}]
 * }, {page: 2})
 * // returns: 'https://api.example.com/users/123?page=2'
 */
export const buildApiUrl = (config, dynamicValues = {}, debug = false) => {
  const { baseURL = '', path = '', pathParams = [], queryParams = [] } = config;

  if (debug) {
    console.log('🔨 [buildApiUrl] Iniciando construção de URL');
    console.log('  📦 Config:', { baseURL, path, pathParams, queryParams });
    console.log('  🔄 Dynamic Values:', dynamicValues);
  }

  // Valida se baseURL existe
  if (!baseURL || baseURL.trim() === '') {
    const error = 'baseURL is required';
    console.error('❌ [buildApiUrl]', error);
    throw new Error(error);
  }

  // Interpola path params ANTES de normalizar
  let processedPath = path;
  if (path && path.trim() !== '') {
    processedPath = interpolatePathParams(path, pathParams);

    if (debug) {
      console.log('  🔀 Path original:', path);
      console.log('  🔀 Path interpolado:', processedPath);
    }
  }

  // Normaliza concatenação de base + path
  let url = normalizeUrl(baseURL, processedPath);

  if (debug) {
    console.log('  🔗 URL base + path:', url);
  }

  // Adiciona query string se houver params habilitados
  const queryString = buildQueryString(queryParams, dynamicValues);
  if (queryString) {
    url += `?${queryString}`;

    if (debug) {
      console.log('  ❓ Query string:', queryString);
    }
  }

  if (debug) {
    console.log('  ✅ URL final:', url);
    console.log('');
  }

  return url;
};

/**
 * Valida se a URL é válida
 *
 * @param {string} url - URL para validar
 * @returns {Object} {isValid: boolean, error: string|null}
 */
export const validateUrl = (url) => {
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'URL vazia' };
  }

  try {
    new URL(url);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: 'URL inválida' };
  }
};

/**
 * Extrai todos os placeholders de um path
 * Suporta ambos os formatos: {variableName} e :variableName
 *
 * @param {string} path - Path com placeholders
 * @returns {Array<string>} Array com nomes dos placeholders
 *
 * @example
 * extractPlaceholders('/users/{userId}/posts/{postId}')
 * // returns: ['userId', 'postId']
 *
 * extractPlaceholders('/users/:userId/posts/:postId')
 * // returns: ['userId', 'postId']
 */
export const extractPlaceholders = (path) => {
  if (!path) return [];

  const placeholders = new Set();

  // Extrai placeholders com {variableName}
  const curlyRegex = /\{([^}]+)\}/g;
  const curlyMatches = [...path.matchAll(curlyRegex)];
  curlyMatches.forEach(match => placeholders.add(match[1]));

  // Extrai placeholders com :variableName
  const colonRegex = /:([a-zA-Z_][a-zA-Z0-9_]*)(?=\/|$)/g;
  const colonMatches = [...path.matchAll(colonRegex)];
  colonMatches.forEach(match => placeholders.add(match[1]));

  return Array.from(placeholders);
};

/**
 * Verifica se há placeholders não substituídos na URL
 *
 * @param {string} url - URL para verificar
 * @returns {Object} {hasUnresolved: boolean, placeholders: Array<string>}
 */
export const checkUnresolvedPlaceholders = (url) => {
  const placeholders = extractPlaceholders(url);

  return {
    hasUnresolved: placeholders.length > 0,
    placeholders,
  };
};

/**
 * Atualiza valores dinâmicos de query params com base em referência
 *
 * @param {Array} queryParams - Array de query params
 * @param {string} reference - Tipo de referência (PAGE_CHANGE, PAGE_SIZE_CHANGE, etc)
 * @param {*} value - Novo valor
 * @returns {Object} Objeto com valores dinâmicos atualizados
 *
 * @example
 * updateDynamicValue(queryParams, 'PAGE_CHANGE', 2)
 * // returns: {page: 2}
 */
export const updateDynamicValue = (queryParams, reference, value) => {
  const dynamicValues = {};

  // Encontra params com essa referência
  const matchingParams = queryParams.filter(
    p => p.enabled && p.reference === reference
  );

  // Atualiza valor de cada param correspondente
  matchingParams.forEach(param => {
    dynamicValues[param.name] = value;
  });

  return dynamicValues;
};

/**
 * Mescla valores dinâmicos existentes com novos valores
 *
 * @param {Object} current - Valores dinâmicos atuais
 * @param {Object} updates - Novos valores para mesclar
 * @returns {Object} Valores mesclados
 */
export const mergeDynamicValues = (current = {}, updates = {}) => {
  return { ...current, ...updates };
};

export default {
  buildApiUrl,
  interpolatePathParams,
  buildQueryString,
  validateUrl,
  extractPlaceholders,
  checkUnresolvedPlaceholders,
  updateDynamicValue,
  mergeDynamicValues,
};
