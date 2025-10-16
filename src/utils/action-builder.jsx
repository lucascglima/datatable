/**
 * Action Builder
 * Converte configurações visuais de ações em código executável
 * Suporta interpolação de valores da linha da tabela
 */

import { message, Modal } from 'antd';

/**
 * Interpola valores da linha no template
 * @param {string} template - Template com {fieldName}
 * @param {object} record - Registro da linha
 * @returns {string} String interpolada
 */
const interpolateTemplate = (template, record) => {
  if (!template) return '';

  return template.replace(/\{(\w+)\}/g, (match, fieldName) => {
    return record[fieldName] !== undefined ? record[fieldName] : match;
  });
};

/**
 * Executa ação de navegação
 * @param {object} actionConfig - Configuração da ação
 * @param {object} record - Registro da linha
 * @param {function} navigate - Função de navegação do React Router
 */
const executeNavigate = (actionConfig, record, navigate) => {
  const url = interpolateTemplate(actionConfig.navigateUrl, record);

  console.log('🔗 [Action] Navegando para:', url);

  if (navigate) {
    navigate(url);
  } else {
    window.location.href = url;
  }
};

/**
 * Executa ação de abrir modal
 * @param {object} actionConfig - Configuração da ação
 * @param {object} record - Registro da linha
 */
const executeModal = (actionConfig, record) => {
  const title = interpolateTemplate(actionConfig.modalTitle, record);
  const content = interpolateTemplate(actionConfig.modalContent, record);

  console.log('📋 [Action] Abrindo modal:', title);

  Modal.info({
    title,
    content: (
      <div style={{ whiteSpace: 'pre-line' }}>
        {content}
      </div>
    ),
    width: 600,
  });
};

/**
 * Executa chamada de API
 * @param {object} actionConfig - Configuração da ação
 * @param {object} record - Registro da linha
 * @param {function} onSuccess - Callback de sucesso
 * @param {function} onError - Callback de erro
 */
const executeApi = async (actionConfig, record, onSuccess, onError) => {
  const endpoint = interpolateTemplate(actionConfig.apiEndpoint, record);
  const method = actionConfig.apiMethod || 'GET';
  const confirmMsg = interpolateTemplate(actionConfig.apiConfirmMessage, record);

  console.log('🌐 [Action] Chamando API:', method, endpoint);

  // Se há mensagem de confirmação, mostra modal
  if (confirmMsg) {
    Modal.confirm({
      title: 'Confirmação',
      content: confirmMsg,
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk: async () => {
        await performApiCall(endpoint, method, record, onSuccess, onError);
      },
    });
  } else {
    await performApiCall(endpoint, method, record, onSuccess, onError);
  }
};

/**
 * Realiza a chamada de API
 */
const performApiCall = async (endpoint, method, record, onSuccess, onError) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Para POST/PUT, envia o record como body
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      options.body = JSON.stringify(record);
    }

    const response = await fetch(endpoint, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    message.success('Operação realizada com sucesso!');
    console.log('✅ [Action] API response:', data);

    if (onSuccess) {
      onSuccess(data, record);
    }

    return data;
  } catch (error) {
    console.error('❌ [Action] Erro na API:', error);
    message.error(`Erro: ${error.message}`);

    if (onError) {
      onError(error, record);
    }

    throw error;
  }
};

/**
 * Executa ação de copiar para área de transferência
 * @param {object} actionConfig - Configuração da ação
 * @param {object} record - Registro da linha
 */
const executeCopy = (actionConfig, record) => {
  const fieldName = actionConfig.copyField;
  const value = record[fieldName];

  if (value === undefined || value === null) {
    message.warning(`Campo "${fieldName}" não encontrado no registro`);
    return;
  }

  console.log('📋 [Action] Copiando valor:', value);

  // Usa Clipboard API moderna
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(String(value))
      .then(() => {
        message.success(`"${value}" copiado para área de transferência!`);
      })
      .catch((err) => {
        console.error('Erro ao copiar:', err);
        fallbackCopy(String(value));
      });
  } else {
    fallbackCopy(String(value));
  }
};

/**
 * Fallback para copiar texto (navegadores antigos)
 */
const fallbackCopy = (text) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      message.success('Copiado para área de transferência!');
    } else {
      message.error('Não foi possível copiar');
    }
  } catch (err) {
    console.error('Erro ao copiar:', err);
    message.error('Erro ao copiar');
  }

  document.body.removeChild(textArea);
};

/**
 * Executa ação de download
 * @param {object} actionConfig - Configuração da ação
 * @param {object} record - Registro da linha
 */
const executeDownload = (actionConfig, record) => {
  const url = interpolateTemplate(actionConfig.downloadUrl, record);

  console.log('💾 [Action] Baixando arquivo de:', url);

  // Cria link temporário e clica
  const link = document.createElement('a');
  link.href = url;
  link.download = ''; // Força download
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  message.success('Download iniciado!');
};

/**
 * Executa código JavaScript customizado
 * @param {object} actionConfig - Configuração da ação
 * @param {object} record - Registro da linha
 * @param {object} context - Contexto adicional (navigate, etc)
 */
