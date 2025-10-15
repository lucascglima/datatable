/**
 * Global Test Functions
 * Funções para testar eventos de botões, ícones e clicks de linha
 *
 * Como usar:
 * 1. Abra o console do navegador (F12)
 * 2. Cole este arquivo no console ou importe via <script>
 * 3. Use as funções window.testRowClick(), window.testButtonClick(), etc.
 */

/**
 * Testa click em linha da tabela
 * @param {Object} record - Dados da linha (opcional)
 * @param {Number} index - Índice da linha (opcional)
 */
window.testRowClick = function (record, index) {
  const sampleRecord = record || {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@example.com',
    age: 30,
    city: 'São Paulo',
  };

  const sampleIndex = index !== undefined ? index : 0;

  const event = {
    type: 'click',
    target: { tagName: 'TD' },
    currentTarget: { tagName: 'TR' },
  };

  console.group('🖱️ Teste de Click na Linha');
  console.log('Record:', sampleRecord);
  console.log('Index:', sampleIndex);
  console.log('Event:', event);
  console.groupEnd();

  return { record: sampleRecord, index: sampleIndex, event };
};

/**
 * Testa click em botão de ação
 * @param {Object} record - Dados da linha (opcional)
 * @param {Any} value - Valor da célula (opcional)
 */
window.testButtonClick = function (record, value) {
  const sampleRecord = record || {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@example.com',
    status: 'active',
  };

  const sampleValue = value !== undefined ? value : sampleRecord.id;

  const event = {
    type: 'click',
    target: { tagName: 'BUTTON' },
    stopPropagation: () => console.log('Event propagation stopped'),
  };

  console.group('🔘 Teste de Click em Botão');
  console.log('Record:', sampleRecord);
  console.log('Value:', sampleValue);
  console.log('Event:', event);
  console.groupEnd();

  return { record: sampleRecord, value: sampleValue, event };
};

/**
 * Testa click em ícone de ação
 * @param {Object} record - Dados da linha (opcional)
 * @param {Any} value - Valor da célula (opcional)
 */
window.testIconClick = function (record, value) {
  const sampleRecord = record || {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@example.com',
    status: 'active',
  };

  const sampleValue = value !== undefined ? value : sampleRecord.id;

  const event = {
    type: 'click',
    target: { tagName: 'svg', className: 'anticon' },
    stopPropagation: () => console.log('Event propagation stopped'),
  };

  console.group('⭐ Teste de Click em Ícone');
  console.log('Record:', sampleRecord);
  console.log('Value:', sampleValue);
  console.log('Event:', event);
  console.groupEnd();

  return { record: sampleRecord, value: sampleValue, event };
};

/**
 * Executa código customizado com contexto de teste
 * @param {String} code - Código JavaScript a ser executado
 * @param {String} eventType - Tipo de evento ('rowClick', 'buttonClick', 'iconClick')
 */
window.testCustomEvent = function (code, eventType = 'rowClick') {
  if (!code) {
    console.error('❌ Código não fornecido');
    return;
  }

  let context;

  switch (eventType) {
    case 'buttonClick':
    case 'iconClick':
      context = {
        record: { id: 1, name: 'Test User', email: 'test@example.com' },
        value: 1,
        event: { type: 'click' },
      };
      break;
    case 'rowClick':
    default:
      context = {
        record: { id: 1, name: 'Test User', email: 'test@example.com' },
        index: 0,
        event: { type: 'click' },
      };
      break;
  }

  console.group(`🧪 Teste de Evento Customizado (${eventType})`);
  console.log('Contexto:', context);

  try {
    const func = new Function(...Object.keys(context), code);
    const result = func(...Object.values(context));
    console.log('✅ Resultado:', result);
  } catch (error) {
    console.error('❌ Erro:', error);
  }

  console.groupEnd();
};

/**
 * Testa todos os tipos de eventos com dados de exemplo
 */
window.testAllEvents = function () {
  console.log('🚀 Testando todos os tipos de eventos...\n');

  window.testRowClick();
  console.log('\n');

  window.testButtonClick();
  console.log('\n');

  window.testIconClick();
  console.log('\n');

  console.log('✅ Todos os testes concluídos! Verifique os logs acima.');
};

/**
 * Limpa o console
 */
window.clearTests = function () {
  console.clear();
  console.log('🧹 Console limpo!');
};

/**
 * Mostra ajuda sobre as funções disponíveis
 */
window.testHelp = function () {
  console.log(`
═══════════════════════════════════════════════════════════════
            🧪 FUNÇÕES DE TESTE DISPONÍVEIS
═══════════════════════════════════════════════════════════════

1. testRowClick(record, index)
   Testa evento de click em linha da tabela
   Exemplo: testRowClick()
   Exemplo: testRowClick({id: 5, name: 'Maria'}, 2)

2. testButtonClick(record, value)
   Testa evento de click em botão de ação
   Exemplo: testButtonClick()
   Exemplo: testButtonClick({id: 10}, 'edit')

3. testIconClick(record, value)
   Testa evento de click em ícone de ação
   Exemplo: testIconClick()
   Exemplo: testIconClick({id: 15}, 'delete')

4. testCustomEvent(code, eventType)
   Executa código JavaScript customizado com contexto
   Exemplo: testCustomEvent('console.log(record.name)', 'rowClick')

5. testAllEvents()
   Executa testes para todos os tipos de eventos
   Exemplo: testAllEvents()

6. clearTests()
   Limpa o console
   Exemplo: clearTests()

7. testHelp()
   Mostra esta mensagem de ajuda
   Exemplo: testHelp()

═══════════════════════════════════════════════════════════════
  💡 Dica: Todas as funções estão disponíveis globalmente via
     window.testRowClick(), window.testButtonClick(), etc.
═══════════════════════════════════════════════════════════════
  `);
};

// Auto-inicialização
console.log('✅ Funções de teste carregadas! Digite testHelp() para ver a lista completa.');
