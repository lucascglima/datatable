/**
 * Friendly Messages
 * Converte mensagens técnicas em linguagem simples e amigável
 */

/**
 * Mensagens de erro amigáveis
 */
export const friendlyErrors = {
  // Network errors
  'Network Error': {
    title: '🌐 Problema de Conexão',
    message: 'Não conseguimos conectar com a API. Verifique:\n\n' +
      '• Se você está conectado à internet\n' +
      '• Se o endereço da API está correto\n' +
      '• Se a API está funcionando (peça ajuda ao administrador)',
    severity: 'error',
  },

  'CORS': {
    title: '🔒 Acesso Bloqueado pela API',
    message: 'A API não permite acesso direto do navegador por questões de segurança.\n\n' +
      'O que fazer?\n' +
      '• Entre em contato com o administrador da API\n' +
      '• Peça para ele liberar o acesso (configurar CORS)\n' +
      '• Ou use um servidor intermediário',
    severity: 'warning',
  },

  '404': {
    title: '❓ Endereço Não Encontrado',
    message: 'A API disse que não existe nada nesse endereço.\n\n' +
      'Verifique:\n' +
      '• Se o endereço está escrito corretamente\n' +
      '• Se o caminho (/users, /posts, etc) está certo\n' +
      '• Confira com o administrador da API',
    severity: 'error',
  },

  '401': {
    title: '🔐 Senha Incorreta ou Faltando',
    message: 'A API está pedindo uma senha (token) para liberar o acesso.\n\n' +
      'O que fazer?\n' +
      '• Verifique se você colocou o token correto\n' +
      '• Peça um novo token ao administrador da API\n' +
      '• Certifique-se de que o token não expirou',
    severity: 'error',
  },

  '403': {
    title: '⛔ Acesso Negado',
    message: 'Você não tem permissão para acessar esses dados.\n\n' +
      'O que fazer?\n' +
      '• Entre em contato com o administrador\n' +
      '• Peça permissão de acesso\n' +
      '• Verifique se está usando o token certo',
    severity: 'error',
  },

  '500': {
    title: '💥 Erro no Servidor da API',
    message: 'A API teve um problema interno.\n\n' +
      'Não é culpa sua! O que fazer?\n' +
      '• Espere alguns minutos e tente novamente\n' +
      '• Entre em contato com o administrador da API\n' +
      '• Eles precisam corrigir o problema no servidor',
    severity: 'error',
  },

  'timeout': {
    title: '⏱️ A API Demorou Muito para Responder',
    message: 'A resposta da API está demorando muito.\n\n' +
      'Isso pode acontecer se:\n' +
      '• A internet está lenta\n' +
      '• A API está processando muitos dados\n' +
      '• O servidor da API está sobrecarregado\n\n' +
      'Tente novamente em alguns minutos.',
    severity: 'warning',
  },

  'invalid_json': {
    title: '📝 Resposta da API em Formato Estranho',
    message: 'A API retornou dados em um formato que não conseguimos entender.\n\n' +
      'O que fazer?\n' +
      '• Verifique com o administrador da API\n' +
      '• Talvez você precise configurar o "Mapeamento" diferente\n' +
      '• A API pode estar com problemas',
    severity: 'error',
  },
};

/**
 * Converte erro técnico em mensagem amigável
 */
export const getFriendlyError = (error) => {
  // Check network error
  if (error.message === 'Network Error') {
    return friendlyErrors['Network Error'];
  }

  // Check CORS
  if (error.message && error.message.includes('CORS')) {
    return friendlyErrors['CORS'];
  }

  // Check HTTP status codes
  if (error.response) {
    const status = error.response.status;
    if (friendlyErrors[status.toString()]) {
      return friendlyErrors[status.toString()];
    }
  }

  // Check timeout
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return friendlyErrors['timeout'];
  }

  // Check invalid JSON
  if (error.message && error.message.includes('JSON')) {
    return friendlyErrors['invalid_json'];
  }

  // Default friendly error
  return {
    title: '⚠️ Algo Deu Errado',
    message: 'Aconteceu um erro que não esperávamos.\n\n' +
      'Detalhes técnicos (mostre isso para quem entende):\n' +
      (error.message || 'Erro desconhecido') + '\n\n' +
      'O que fazer?\n' +
      '• Verifique sua configuração\n' +
      '• Tente recarregar a página\n' +
      '• Entre em contato com o suporte',
    severity: 'error',
  };
};

