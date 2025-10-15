/**
 * Validators Utility
 * Funções de validação para campos do formulário
 */

import validator from 'validator';

/**
 * Valida URL
 * @param {string} url - URL a ser validada
 * @returns {object} { valid: boolean, message: string|null }
 */
export const validateURL = (url) => {
  if (!url || url.trim() === '') {
    return { valid: false, message: 'URL é obrigatória' };
  }

  if (!validator.isURL(url, { require_protocol: true })) {
    return { valid: false, message: 'URL inválida. Use o formato: https://example.com' };
  }

  return { valid: true, message: null };
};

/**
 * Valida campo obrigatório
 * @param {any} value - Valor a ser validado
 * @param {string} fieldName - Nome do campo
 * @returns {object} { valid: boolean, message: string|null }
 */
export const validateRequired = (value, fieldName = 'Campo') => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, message: `${fieldName} é obrigatório` };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { valid: false, message: `${fieldName} não pode estar vazio` };
  }

  return { valid: true, message: null };
};

/**
 * Valida JSON
 * @param {string} jsonString - String JSON a ser validada
 * @returns {object} { valid: boolean, message: string|null, parsed: object|null }
 */
export const validateJSON = (jsonString) => {
  if (!jsonString || jsonString.trim() === '') {
    return { valid: true, message: null, parsed: null };
  }

  try {
    const parsed = JSON.parse(jsonString);
    return { valid: true, message: null, parsed };
  } catch (error) {
    return { valid: false, message: `JSON inválido: ${error.message}`, parsed: null };
  }
};

/**
 * Valida código JavaScript
 * @param {string} code - Código JavaScript
 * @returns {object} { valid: boolean, message: string|null }
 */
export const validateJavaScript = (code) => {
  if (!code || code.trim() === '') {
    return { valid: true, message: null };
  }

  try {
    new Function(code);
    return { valid: true, message: null };
  } catch (error) {
    return { valid: false, message: `Erro de sintaxe: ${error.message}` };
  }
};

/**
 * Valida configuração de coluna
 * @param {object} column - Objeto de configuração de coluna
 * @returns {object} { valid: boolean, errors: array }
 */
export const validateColumnConfig = (column) => {
  const errors = [];

  if (!column.title || column.title.trim() === '') {
    errors.push('Título da coluna é obrigatório');
  }

  if (!column.dataIndex || column.dataIndex.trim() === '') {
    errors.push('Data Index é obrigatório');
  }

  if (!column.key || column.key.trim() === '') {
    errors.push('Key é obrigatório');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Valida configuração de API
 * @param {object} apiConfig - Objeto de configuração de API
 * @returns {object} { valid: boolean, errors: array }
 */
export const validateApiConfig = (apiConfig) => {
  const errors = [];

  const urlValidation = validateURL(apiConfig.baseURL);
  if (!urlValidation.valid) {
    errors.push(urlValidation.message);
  }

  // Validar headers
  if (apiConfig.headers && Array.isArray(apiConfig.headers)) {
    apiConfig.headers.forEach((header, index) => {
      if (header.key && !header.value) {
        errors.push(`Header ${index + 1}: valor é obrigatório quando a chave está definida`);
      }
      if (!header.key && header.value) {
        errors.push(`Header ${index + 1}: chave é obrigatória quando o valor está definido`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Valida número inteiro positivo
 * @param {any} value - Valor a ser validado
 * @param {string} fieldName - Nome do campo
 * @returns {object} { valid: boolean, message: string|null }
 */
export const validatePositiveInteger = (value, fieldName = 'Campo') => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, message: `${fieldName} é obrigatório` };
  }

  const num = Number(value);
  if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
    return { valid: false, message: `${fieldName} deve ser um número inteiro positivo` };
  }

  return { valid: true, message: null };
};

/**
 * Valida email
 * @param {string} email - Email a ser validado
 * @returns {object} { valid: boolean, message: string|null }
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { valid: false, message: 'Email é obrigatório' };
  }

  if (!validator.isEmail(email)) {
    return { valid: false, message: 'Email inválido' };
  }

  return { valid: true, message: null };
};

export default {
  validateURL,
  validateRequired,
  validateJSON,
  validateJavaScript,
  validateColumnConfig,
  validateApiConfig,
  validatePositiveInteger,
  validateEmail,
};
