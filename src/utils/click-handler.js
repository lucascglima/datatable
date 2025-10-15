/**
 * Click Handler Utility
 *
 * Manages click events with proper z-index and event propagation control.
 * Handles row clicks, button clicks, modals, and redirects.
 */

/**
 * Creates a row click handler with event propagation control
 *
 * @param {Object} config - Click configuration
 * @param {Function} config.onClick - Click handler function
 * @param {string} config.action - Action type: 'modal', 'redirect', 'function'
 * @param {Object} config.modalConfig - Modal configuration
 * @param {string} config.redirectUrl - Redirect URL (supports ${field} variables)
 * @param {string} config.functionName - Global function name to execute
 * @returns {Function} Click handler
 */
export const createRowClickHandler = (config = {}) => {
  return (record, index, event) => {
    // Check if click originated from a button/link (high z-index element)
    const target = event?.target;
    if (target) {
      // Check if clicked element or any parent has high z-index or is interactive
      const isInteractiveElement =
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.ant-btn') ||
        target.closest('[role="button"]') ||
        target.classList.contains('clickable-action');

      if (isInteractiveElement) {
        // Don't trigger row click if clicking on interactive elements
        return;
      }
    }

    // Execute configured action
    switch (config.action) {
      case 'modal':
        handleModalAction(record, config.modalConfig);
        break;

      case 'redirect':
        handleRedirectAction(record, config.redirectUrl);
        break;

      case 'function':
        handleFunctionAction(record, config.functionName);
        break;

      default:
        if (config.onClick) {
          config.onClick(record, index);
        }
        break;
    }
  };
};

/**
 * Creates a button/icon click handler that prevents row click
 *
 * @param {Function} onClick - Click handler function
 * @param {Object} options - Additional options
 * @returns {Function} Click handler with propagation control
 */
export const createButtonClickHandler = (onClick, options = {}) => {
  return (record, index, event) => {
    // Stop event propagation to prevent row click
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    // Execute the onClick handler
    if (onClick) {
      onClick(record, index, event);
    }
  };
};

/**
 * Handles modal action
 *
 * @param {Object} record - Row data
 * @param {Object} modalConfig - Modal configuration
 */
const handleModalAction = (record, modalConfig = {}) => {
  const {
    type = 'json', // 'json' or 'list'
    title = 'Detalhes',
    fields = [], // Array of field names to show
  } = modalConfig;

  // Create modal content based on type
  let content;
  if (type === 'json') {
    content = JSON.stringify(record, null, 2);
  } else if (type === 'list') {
    const fieldList = fields.length > 0 ? fields : Object.keys(record);
    content = fieldList
      .map((field) => {
        const value = getNestedValue(record, field);
        return `${field}: ${value}`;
      })
      .join('\n');
  }

  // Show modal using Ant Design Modal (assumes Modal is available globally)
  if (window.antdModal) {
    // Create pre element as string since we can't use JSX in .js files
    const contentHtml = `<pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; overflow: auto; white-space: pre-wrap;">${content}</pre>`;

    window.antdModal.info({
      title,
      content: contentHtml,
      width: 600,
    });
  } else {
    // Fallback to alert
    alert(`${title}\n\n${content}`);
  }
};

/**
 * Handles redirect action
 *
 * @param {Object} record - Row data
 * @param {string} redirectUrl - URL template with variables
 */
const handleRedirectAction = (record, redirectUrl) => {
  if (!redirectUrl) return;

  // Replace variables in URL
  const processedUrl = replaceVariables(redirectUrl, record);

  // Navigate to URL
  window.location.href = processedUrl;
};

/**
 * Handles custom function action
 *
 * @param {Object} record - Row data
 * @param {string} functionName - Global function name
 */
const handleFunctionAction = (record, functionName) => {
  if (!functionName) return;

  // Check if function exists in global scope
  if (typeof window[functionName] === 'function') {
    try {
      window[functionName](record);
    } catch (error) {
      console.error(`Error executing function ${functionName}:`, error);
    }
  } else {
    console.error(`Function ${functionName} not found in global scope`);
  }
};

/**
 * Gets value from nested object using dot notation
 *
 * @param {Object} obj - Object to extract from
 * @param {string} path - Dot notation path
 * @returns {*} Value at path
 */
const getNestedValue = (obj, path) => {
  if (!path) return obj;
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Replaces variables in template string with record values
 * Supports ${field} and ${nested.field} syntax
 *
 * @param {string} template - Template string
 * @param {Object} record - Record data
 * @returns {string} Processed string
 */
const replaceVariables = (template, record) => {
  if (!template || typeof template !== 'string') return template;

  return template.replace(/\$\{([^}]+)\}/g, (match, fieldPath) => {
    const value = getNestedValue(record, fieldPath.trim());
    return value !== undefined && value !== null ? value : '';
  });
};

/**
 * Adds click prevention class to element
 * Use this on buttons/icons to prevent row click
 *
 * @param {string} className - Additional class names
 * @returns {string} Combined class names
 */
export const getClickPreventClass = (className = '') => {
  return `clickable-action ${className}`.trim();
};

/**
 * Creates a modal configuration for display
 *
 * @param {Object} options - Modal options
 * @returns {Object} Modal configuration
 */
export const createModalConfig = (options = {}) => {
  return {
    type: options.type || 'json',
    title: options.title || 'Detalhes',
    fields: options.fields || [],
    width: options.width || 600,
  };
};

/**
 * Validates click configuration
 *
 * @param {Object} config - Click configuration to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateClickConfig = (config) => {
  const errors = [];

  if (!config) {
    return { isValid: true, errors: [] };
  }

  if (config.action === 'redirect' && !config.redirectUrl) {
    errors.push('redirectUrl is required when action is "redirect"');
  }

  if (config.action === 'function' && !config.functionName) {
    errors.push('functionName is required when action is "function"');
  }

  if (config.action === 'modal') {
    if (config.modalConfig) {
      const validTypes = ['json', 'list'];
      if (config.modalConfig.type && !validTypes.includes(config.modalConfig.type)) {
        errors.push(`modalConfig.type must be one of: ${validTypes.join(', ')}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Wraps a component with click handler that prevents row click
 * Useful for wrapping buttons/icons in custom renders
 *
 * NOTE: This function requires JSX and should be implemented in a .jsx file
 * For now, use createButtonClickHandler and apply the clickable-action class manually
 *
 * @param {React.Component} Component - Component to wrap
 * @param {Function} onClick - Click handler
 * @returns {React.Component} Wrapped component
 */
export const withClickPrevention = (Component, onClick) => {
  console.warn('withClickPrevention requires JSX. Use createButtonClickHandler instead.');
  return Component;
};

export default {
  createRowClickHandler,
  createButtonClickHandler,
  getClickPreventClass,
  createModalConfig,
  validateClickConfig,
  withClickPrevention,
  replaceVariables,
};
