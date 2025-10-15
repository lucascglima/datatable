/**
 * Documentation Tab
 * Provides complete examples and documentation for configuration
 */

import React, { useState } from 'react';
import { Collapse, Alert, Typography, Space, Button, message } from 'antd';
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Paragraph, Text, Title } = Typography;

const DocumentationTab = ({ currentConfig }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Copiado para a área de transferência!');
  };

  const downloadJSON = (data, filename) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    message.success('Arquivo baixado!');
  };

  const exampleConfigs = {
    jsonPlaceholder: {
      api: {
        baseURL: 'https://jsonplaceholder.typicode.com',
        token: '',
        headers: [{ key: 'X-Custom-Header', value: 'test-value' }],
        body: [],
      },
      endpoints: [
        { id: 1, name: 'users', path: '/users', method: 'GET' },
        { id: 2, name: 'comments', path: '/comments', method: 'GET' },
      ],
      columns: [
        {
          id: 1,
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          sortable: true,
          clickable: false,
          width: 80,
          renderType: 'default',
          renderConfig: {},
        },
        {
          id: 2,
          title: 'Nome',
          dataIndex: 'name',
          key: 'name',
          sortable: true,
          clickable: true,
          width: 200,
          renderType: 'default',
          renderConfig: {},
        },
        {
          id: 3,
          title: 'Status',
          dataIndex: 'username',
          key: 'status',
          sortable: false,
          clickable: false,
          width: 120,
          renderType: 'tags',
          renderConfig: {
            uppercase: true,
            colorMap: 'Bret:green,Antonette:blue,Samantha:orange',
          },
        },
        {
          id: 4,
          title: 'Ações',
          dataIndex: 'id',
          key: 'actions',
          sortable: false,
          clickable: false,
          width: 200,
          renderType: 'buttons',
          renderConfig: {
            buttons: 'Editar:primary:handleEdit,Deletar:danger:handleDelete',
          },
        },
      ],
      mapping: {
        dataPath: '',
        currentPage: '',
        totalPages: '',
        totalItems: '',
      },
      errorHandlers: [
        { id: 1, status: '404', message: 'Recurso não encontrado', action: 'alert' },
        { id: 2, status: '500', message: 'Erro interno do servidor', action: 'log' },
      ],
    },
    nestedAPI: {
      api: {
        baseURL: 'https://api.example.com',
        token: 'your-token-here',
        headers: [{ key: 'X-API-Version', value: 'v1' }],
        body: [{ key: 'includeMetadata', value: 'true' }],
      },
      endpoints: [],
      columns: [],
      mapping: {
        dataPath: 'data.results',
        currentPage: 'pagination.current',
        totalPages: 'pagination.pages',
        totalItems: 'pagination.total',
      },
      errorHandlers: [],
    },
  };

  const renderCodeBlock = (code, filename) => (
    <div style={{ position: 'relative' }}>
      <pre
        style={{
          background: '#f5f5f5',
          padding: '16px',
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '400px',
        }}
      >
        <code>{JSON.stringify(code, null, 2)}</code>
      </pre>
      <Space
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
        }}
      >
        <Button
          size="small"
          icon={<CopyOutlined />}
          onClick={() => copyToClipboard(JSON.stringify(code, null, 2))}
        >
          Copiar
        </Button>
        <Button
          size="small"
          icon={<DownloadOutlined />}
          onClick={() => downloadJSON(code, filename)}
        >
          Baixar
        </Button>
      </Space>
    </div>
  );

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="📚 Guia Completo - Tudo Explicado de Forma Simples"
        description="Aqui você encontra tudo explicado com palavras simples, exemplos práticos e dicas para configurar sua tabela sem precisar ser programador!"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Collapse defaultActiveKey={['1']}>
        <Panel header="📋 Exemplo: JSONPlaceholder API" key="1">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Paragraph>
              Configuração completa para consumir a API pública JSONPlaceholder. Inclui colunas com
              tags coloridas, botões de ação e ícones.
            </Paragraph>
            {renderCodeBlock(exampleConfigs.jsonPlaceholder, 'jsonplaceholder-config.json')}
          </Space>
        </Panel>

        <Panel header="🗂️ Exemplo: API com Response Aninhado" key="2">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Paragraph>
              Exemplo de configuração para APIs que retornam dados em estrutura aninhada. Usa
              mapeamento com dot notation para extrair dados, página atual, total de páginas e total
              de itens.
            </Paragraph>
            {renderCodeBlock(exampleConfigs.nestedAPI, 'nested-api-config.json')}
          </Space>
        </Panel>

        <Panel header="📖 Guia: Configuração de API" key="3">
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Title level={5}>Base URL</Title>
            <Paragraph>
              URL base da API (ex: <Text code>https://api.example.com</Text>)
            </Paragraph>

            <Title level={5}>Token</Title>
            <Paragraph>
              Token de autenticação que será automaticamente incluído no header{' '}
              <Text code>Authorization: Bearer TOKEN</Text>
            </Paragraph>

            <Title level={5}>Headers</Title>
            <Paragraph>
              Headers adicionais em formato chave/valor. Exemplo:
              <br />
              <Text code>X-API-Version: v1</Text>
            </Paragraph>

            <Title level={5}>Body</Title>
            <Paragraph>
              Parâmetros do body para requisições POST/PUT/PATCH em formato chave/valor.
            </Paragraph>
          </Space>
        </Panel>

        <Panel header="📖 Guia: Configuração de Colunas" key="4">
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Title level={5}>Campos Básicos</Title>
            <Paragraph>
              • <Text strong>Title</Text>: Texto exibido no cabeçalho
              <br />
              • <Text strong>Data Index</Text>: Nome do campo no objeto de dados
              <br />
              • <Text strong>Key</Text>: Chave única (geralmente igual ao dataIndex)
              <br />
              • <Text strong>Sortable</Text>: Permite ordenação
              <br />
              • <Text strong>Clickable</Text>: Torna a célula clicável
              <br />• <Text strong>Width</Text>: Largura em pixels
            </Paragraph>

            <Title level={5}>Tipo: Tags com Cores</Title>
            <Paragraph>
              Renderiza o valor como tag colorida. Configuração:
              <br />
              • <Text strong>Uppercase</Text>: Converte texto para maiúsculas
              <br />• <Text strong>Mapeamento de Cores</Text>:{' '}
              <Text code>valor1:cor1,valor2:cor2</Text>
              <br />
              Exemplo: <Text code>active:green,inactive:red,pending:orange</Text>
            </Paragraph>

            <Title level={5}>Tipo: Botões</Title>
            <Paragraph>
              Renderiza botões com ações. Formato:
              <br />
              <Text code>label:tipo:funcName,label2:tipo2:funcName2</Text>
              <br />
              Tipos disponíveis: primary, default, dashed, danger, link
              <br />
              Exemplo: <Text code>Editar:primary:handleEdit,Deletar:danger:handleDelete</Text>
            </Paragraph>

            <Title level={5}>Tipo: Ícones</Title>
            <Paragraph>
              Renderiza ícones clicáveis. Formato:
              <br />
              <Text code>IconName:cor:funcName,IconName2:cor2:funcName2</Text>
              <br />
              Exemplo:{' '}
              <Text code>EditOutlined:#1890ff:handleEdit,DeleteOutlined:#ff4d4f:handleDelete</Text>
            </Paragraph>

            <Title level={5}>Tipo: Customizado</Title>
            <Paragraph>
              Usa uma função global customizada para renderização. Informe o nome da função que
              deve estar disponível em <Text code>window</Text>.
            </Paragraph>
          </Space>
        </Panel>

        <Panel header="📖 Guia: Mapeamento de Response" key="5">
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Title level={5}>Caminho dos Dados</Title>
            <Paragraph>
              Caminho para o array de dados usando dot notation.
              <br />
              • Vazio: para arrays diretos (ex: JSONPlaceholder)
              <br />
              • <Text code>data</Text>: para <Text code>{`{data: [...]}`}</Text>
              <br />• <Text code>data.results</Text>: para{' '}
              <Text code>{`{data: {results: [...]}}`}</Text>
            </Paragraph>

            <Title level={5}>Campos de Paginação</Title>
            <Paragraph>
              Extraem informações de paginação usando dot notation:
              <br />
              • <Text strong>Página Atual</Text>: <Text code>page</Text> ou{' '}
              <Text code>pagination.current</Text>
              <br />
              • <Text strong>Total de Páginas</Text>: <Text code>totalPages</Text> ou{' '}
              <Text code>pagination.pages</Text>
              <br />• <Text strong>Total de Itens</Text>: <Text code>total</Text> ou{' '}
              <Text code>pagination.total</Text>
            </Paragraph>
          </Space>
        </Panel>

        <Panel header="📖 Guia: Tratamento de Erros" key="6">
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Paragraph>
              Configure como a aplicação deve reagir a erros HTTP específicos.
            </Paragraph>

            <Title level={5}>Status</Title>
            <Paragraph>
              Código HTTP (ex: 404, 500, 401)
            </Paragraph>

            <Title level={5}>Mensagem</Title>
            <Paragraph>
              Mensagem que será exibida ou logada
            </Paragraph>

            <Title level={5}>Ação</Title>
            <Paragraph>
              • <Text strong>alert</Text>: Exibe alert com a mensagem
              <br />
              • <Text strong>log</Text>: Loga no console
              <br />• <Text strong>redirect</Text>: Redireciona para URL configurada
            </Paragraph>
          </Space>
        </Panel>

        <Panel header="💻 Funções Globais Necessárias" key="7">
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Paragraph>
              Para usar botões e ícones, você precisa definir funções globais. Exemplo:
            </Paragraph>
            {renderCodeBlock(
              {
                // Funções globais para handlers
                handleEdit: 'function(record, value) { console.log("Edit:", record); }',
                handleDelete: 'function(record, value) { console.log("Delete:", record); }',
                handleView: 'function(record, value) { console.log("View:", record); }',
                onCellClick: 'function(columnKey, record) { console.log("Cell clicked:", columnKey, record); }',
              },
              'global-functions.js'
            )}
            <Alert
              type="warning"
              message="Estas funções devem estar disponíveis em window antes da tabela renderizar."
              description="Você pode incluí-las em um arquivo .js separado ou definir diretamente no HTML."
            />
          </Space>
        </Panel>

        {currentConfig && (
          <Panel header="⚙️ Configuração Atual" key="8">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Paragraph>
                Esta é a configuração atualmente carregada no painel.
              </Paragraph>
              {renderCodeBlock(currentConfig, 'current-config.json')}
            </Space>
          </Panel>
        )}
      </Collapse>
    </Space>
  );
};

export default DocumentationTab;
