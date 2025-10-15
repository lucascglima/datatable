/**
 * Duplicate Checker Utility
 *
 * Detects duplicate records in table data based on unique key.
 * Provides options to warn, remove, or highlight duplicates.
 */

/**
 * Checks for duplicate records in data array
 *
 * @param {Array} data - Array of records to check
 * @param {string} uniqueKey - Key to use for uniqueness check (default: 'id')
 * @returns {Object} Result with duplicates info
 */
export const checkDuplicates = (data, uniqueKey = 'id') => {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      hasDuplicates: false,
      duplicates: [],
      duplicateKeys: [],
      uniqueData: data,
    };
  }

  const seen = new Map();
  const duplicates = [];
  const duplicateKeys = new Set();

  data.forEach((item, index) => {
    const key = item[uniqueKey];

    if (key === undefined || key === null) {
      console.warn(`Item at index ${index} has no value for unique key "${uniqueKey}"`);
      return;
    }

    if (seen.has(key)) {
      // This is a duplicate
      const firstOccurrence = seen.get(key);
      duplicates.push({
        key,
        firstIndex: firstOccurrence.index,
        firstItem: firstOccurrence.item,
        duplicateIndex: index,
        duplicateItem: item,
      });
      duplicateKeys.add(key);
    } else {
      seen.set(key, { index, item });
    }
  });

  // Get unique data (remove duplicates)
  const uniqueData = data.filter((item, index) => {
    const key = item[uniqueKey];
    const firstOccurrence = seen.get(key);
    return firstOccurrence && firstOccurrence.index === index;
  });

  return {
    hasDuplicates: duplicates.length > 0,
    duplicates,
    duplicateKeys: Array.from(duplicateKeys),
    uniqueData,
    totalRecords: data.length,
    uniqueRecords: uniqueData.length,
    duplicateCount: duplicates.length,
  };
};

/**
 * Handles duplicates based on action configuration
 *
 * @param {Array} data - Array of records
 * @param {Object} config - Duplicate handling configuration
 * @returns {Object} Processed data and notifications
 */
export const handleDuplicates = (data, config = {}) => {
  const {
    enabled = true,
    uniqueKey = 'id',
    action = 'warn', // 'warn', 'remove', 'highlight'
    highlightColor = '#fff3cd',
    showNotification = true,
  } = config;

  if (!enabled) {
    return {
      data,
      notifications: [],
    };
  }

  const result = checkDuplicates(data, uniqueKey);
  const notifications = [];

  if (!result.hasDuplicates) {
    return {
      data,
      notifications: [],
    };
  }

  // Build notification message
  if (showNotification) {
    notifications.push({
      type: 'warning',
      message: 'Dados duplicados detectados',
      description: `${result.duplicateCount} registro(s) duplicado(s) encontrado(s) com base na chave "${uniqueKey}". ${
        action === 'remove' ? 'Duplicatas foram removidas automaticamente.' :
        action === 'highlight' ? 'Duplicatas estão destacadas na tabela.' :
        'Verifique a fonte dos dados.'
      }`,
      duration: 5,
      details: {
        totalRecords: result.totalRecords,
        uniqueRecords: result.uniqueRecords,
        duplicateCount: result.duplicateCount,
        duplicateKeys: result.duplicateKeys,
      },
    });
  }

  // Apply action
  let processedData = data;

  switch (action) {
    case 'remove':
      processedData = result.uniqueData;
      console.info('Duplicates removed:', {
        original: result.totalRecords,
        afterRemoval: result.uniqueRecords,
        removed: result.duplicateCount,
      });
      break;

    case 'highlight':
      // Add highlight property to duplicates
      processedData = data.map((item, index) => {
        const key = item[uniqueKey];
        const isDuplicate = result.duplicateKeys.includes(key);

        if (isDuplicate) {
          return {
            ...item,
            _isDuplicate: true,
            _highlightColor: highlightColor,
          };
        }

        return item;
      });
      break;

    case 'warn':
    default:
      // Just log warning
      console.warn('⚠️ Duplicate records detected:', {
        uniqueKey,
        duplicateCount: result.duplicateCount,
        duplicateKeys: result.duplicateKeys,
        details: result.duplicates,
      });
      break;
  }

  return {
    data: processedData,
    notifications,
    duplicateInfo: result,
  };
};

/**
 * Gets duplicate details for display
 *
 * @param {Array} duplicates - Array of duplicate objects
 * @returns {Array} Formatted duplicate details
 */
export const getDuplicateDetails = (duplicates) => {
  return duplicates.map(dup => ({
    key: dup.key,
    message: `Registro duplicado encontrado`,
    firstOccurrence: {
      index: dup.firstIndex,
      data: dup.firstItem,
    },
    duplicate: {
      index: dup.duplicateIndex,
      data: dup.duplicateItem,
    },
  }));
};

/**
 * Validates duplicate configuration
 *
 * @param {Object} config - Duplicate config to validate
 * @returns {Object} Validation result
 */
export const validateDuplicateConfig = (config) => {
  const errors = [];

  if (config.enabled && !config.uniqueKey) {
    errors.push('uniqueKey é obrigatório quando duplicate check está habilitado');
  }

  if (config.action && !['warn', 'remove', 'highlight'].includes(config.action)) {
    errors.push(`action inválida: ${config.action}. Deve ser 'warn', 'remove' ou 'highlight'`);
  }

  if (config.highlightColor && !/^#[0-9A-Fa-f]{6}$/.test(config.highlightColor)) {
    errors.push('highlightColor deve estar em formato hexadecimal (#RRGGBB)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Creates default duplicate configuration
 *
 * @returns {Object} Default config
 */
export const getDefaultDuplicateConfig = () => {
  return {
    enabled: true,
    uniqueKey: 'id',
    action: 'warn',
    highlightColor: '#fff3cd',
    showNotification: true,
  };
};

export default {
  checkDuplicates,
  handleDuplicates,
  getDuplicateDetails,
  validateDuplicateConfig,
  getDefaultDuplicateConfig,
};
