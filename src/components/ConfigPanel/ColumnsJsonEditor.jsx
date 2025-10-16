/**
 * Columns JSON Editor
 * Editor JSON para configuração de colunas
 *
 * Permite editar diretamente o JSON das colunas com:
 * - Validação em tempo real
 * - Syntax highlighting
 * - Mensagens de erro amigáveis
 */

import React, { useState, useEffect } from 'react';
import { Space, Alert, Button, Typography, Card } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import CodeEditor from '../CodeEditor';

const { Text, Paragraph } = Typography;

const ColumnsJsonEditor = ({ value = [], onChange }) => {
  const [jsonText, setJsonText] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [isValid, setIsValid] = useState(true);

  // Sincronizar value com jsonText
  useEffect(() => {
    try {
      setJsonText(JSON.stringify(value, null, 2));
    } catch (error) {
      console.error('Error stringifying columns:', error);
    }
  }, [value]);

  // Validar JSON em tempo real
  const handleJsonChange = (newText) => {
    setJsonText(newText);

    try {
      const parsed = JSON.parse(newText);

      // Validar que é um array
      if (!Array.isArray(parsed)) {
        setValidationError('❌ A configuração deve ser um array de colunas');
        setIsValid(false);
        return;
      }

      // Validar cada coluna
      for (let i = 0; i < parsed.length; i++) {
        const col = parsed[i];

        if (!col.title) {
          setValidationError(`❌ Coluna ${i + 1}: campo "title" é obrigatório`);
          setIsValid(false);
          return;
        }

        if (!col.dataIndex && !col.render) {
          setValidationError(`❌ Coluna ${i + 1}: campo "dataIndex" ou "render" é obrigatório`);
          setIsValid(false);
          return;
        }

        if (!col.key) {
          setValidationError(`❌ Coluna ${i + 1}: campo "key" é obrigatório`);
          setIsValid(false);
          return;
        }
      }

      // Tudo válido
      setValidationError(null);
      setIsValid(true);
      onChange(parsed);
    } catch (error) {
      setValidationError(`❌ JSON inválido: ${error.message}`);
      setIsValid(false);
    }
  };

  // Upload de arquivo JSON
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      handleJsonChange(content);
    };
    reader.readAsText(file);

    // Reset input
    event.target.value = '';
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
     

      {/* Exemplo de estrutura */}
      <Card size="small" title="📋 Estrutura Esperada">
        <Paragraph style={{ marginBottom: 8 }}>
          <Text strong>Campos obrigatórios:</Text>
        </Paragraph>
        <ul style={{ marginBottom: 12 }}>
          <li><Text code>title</Text> - Título da coluna</li>
          <li><Text code>dataIndex</Text> - Campo dos dados a exibir</li>
          <li><Text code>key</Text> - Chave única da coluna</li>
        </ul>

        <Paragraph style={{ marginBottom: 8 }}>
          <Text strong>Exemplo básico:</Text>
        </Paragraph>
        <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
{`[
  {
    "title": "ID",
    "dataIndex": "id",
    "key": "id"
  },
  {
    "title": "Nome",
    "dataIndex": "name",
    "key": "name"
  }
]`}
        </pre>
      </Card>

      {/* Upload de arquivo */}
      <div>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="json-upload"
        />
        <label htmlFor="json-upload">
          <Button icon={<UploadOutlined />} onClick={() => document.getElementById('json-upload').click()}>
            Carregar JSON de Arquivo
          </Button>
        </label>
      </div>

      {/* Editor JSON */}
      <div>
        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong>JSON das Colunas:</Text>
          {isValid && (
            <Space>
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
              <Text style={{ color: '#52c41a' }}>JSON válido</Text>
            </Space>
          )}
          {!isValid && (
            <Space>
              <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
              <Text style={{ color: '#ff4d4f' }}>JSON inválido</Text>
            </Space>
          )}
        </div>

        <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px', overflow: 'hidden' }}>
          <CodeEditor
            value={jsonText}
            onChange={handleJsonChange}
            language="json"
            height="400px"
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

      {/* Dicas */}
      <Card size="small" title="💡 Dicas">
        <Space direction="vertical" size="small">
          <Text>• Use Ctrl+F para buscar no editor</Text>
          <Text>• O JSON é validado automaticamente enquanto você digita</Text>
          <Text>• Você pode carregar um arquivo JSON pronto</Text>
          <Text>• Para campos avançados, veja a documentação do Ant Design Table</Text>
        </Space>
      </Card>
    </Space>
  );
};

export default ColumnsJsonEditor;