/**
 * Mensagens de validação amigáveis
 */
export const friendlyValidations = {
  required: (fieldName) => ({
    message: `${fieldName} é obrigatório`,
    help: `Por favor, preencha o campo "${fieldName}" para continuar`,
  }),

  url: {
    message: 'Endereço inválido',
    help: 'Digite um endereço válido começando com https:// ou http://',
    example: 'Exemplo: https://api.exemplo.com',
  },

  email: {
    message: 'Email inválido',
    help: 'Digite um email válido',
    example: 'Exemplo: seunome@email.com',
  },

  json: {
    message: 'Formato JSON inválido',
    help: 'Esse não parece ser um JSON válido. Verifique vírgulas, chaves e aspas.',
  },

  number: {
    message: 'Precisa ser um número',
    help: 'Digite apenas números (ex: 10, 20, 100)',
  },

  positive: {
    message: 'Precisa ser maior que zero',
    help: 'Digite um número maior que zero',
  },
};

/**
 * Mensagens de sucesso amigáveis
 */
export const friendlySuccess = {
  configSaved: {
    title: '✅ Tudo Salvo!',
    message: 'Sua configuração foi salva com sucesso. Agora você pode ver sua tabela funcionando!',
  },

  exampleLoaded: {
    title: '🎉 Exemplo Carregado!',
    message: 'O exemplo foi carregado e está pronto para usar. Visite a página "Exemplo da Tabela" para ver!',
  },

  dataLoaded: {
    title: '📊 Dados Carregados!',
    message: 'Os dados foram carregados da API com sucesso!',
  },

  testSuccess: {
    title: '✓ Teste OK!',
    message: 'O teste funcionou perfeitamente. Confira o resultado no console do navegador.',
  },
};

/**
 * Tooltips amigáveis para campos comuns
 */
export const friendlyTooltips = {
  baseURL: {
    title: 'Endereço da API',
    content: 'É o endereço principal de onde virão os dados, tipo um site mas para dados. Sempre começa com https://',
    example: 'Exemplo: https://api.seusite.com',
  },

  token: {
    title: 'Senha de Acesso (Token)',
    content: 'É como uma senha especial que algumas APIs pedem. Deixe em branco se sua API não pedir.',
    example: 'O administrador da API deve fornecer isso para você',
  },

  dataIndex: {
    title: 'Nome do Campo',
    content: 'É o nome do campo nos dados que vêm da API. Por exemplo, se os dados têm { "nome": "João" }, o dataIndex seria "nome"',
    example: 'Exemplos: nome, email, id, telefone',
  },

  renderType: {
    title: 'Como Mostrar',
    content: 'Escolha como você quer mostrar esse dado na tabela',
    options: [
      'Texto Simples - mostra como está',
      'Tag Colorida - mostra com cor de fundo',
      'Botões - adiciona botões clicáveis',
      'Ícones - adiciona ícones clicáveis',
    ],
  },

  pagination: {
    title: 'Paginação',
    content: 'É dividir os dados em páginas, tipo quando você vê resultados do Google divididos em páginas. Assim não carrega tudo de uma vez.',
  },

  mapping: {
    title: 'Onde Estão os Dados',
    content: 'Às vezes a API manda os dados dentro de "pacotes". Você precisa dizer onde estão os dados que você quer.',
    example: 'Se os dados vêm em { "resultado": { "lista": [...] } }, você coloca: resultado.lista',
  },
};

export default {
  getFriendlyError,
  friendlyErrors,
  friendlyValidations,
  friendlySuccess,
  friendlyTooltips,
};