const executeJavaScript = (actionConfig, record, context = {}) => {
  const code = actionConfig.javascriptCode;

  if (!code) {
    message.warning('Nenhum código JavaScript configurado');
    return;
  }

  console.log('⚙️ [Action] Executando JavaScript customizado');

  try {
    // Cria função com contexto
    // eslint-disable-next-line no-new-func
    const fn = new Function('record', 'context', 'message', code);

    // Executa função
    const result = fn(record, context, message);

    console.log('✅ [Action] JavaScript executado com sucesso', result);

    return result;
  } catch (error) {
    console.error('❌ [Action] Erro ao executar JavaScript:', error);
    message.error(`Erro no código: ${error.message}`);
    throw error;
  }
};

/**
 * Executa uma ação configurada
 * @param {object} actionConfig - Configuração completa da ação
 * @param {object} record - Registro da linha da tabela
 * @param {object} context - Contexto adicional (navigate, callbacks, etc)
 */
export const executeAction = (actionConfig, record, context = {}) => {
  if (!actionConfig || !actionConfig.actionType) {
    console.error('❌ [Action] Configuração de ação inválida:', actionConfig);
    return;
  }

  const { actionType } = actionConfig;
  const { navigate, onSuccess, onError } = context;

  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('⚡ [Action Builder] Executando ação');
  console.log('═══════════════════════════════════════════════');
  console.log('  📌 Tipo:', actionType);
  console.log('  📊 Record:', record);
  console.log('  ⚙️ Config:', actionConfig);

  try {
    switch (actionType) {
      case 'navigate':
        executeNavigate(actionConfig, record, navigate);
        break;

      case 'modal':
        executeModal(actionConfig, record);
        break;

      case 'api':
        executeApi(actionConfig, record, onSuccess, onError);
        break;

      case 'copy':
        executeCopy(actionConfig, record);
        break;

      case 'download':
        executeDownload(actionConfig, record);
        break;

      case 'javascript':
        executeJavaScript(actionConfig, record, context);
        break;

      default:
        console.warn('⚠️ [Action] Tipo de ação desconhecido:', actionType);
        message.warning(`Tipo de ação "${actionType}" não implementado`);
    }

    console.log('✅ [Action] Ação executada com sucesso');
    console.log('═══════════════════════════════════════════════');
    console.log('');
  } catch (error) {
    console.error('❌ [Action] Erro ao executar ação:', error);
    console.log('═══════════════════════════════════════════════');
    console.log('');
    throw error;
  }
};

/**
 * Encontra uma ação pelo identificador
 * @param {array} clickActions - Array de ações configuradas
 * @param {string} identifier - Identificador da ação
 * @returns {object|null} Configuração da ação ou null
 */
export const findActionByIdentifier = (clickActions = [], identifier) => {
  return clickActions.find(action => action.identifier === identifier);
};

/**
 * Converte configurações antigas de eventos para novo formato
 * @param {object} oldEvents - Eventos no formato antigo (código JavaScript)
 * @returns {array} Array de ações no novo formato
 */
export const migrateOldEvents = (oldEvents = {}) => {
  const actions = [];

  // Exemplo de migração - pode ser expandido conforme necessário
  if (oldEvents.onButtonClick) {
    actions.push({
      identifier: 'legacyButtonClick',
      elementType: 'button',
      actionType: 'javascript',
      javascriptCode: oldEvents.onButtonClick,
      buttonText: 'Ação',
    });
  }

  if (oldEvents.onIconClick) {
    actions.push({
      identifier: 'legacyIconClick',
      elementType: 'icon',
      actionType: 'javascript',
      javascriptCode: oldEvents.onIconClick,
      iconName: 'ThunderboltOutlined',
    });
  }

  return actions;
};

/**
 * Valida uma configuração de ação
 * @param {object} actionConfig - Configuração da ação
 * @returns {object} { valid: boolean, errors: array }
 */
export const validateAction = (actionConfig) => {
  const errors = [];

  if (!actionConfig.elementType) {
    errors.push('Tipo de elemento é obrigatório');
  }

  if (!actionConfig.identifier) {
    errors.push('Identificador é obrigatório');
  }

  if (!actionConfig.actionType) {
    errors.push('Tipo de ação é obrigatório');
  }

  // Validações específicas por tipo de ação
  switch (actionConfig.actionType) {
    case 'navigate':
      if (!actionConfig.navigateUrl) {
        errors.push('URL de navegação é obrigatória');
      }
      break;

    case 'modal':
      if (!actionConfig.modalTitle) {
        errors.push('Título do modal é obrigatório');
      }
      if (!actionConfig.modalContent) {
        errors.push('Conteúdo do modal é obrigatório');
      }
      break;

    case 'api':
      if (!actionConfig.apiEndpoint) {
        errors.push('Endpoint da API é obrigatório');
      }
      break;

    case 'copy':
      if (!actionConfig.copyField) {
        errors.push('Campo para copiar é obrigatório');
      }
      break;

    case 'download':
      if (!actionConfig.downloadUrl) {
        errors.push('URL de download é obrigatória');
      }
      break;

    case 'javascript':
      if (!actionConfig.javascriptCode) {
        errors.push('Código JavaScript é obrigatório');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export default {
  executeAction,
  findActionByIdentifier,
  migrateOldEvents,
  validateAction,
};
