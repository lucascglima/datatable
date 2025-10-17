/**
 * Event Handler Utility
 * Executa código JavaScript customizado de forma segura
 */

import { validateJavaScript } from './validators';

/**
 * Executa código JavaScript customizado
 * @param {string} code - Código JavaScript a ser executado
 * @param {object} context - Contexto com variáveis disponíveis
 * @returns {any} Resultado da execução
 */
export const executeCustomEvent = (code, context = {}) => {
  if (!code || code.trim() === '') {
    return null;
  }

  try {
    // Cria função com acesso ao context
    const func = new Function(...Object.keys(context), code);
    return func(...Object.values(context));
  } catch (error) {
    console.error('Error executing custom event:', error);
    console.error('Code:', code);
    console.error('Context:', context);
    return null;
  }
};

/**
 * Cria handler de evento de linha
 * @param {string} code - Código JavaScript do handler
 * @returns {function} Handler function
 */
export const createRowClickHandler = (code) => {
  return (record, index, event) => {
    const context = { record, index, event };
    return executeCustomEvent(code, context);
  };
};

/**
 * Cria handler de evento de botão
 * @param {string} code - Código JavaScript do handler
 * @returns {function} Handler function
 */
export const createButtonClickHandler = (code) => {
  return (record, value, event) => {
    const context = { record, value, event };
    return executeCustomEvent(code, context);
  };
};

/**
 * Cria handler de evento de ícone
 * @param {string} code - Código JavaScript do handler
 * @returns {function} Handler function
 */
export const createIconClickHandler = (code) => {
  return (record, value, event) => {
    const context = { record, value, event };
    return executeCustomEvent(code, context);
  };
};

/**
 * Valida e retorna mensagem de erro amigável
 * @param {string} code - Código JavaScript
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export const getValidationError = (code) => {
  const result = validateJavaScript(code);
  if (!result.valid) {
    return `Erro de sintaxe: ${result.error}`;
  }
  return null;
};

export default {
  executeCustomEvent,
  createRowClickHandler,
  createButtonClickHandler,
  createIconClickHandler,
  getValidationError,
};
