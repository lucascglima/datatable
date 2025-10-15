/**
 * Simplified Storage Service
 * Manages configuration in localStorage
 */

const CONFIG_KEY = 'datatable_config';

export const saveConfig = (config) => {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Failed to save config:', error);
    return false;
  }
};

export const loadConfig = () => {
  try {
    const data = localStorage.getItem(CONFIG_KEY);
    return data ? JSON.parse(data) : getDefaultConfig();
  } catch (error) {
    console.error('Failed to load config:', error);
    return getDefaultConfig();
  }
};

export const clearConfig = () => {
  localStorage.removeItem(CONFIG_KEY);
};

const getDefaultConfig = () => ({
  api: {
    baseURL: '',
    token: '',
    headers: [],
    body: [],
  },
  endpoints: [],
  columns: [],
  mapping: {
    dataPath: '',
    currentPage: '',
    totalPages: '',
    totalItems: '',
  },
  pagination: {
    enabled: true,
    pageNumberParam: 'page',
    pageSizeParam: 'limit',
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    showSizeChanger: true,
    startFrom: 1,
  },
  events: {
    onRowClick: '',
    onButtonClick: '',
    onIconClick: '',
  },
  errorHandlers: [],
});
