/**
 * Action Config Fields
 * Componente reutilizável para configurar campos específicos de cada tipo de ação
 * Usado em: RowClickConfig, ColumnsVisualEditor, ActionConfigModal
 */

import React from 'react';
import { Form, Input, Select, Radio, Card, Typography } from 'antd';

const { TextArea } = Input;
const { Text } = Typography;

/**
 * ActionConfigFields
 * @param {string} actionType - Tipo de ação (navigate, modal, api, copy, download, javascript)
 * @param {object} config - Configuração atual da ação
 * @param {function} onChange - Callback para atualizar configuração
 * @param {string} formItemPrefix - Prefixo para os nomes dos campos do Form.Item (opcional)
 */
const ActionConfigFields = ({
  actionType,
  config = {},
  onChange,
  formItemPrefix = ''
}) => {
  /**
   * Atualiza um campo específico da configuração
   */
  const updateField = (field, value) => {
    onChange({ ...config, [field]: value });
  };

  /**
   * Renderiza campos específicos para cada tipo de ação
   */
  const renderFields = () => {
    switch (actionType) {
      case 'navigate':
        return (
          <Form.Item
            name={formItemPrefix ? `${formItemPrefix}.navigateUrl` : 'navigateUrl'}
            label="URL de Destino"
            rules={[{ required: true, message: 'URL é obrigatória' }]}
            tooltip="Use {fieldName} para interpolar valores da linha. Ex: /user/{id}"
          >
            <Input
              placeholder="/details/{id}"
              value={config.navigateUrl}
              onChange={(e) => updateField('navigateUrl', e.target.value)}
            />
          </Form.Item>
        );

      case 'modal':
        return (
          <>
            <Form.Item
              name={formItemPrefix ? `${formItemPrefix}.modalTitle` : 'modalTitle'}
              label="Título do Modal"
              rules={[{ required: true, message: 'Título é obrigatório' }]}
            >
              <Input
                placeholder="Detalhes do Registro"
                value={config.modalTitle}
                onChange={(e) => updateField('modalTitle', e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name={formItemPrefix ? `${formItemPrefix}.modalContent` : 'modalContent'}
              label="Conteúdo"
              rules={[{ required: true, message: 'Conteúdo é obrigatório' }]}
              tooltip="Use {fieldName} para mostrar valores da linha"
            >
              <TextArea
                rows={4}
                placeholder="Nome: {name}&#10;Email: {email}&#10;Status: {status}"
                value={config.modalContent}
                onChange={(e) => updateField('modalContent', e.target.value)}
              />
            </Form.Item>
          </>
        );

      case 'api':
        return (
          <>
            <Form.Item
              name={formItemPrefix ? `${formItemPrefix}.apiEndpoint` : 'apiEndpoint'}
              label="Endpoint da API"
              rules={[{ required: true, message: 'Endpoint é obrigatório' }]}
              tooltip="Use {fieldName} para valores dinâmicos. Ex: /api/users/{id}"
            >
              <Input
                placeholder="/api/users/{id}"
                value={config.apiEndpoint}
                onChange={(e) => updateField('apiEndpoint', e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name={formItemPrefix ? `${formItemPrefix}.apiMethod` : 'apiMethod'}
              label="Método HTTP"
              initialValue="DELETE"
            >
              <Radio.Group
                value={config.apiMethod || 'DELETE'}
                onChange={(e) => updateField('apiMethod', e.target.value)}
              >
                <Radio.Button value="GET">GET</Radio.Button>
                <Radio.Button value="POST">POST</Radio.Button>
                <Radio.Button value="PUT">PUT</Radio.Button>
                <Radio.Button value="DELETE">DELETE</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name={formItemPrefix ? `${formItemPrefix}.apiConfirmMessage` : 'apiConfirmMessage'}
              label="Mensagem de Confirmação (opcional)"
            >
              <Input
                placeholder="Tem certeza que deseja excluir?"
                value={config.apiConfirmMessage}
                onChange={(e) => updateField('apiConfirmMessage', e.target.value)}
              />
            </Form.Item>
          </>
        );

      case 'copy':
        return (
          <Form.Item
            name={formItemPrefix ? `${formItemPrefix}.copyField` : 'copyField'}
            label="Campo para Copiar"
            rules={[{ required: true, message: 'Campo é obrigatório' }]}
            tooltip="Nome do campo que será copiado. Ex: email, id, link"
          >
            <Input
              placeholder="email"
              value={config.copyField}
              onChange={(e) => updateField('copyField', e.target.value)}
            />
          </Form.Item>
        );

      case 'download':
        return (
          <Form.Item
            name={formItemPrefix ? `${formItemPrefix}.downloadUrl` : 'downloadUrl'}
            label="URL do Arquivo"
            rules={[{ required: true, message: 'URL é obrigatória' }]}
            tooltip="Use {fieldName} para valores dinâmicos"
          >
            <Input
              placeholder="/api/download/{fileId}"
              value={config.downloadUrl}
              onChange={(e) => updateField('downloadUrl', e.target.value)}
            />
          </Form.Item>
        );

      case 'javascript':
        return (
          <Form.Item
            name={formItemPrefix ? `${formItemPrefix}.javascriptCode` : 'javascriptCode'}
            label="Código JavaScript"
            rules={[{ required: true, message: 'Código é obrigatório' }]}
            tooltip="Use a variável 'record' para acessar dados da linha"
          >
            <TextArea
              rows={6}
              placeholder="console.log('Clicou em:', record.name);&#10;alert('ID: ' + record.id);"
              style={{ fontFamily: 'monospace' }}
              value={config.javascriptCode}
              onChange={(e) => updateField('javascriptCode', e.target.value)}
            />
          </Form.Item>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {renderFields()}

      <Card size="small" style={{ background: '#fffbe6', marginTop: 12 }}>
        <Text type="secondary">
          💡 Dica: Você pode usar <Text code>{'{fieldName}'}</Text> para interpolar valores da linha da tabela
        </Text>
      </Card>
    </div>
  );
};

export default ActionConfigFields;
