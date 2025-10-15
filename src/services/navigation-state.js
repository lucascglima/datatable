/**
 * Navigation State Service
 * Gerencia estado de navegação e posição de scroll por tabela
 *
 * Permite salvar e restaurar:
 * - Posição de scroll
 * - Página atual da tabela
 * - Filtros aplicados
 * - Estado de expansão de linhas
 */

const STORAGE_KEY = 'datatable_navigation_state';

/**
 * Estrutura do estado de navegação:
 * {
 *   [tableId]: {
 *     scrollPosition: { x: 0, y: 0 },
 *     currentPage: 1,
 *     pageSize: 10,
 *     filters: {},
 *     expandedRows: [],
 *     lastVisited: ISO timestamp
 *   }
 * }
 */

/**
 * Carrega todos os estados de navegação do localStorage
 */
export const loadNavigationStates = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Erro ao carregar estados de navegação:', error);
    return {};
  }
};

/**
 * Salva todos os estados de navegação no localStorage
 */
export const saveNavigationStates = (states) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  } catch (error) {
    console.error('Erro ao salvar estados de navegação:', error);
  }
};

/**
 * Carrega o estado de navegação de uma tabela específica
 */
export const loadTableNavigationState = (tableId) => {
  const states = loadNavigationStates();
  return states[tableId] || null;
};

/**
 * Salva o estado de navegação de uma tabela específica
 */
export const saveTableNavigationState = (tableId, state) => {
  const states = loadNavigationStates();
  states[tableId] = {
    ...state,
    lastVisited: new Date().toISOString(),
  };
  saveNavigationStates(states);
};

/**
 * Remove o estado de navegação de uma tabela
 */
export const clearTableNavigationState = (tableId) => {
  const states = loadNavigationStates();
  delete states[tableId];
  saveNavigationStates(states);
};

/**
 * Salva a posição de scroll atual
 */
export const saveScrollPosition = (tableId, position) => {
  const states = loadNavigationStates();
  if (!states[tableId]) {
    states[tableId] = {};
  }
  states[tableId].scrollPosition = position;
  states[tableId].lastVisited = new Date().toISOString();
  saveNavigationStates(states);
};

/**
 * Restaura a posição de scroll
 */
export const restoreScrollPosition = (tableId) => {
  const state = loadTableNavigationState(tableId);
  return state?.scrollPosition || { x: 0, y: 0 };
};

/**
 * Salva o estado de paginação
 */
export const savePaginationState = (tableId, currentPage, pageSize) => {
  const states = loadNavigationStates();
  if (!states[tableId]) {
    states[tableId] = {};
  }
  states[tableId].currentPage = currentPage;
  states[tableId].pageSize = pageSize;
  states[tableId].lastVisited = new Date().toISOString();
  saveNavigationStates(states);
};

/**
 * Restaura o estado de paginação
 */
export const restorePaginationState = (tableId) => {
  const state = loadTableNavigationState(tableId);
  return {
    currentPage: state?.currentPage || 1,
    pageSize: state?.pageSize || 10,
  };
};

/**
 * Salva filtros aplicados
 */
export const saveFiltersState = (tableId, filters) => {
  const states = loadNavigationStates();
  if (!states[tableId]) {
    states[tableId] = {};
  }
  states[tableId].filters = filters;
  states[tableId].lastVisited = new Date().toISOString();
  saveNavigationStates(states);
};

/**
 * Restaura filtros
 */
export const restoreFiltersState = (tableId) => {
  const state = loadTableNavigationState(tableId);
  return state?.filters || {};
};

/**
 * Limpa estados antigos (mais de 30 dias)
 */
export const cleanupOldStates = () => {
  const states = loadNavigationStates();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let cleaned = false;
  Object.keys(states).forEach((tableId) => {
    const state = states[tableId];
    if (state.lastVisited) {
      const lastVisited = new Date(state.lastVisited);
      if (lastVisited < thirtyDaysAgo) {
        delete states[tableId];
        cleaned = true;
      }
    }
  });

  if (cleaned) {
    saveNavigationStates(states);
  }
};

/**
 * Hook para gerenciar estado de navegação de forma conveniente
 * (para uso futuro com React)
 */
export const createNavigationStateManager = (tableId) => {
  return {
    save: (state) => saveTableNavigationState(tableId, state),
    load: () => loadTableNavigationState(tableId),
    clear: () => clearTableNavigationState(tableId),
    saveScroll: (position) => saveScrollPosition(tableId, position),
    restoreScroll: () => restoreScrollPosition(tableId),
    savePagination: (page, size) => savePaginationState(tableId, page, size),
    restorePagination: () => restorePaginationState(tableId),
    saveFilters: (filters) => saveFiltersState(tableId, filters),
    restoreFilters: () => restoreFiltersState(tableId),
  };
};

// Limpar estados antigos ao carregar
cleanupOldStates();
