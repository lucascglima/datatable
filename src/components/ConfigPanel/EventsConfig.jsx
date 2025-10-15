/**
 * Events Configuration
 * Configuração de eventos customizados (row click, button click, icon click)
 */

import React, { useState } from 'react';
import { Tabs, Card, Space, Alert, Button, Typography } from 'antd';
import { InfoCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import CodeEditor from '../CodeEditor';
import { getValidationError } from '../../utils/event-handler';

const { Text, Paragraph } = Typography;

const EventsConfig = ({ value = {}, onChange }) => {
  const {
    onRowClick = '',
    onButtonClick = '',
    onIconClick = '',
  } = value;

  const [validationErrors, setValidationErrors] = useState({
    onRowClick: null,
    onButtonClick: null,
    onIconClick: null,
  });

  const updateEvent = (eventName, code) => {
    onChange({ ...value, [eventName]: code });

    // Validate
    const error = getValidationError(code);
    setValidationErrors({
      ...validationErrors,
      [eventName]: error,
    });
  };

  const testEvent = (eventName, sampleContext) => {
    const code = value[eventName];
    if (!code) {
      console.log('No code to test');
      return;
    }

    try {
      const func = new Function(...Object.keys(sampleContext), code);
      const result = func(...Object.values(sampleContext));
      console.log(`Test result for ${eventName}:`, result);
      console.log('Sample context:', sampleContext);
    } catch (error) {
      console.error(`Error testing ${eventName}:`, error);
    }
  };

  const tabItems = [
    {
      key: 'rowClick',
      label: 'Click na Linha',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert
            message="Click na Linha"
            description="Código executado quando o usuário clica em uma linha da tabela."
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
          />

          <Card size="small" title="Variáveis Disponíveis">
            <Space direction="vertical" size="small">
              <Text>• <Text code>record</Text> - Objeto com todos os dados da linha</Text>
              <Text>• <Text code>index</Text> - Índice da linha (começando em 0)</Text>
              <Text>• <Text code>event</Text> - Evento do click do mouse</Text>
            </Space>
          </Card>

          <div>
            <Text strong>Código JavaScript:</Text>
            <div style={{ marginTop: 8, border: '1px solid #d9d9d9', borderRadius: '4px', overflow: 'hidden' }}>
              <CodeEditor
                value={onRowClick}
                onChange={(code) => updateEvent('onRowClick', code)}
                language="javascript"
                height="250px"
              />
            </div>
            {validationErrors.onRowClick && (
              <Alert
                message={validationErrors.onRowClick}
                type="error"
                showIcon
                style={{ marginTop: 8 }}
              />
            )}
          </div>

          <Card size="small" title="Exemplo de Código">
            <Paragraph style={{ marginBottom: 0 }}>
              <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
{`console.log('Linha clicada:', record);
alert('ID: ' + record.id + '\\nNome: ' + record.name);`}
              </pre>
            </Paragraph>
          </Card>

          <Button
            icon={<PlayCircleOutlined />}
            onClick={() => testEvent('onRowClick', {
              record: { id: 1, name: 'Teste', email: 'teste@example.com' },
              index: 0,
              event: { type: 'click' }
            })}
          >
            Testar no Console
          </Button>
        </Space>
      ),
    },
    {
      key: 'buttonClick',
      label: 'Click em Botão',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert
            message="Click em Botão"
            description="Código executado quando o usuário clica em um botão de ação na tabela."
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
          />

          <Card size="small" title="Variáveis Disponíveis">
            <Space direction="vertical" size="small">
              <Text>• <Text code>record</Text> - Objeto com todos os dados da linha</Text>
              <Text>• <Text code>value</Text> - Valor da célula</Text>
              <Text>• <Text code>event</Text> - Evento do click do mouse</Text>
            </Space>
          </Card>

          <div>
            <Text strong>Código JavaScript:</Text>
            <div style={{ marginTop: 8, border: '1px solid #d9d9d9', borderRadius: '4px', overflow: 'hidden' }}>
              <CodeEditor
                value={onButtonClick}
                onChange={(code) => updateEvent('onButtonClick', code)}
                language="javascript"
                height="250px"
              />
            </div>
            {validationErrors.onButtonClick && (
              <Alert
                message={validationErrors.onButtonClick}
                type="error"
                showIcon
                style={{ marginTop: 8 }}
              />
            )}
          </div>

          <Card size="small" title="Exemplo de Código">
            <Paragraph style={{ marginBottom: 0 }}>
              <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
{`if (confirm('Deseja editar este registro?')) {
  console.log('Editando:', record);
  // Navegar para página de edição
  window.location.href = '/edit/' + record.id;
}`}
              </pre>
            </Paragraph>
          </Card>

          <Button
            icon={<PlayCircleOutlined />}
            onClick={() => testEvent('onButtonClick', {
              record: { id: 1, name: 'Teste' },
              value: 1,
              event: { type: 'click' }
            })}
          >
            Testar no Console
          </Button>
        </Space>
      ),
    },
    {
      key: 'iconClick',
      label: 'Click em Ícone',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert
            message="Click em Ícone"
            description="Código executado quando o usuário clica em um ícone de ação na tabela."
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
          />

          <Card size="small" title="Variáveis Disponíveis">
            <Space direction="vertical" size="small">
              <Text>• <Text code>record</Text> - Objeto com todos os dados da linha</Text>
              <Text>• <Text code>value</Text> - Valor da célula</Text>
              <Text>• <Text code>event</Text> - Evento do click do mouse</Text>
            </Space>
          </Card>

          <div>
            <Text strong>Código JavaScript:</Text>
            <div style={{ marginTop: 8, border: '1px solid #d9d9d9', borderRadius: '4px', overflow: 'hidden' }}>
              <CodeEditor
                value={onIconClick}
                onChange={(code) => updateEvent('onIconClick', code)}
                language="javascript"
                height="250px"
              />
            </div>
            {validationErrors.onIconClick && (
              <Alert
                message={validationErrors.onIconClick}
                type="error"
                showIcon
                style={{ marginTop: 8 }}
              />
            )}
          </div>

          <Card size="small" title="Exemplo de Código">
            <Paragraph style={{ marginBottom: 0 }}>
              <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
{`console.log('Ícone clicado:', record);
// Abrir modal de detalhes
window.dispatchEvent(new CustomEvent('openDetails', {
  detail: record
}));`}
              </pre>
            </Paragraph>
          </Card>

          <Button
            icon={<PlayCircleOutlined />}
            onClick={() => testEvent('onIconClick', {
              record: { id: 1, name: 'Teste' },
              value: 1,
              event: { type: 'click' }
            })}
          >
            Testar no Console
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Configuração de Eventos Customizados"
        description="Configure ações JavaScript que serão executadas quando o usuário interagir com a tabela. Use o console do navegador para ver os resultados dos testes."
        type="warning"
        showIcon
      />

      <Tabs defaultActiveKey="rowClick" items={tabItems} />
    </Space>
  );
};

export default EventsConfig;
