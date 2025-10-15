/**
 * useApiParams Hook
 *
 * Hook customizado para gerenciar estado dinâmico de parâmetros da API
 * Sincroniza ações do usuário (paginação, ordenação) com query params
 * e dispara novas requisições quando necessário
 *
 * @module useApiParams
 */

import { useState, useCallback, useMemo } from 'react';
import { updateDynamicValue, mergeDynamicValues } from '../services/url-builder';

/**
 * Hook para gerenciar parâmetros dinâmicos da API
 *
 * @param {Object} config - Configuração inicial dos parâmetros
 * @param {Array} config.queryParams - Array de query params configurados
 * @param {Function} onParamsChange - Callback executado quando params mudam
 * @returns {Object} Estado e funções para gerenciar params
 *
 * @example
 * const { dynamicValues, handlePageChange, handlePageSizeChange } = useApiParams({
 *   queryParams: [...],
 *   onParamsChange: (newValues) => console.log(newValues)
 * });
 */
export const useApiParams = (config = {}, onParamsChange) => {
  const { queryParams = [] } = config;

  // Estado dos valores dinâmicos dos parâmetros
  const [dynamicValues, setDynamicValues] = useState({});

  /**
   * Atualiza valores dinâmicos e notifica mudança
   */
  const updateValues = useCallback((newValues) => {
    setDynamicValues(current => {
      const merged = mergeDynamicValues(current, newValues);

      // Notifica mudança se callback fornecido
      if (onParamsChange && typeof onParamsChange === 'function') {
        onParamsChange(merged);
      }

      return merged;
    });
  }, [onParamsChange]);

  /**
   * Manipula mudança de página
   */
  const handlePageChange = useCallback((page) => {
    const updates = updateDynamicValue(queryParams, 'PAGE_CHANGE', page);
    updateValues(updates);
  }, [queryParams, updateValues]);

  /**
   * Manipula mudança de tamanho de página
   */
  const handlePageSizeChange = useCallback((pageSize) => {
    const updates = updateDynamicValue(queryParams, 'PAGE_SIZE_CHANGE', pageSize);
    updateValues(updates);
  }, [queryParams, updateValues]);

  /**
   * Manipula mudança de campo de ordenação
   */
  const handleSortFieldChange = useCallback((field) => {
    const updates = updateDynamicValue(queryParams, 'SORT_FIELD', field);
    updateValues(updates);
  }, [queryParams, updateValues]);

  /**
   * Manipula mudança de direção de ordenação
   */
  const handleSortOrderChange = useCallback((order) => {
    const updates = updateDynamicValue(queryParams, 'SORT_ORDER', order);
    updateValues(updates);
  }, [queryParams, updateValues]);

  /**
   * Manipula mudança de ordenação (campo + direção)
   */
  const handleSortChange = useCallback((field, order) => {
    const fieldUpdates = updateDynamicValue(queryParams, 'SORT_FIELD', field);
    const orderUpdates = updateDynamicValue(queryParams, 'SORT_ORDER', order);

    const combined = { ...fieldUpdates, ...orderUpdates };
    updateValues(combined);
  }, [queryParams, updateValues]);

  /**
   * Reseta valores dinâmicos para valores iniciais
   */
  const resetValues = useCallback(() => {
    const initialValues = {};

    // Volta para valores iniciais configurados
    queryParams
      .filter(p => p.enabled && p.name)
      .forEach(param => {
        initialValues[param.name] = param.value;
      });

    setDynamicValues(initialValues);

    if (onParamsChange && typeof onParamsChange === 'function') {
      onParamsChange(initialValues);
    }
  }, [queryParams, onParamsChange]);

  /**
   * Define um valor customizado para um parâmetro específico
   */
  const setCustomValue = useCallback((paramName, value) => {
    updateValues({ [paramName]: value });
  }, [updateValues]);

  /**
   * Obtém o valor atual de um parâmetro específico
   */
  const getParamValue = useCallback((paramName) => {
    // Retorna valor dinâmico se disponível, senão busca valor inicial
    if (dynamicValues.hasOwnProperty(paramName)) {
      return dynamicValues[paramName];
    }

    const param = queryParams.find(p => p.name === paramName && p.enabled);
    return param ? param.value : undefined;
  }, [dynamicValues, queryParams]);

  /**
   * Valores mesclados (iniciais + dinâmicos) prontos para uso
   */
  const mergedValues = useMemo(() => {
    const initial = {};

    // Coleta valores iniciais dos params habilitados
    queryParams
      .filter(p => p.enabled && p.name)
      .forEach(param => {
        initial[param.name] = param.value;
      });

    // Mescla com valores dinâmicos
    return { ...initial, ...dynamicValues };
  }, [queryParams, dynamicValues]);

  /**
   * Verifica se há valores dinâmicos alterados
   */
  const hasChanges = useMemo(() => {
    return Object.keys(dynamicValues).length > 0;
  }, [dynamicValues]);

  return {
    // Estado
    dynamicValues,
    mergedValues,
    hasChanges,

    // Handlers para ações do usuário
    handlePageChange,
    handlePageSizeChange,
    handleSortFieldChange,
    handleSortOrderChange,
    handleSortChange,

    // Utilitários
    setCustomValue,
    getParamValue,
    resetValues,
  };
};

export default useApiParams;
