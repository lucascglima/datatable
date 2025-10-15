/**
 * Columns Code Editor
 * Editor de código JavaScript para colunas com render functions
 *
 * Permite escrever código JavaScript/JSX para definir colunas com
 * funções de renderização customizadas (como no exemplo do Ant Design)
 */

import React, { useState, useEffect } from 'react';
import { Space, Alert, Typography, Card, Button } from 'antd';
import { PlayCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import CodeEditor from '../CodeEditor';

const { Text, Paragraph } = Typography;

const ColumnsCodeEditor = ({ value = [], onChange }) => {
  const [codeText, setCodeText] = useState('');
  const [validationError, setValidationError] = useState(null);

  // Converter array de colunas para código JavaScript
  useEffect(() => {
    try {
      // Gerar código inicial se não houver colunas
      if (!value || value.length === 0) {
        setCodeText(getDefaultCode());
        return;
      }

      // Converter colunas existentes para código
      const code = generateCodeFromColumns(value);
      setCodeText(code);
    } catch (error) {
      console.error('Error generating code:', error);
    }
  }, [value]);

  // Código padrão de exemplo
  const getDefaultCode = () => {
    return `// Defina suas colunas aqui
// Retorne um array de objetos de coluna
// Você pode usar funções de renderização customizadas

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Nome',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      const color = status === 'active' ? 'green' : 'red';
      return <span style={{ color }}>{status}</span>;
    },
  },
];

// IMPORTANTE: retorne o array de colunas
return columns;`;
  };

  // Gerar código JavaScript a partir de colunas existentes
  const generateCodeFromColumns = (columns) => {
    const colsWithoutRender = columns.map(col => {
      const { render, ...rest } = col;
      return rest;
    });

    return `// Suas colunas configuradas
const columns = ${JSON.stringify(colsWithoutRender, null, 2)};

// Você pode adicionar funções de renderização:
// columns[0].render = (text) => <a>{text}</a>;

return columns;`;
  };

  // Validar e executar código
  const handleCodeChange = (newCode) => {
    setCodeText(newCode);
    // Não validar em tempo real para não travar a digitação
  };

  // Testar e aplicar código
  const handleTestCode = () => {
    try {
      // Criar função a partir do código
      // eslint-disable-next-line no-new-func
      const func = new Function('React', codeText);
      const result = func(React);

      // Validar resultado
      if (!Array.isArray(result)) {
        setValidationError('❌ O código deve retornar um array de colunas');
        return;
      }

      // Validar cada coluna
      for (let i = 0; i < result.length; i++) {
        const col = result[i];

        if (!col.title) {
          setValidationError(`❌ Coluna ${i + 1}: campo "title" é obrigatório`);
          return;
        }

        if (!col.dataIndex && !col.render) {
          setValidationError(`❌ Coluna ${i + 1}: campo "dataIndex" ou "render" é obrigatório`);
          return;
        }

        if (!col.key) {
          setValidationError(`❌ Coluna ${i + 1}: campo "key" é obrigatório`);
          return;
        }
      }

      // Tudo válido - aplicar
      setValidationError(null);
      onChange(result);
      console.log('✅ Colunas aplicadas:', result);
    } catch (error) {
      setValidationError(`❌ Erro no código: ${error.message}`);
      console.error('Code error:', error);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Modo Code - Avançado"
        description="Escreva código JavaScript para definir colunas com funções de renderização customizadas. Este modo oferece máxima flexibilidade."
        type="warning"
        showIcon
        icon={<InfoCircleOutlined />}
      />

      {/* Exemplos */}
      <Card size="small" title="📚 Exemplos de Render Functions">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong>1. Link clicável:</Text>
            <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', fontSize: '12px' }}>
{`render: (text) => <a href="#">{text}</a>`}
            </pre>
          </div>

          <div>
            <Text strong>2. Badge colorido:</Text>
            <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', fontSize: '12px' }}>
{`render: (status) => {
  const color = status === 'active' ? 'green' : 'red';
  return <span style={{ color }}>{status}</span>;
}`}
            </pre>
          </div>

          <div>
            <Text strong>3. Formatação de data:</Text>
            <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', fontSize: '12px' }}>
{`render: (date) => new Date(date).toLocaleDateString('pt-BR')`}
            </pre>
          </div>

          <div>
            <Text strong>4. Múltiplos campos:</Text>
            <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', fontSize: '12px' }}>
{`render: (_, record) => (
  <div>
    <div>{record.name}</div>
    <small>{record.email}</small>
  </div>
)`}
            </pre>
          </div>
        </Space>
      </Card>

      {/* Editor de código */}
      <div>
        <Text strong>Código JavaScript:</Text>
        <div style={{ marginTop: 8, border: '1px solid #d9d9d9', borderRadius: '4px', overflow: 'hidden' }}>
          <CodeEditor
            value={codeText}
            onChange={handleCodeChange}
            language="javascript"
            height="450px"
          />
        </div>

        {validationError && (
          <Alert
            message={validationError}
            type="error"
            showIcon
            style={{ marginTop: 8 }}
          />
        )}
      </div>

      {/* Botão de teste */}
      <Button
        type="primary"
        icon={<PlayCircleOutlined />}
        onClick={handleTestCode}
        size="large"
      >
        Testar e Aplicar Código
      </Button>

      {/* Avisos */}
      <Alert
        message="⚠️ Importante"
        description={
          <Space direction="vertical" size="small">
            <Text>• O código é executado no contexto do navegador</Text>
            <Text>• Você tem acesso ao objeto React para JSX</Text>
            <Text>• Sempre termine com "return columns;"</Text>
            <Text>• Clique em "Testar e Aplicar Código" para validar</Text>
          </Space>
        }
        type="info"
        showIcon
      />
    </Space>
  );
};

export default ColumnsCodeEditor;
