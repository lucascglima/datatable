/**
 * Create Table Modal
 * Modal para criar nova tabela
 */

import React, { useState } from 'react';
import { Modal, Form, Input, Radio, Space, Alert, Typography } from 'antd';
import { TableOutlined, RocketOutlined, ToolOutlined } from '@ant-design/icons';
import { validateTableName, validateTableDescription } from '../../utils/table-utils';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

const CreateTableModal = ({ visible, onCancel, onOk, existingTables = [] }) => {
  const [form] = Form.useForm();
  const [startMode, setStartMode] = useState('example'); // 'example' or 'scratch'
  const [nameError, setNameError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Validate name
      const nameValidation = validateTableName(values.name, existingTables);
      if (!nameValidation.valid) {
        setNameError(nameValidation.message);
        setLoading(false);
        return;
      }

      // Validate description
      const descValidation = validateTableDescription(values.description);
      if (!descValidation.valid) {
        form.setFields([
          {
            name: 'description',
            errors: [descValidation.message],
          },
        ]);
        setLoading(false);
        return;
      }

      // Call onOk with data
      await onOk({
        name: values.name.trim(),
        description: values.description?.trim() || '',
        startMode,
      });

      // Reset form
      form.resetFields();
      setNameError(null);
      setStartMode('example');
    } catch (error) {
      console.error('Erro ao criar tabela:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setNameError(null);
    setStartMode('example');
    onCancel();
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (nameError) {
      const validation = validateTableName(value, existingTables);
      if (validation.valid) {
        setNameError(null);
      }
    }
  };

  return (
    <Modal
      title={
        <Space>
          <TableOutlined />
          Criar Nova Tabela
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      onOk={handleCreate}
      okText="Criar Tabela"
      cancelText="Cancelar"
      confirmLoading={loading}
      width={600}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          message="💡 Dica para Iniciantes"
          description="Se é sua primeira vez, escolha 'A partir de um exemplo' para ver como funciona!"
          type="info"
          showIcon
          closable
        />

        <Form form={form} layout="vertical" requiredMark="optional">
          {/* Nome da Tabela */}
          <Form.Item
            name="name"
            label={<Text strong>Nome da Tabela</Text>}
            required
            help={nameError || 'Escolha um nome que ajude a identificar esta tabela'}
            validateStatus={nameError ? 'error' : ''}
            rules={[
              {
                required: true,
                message: 'Por favor, digite um nome para a tabela',
              },
            ]}
          >
            <Input
              placeholder="Ex: Tabela de Clientes, Dashboard de Vendas..."
              size="large"
              prefix={<TableOutlined />}
              onChange={handleNameChange}
              maxLength={50}
              showCount
            />
          </Form.Item>

          {/* Descrição */}
          <Form.Item
            name="description"
            label={<Text strong>Descrição (opcional)</Text>}
            help="Adicione detalhes sobre o que esta tabela mostra"
          >
            <TextArea
              placeholder="Ex: Lista completa de clientes ativos e inativos com filtros por região..."
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>

          {/* Como começar */}
          <Form.Item label={<Text strong>Como deseja começar?</Text>}>
            <Radio.Group
              value={startMode}
              onChange={(e) => setStartMode(e.target.value)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {/* Exemplo */}
                <Radio value="example" style={{ width: '100%' }}>
                  <div
                    style={{
                      padding: '12px',
                      border: startMode === 'example' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      borderRadius: '8px',
                      marginLeft: '24px',
                      background: startMode === 'example' ? '#f0f8ff' : 'white',
                    }}
                  >
                    <Space direction="vertical" size="small">
                      <Text strong>
                        <RocketOutlined /> A partir de um exemplo pronto
                      </Text>
                      <Paragraph style={{ margin: 0, fontSize: '13px', color: '#595959' }}>
                        Recomendado para iniciantes! Carregue um exemplo funcional e depois
                        personalize como quiser.
                      </Paragraph>
                    </Space>
                  </div>
                </Radio>

                {/* Do Zero */}
                <Radio value="scratch" style={{ width: '100%' }}>
                  <div
                    style={{
                      padding: '12px',
                      border: startMode === 'scratch' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      borderRadius: '8px',
                      marginLeft: '24px',
                      background: startMode === 'scratch' ? '#f0f8ff' : 'white',
                    }}
                  >
                    <Space direction="vertical" size="small">
                      <Text strong>
                        <ToolOutlined /> Do zero (configuração manual)
                      </Text>
                      <Paragraph style={{ margin: 0, fontSize: '13px', color: '#595959' }}>
                        Para usuários avançados. Configure tudo manualmente desde o início.
                      </Paragraph>
                    </Space>
                  </div>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>

        {/* Info sobre próximos passos */}
        {startMode === 'example' && (
          <Alert
            message="📌 Próximo passo"
            description="Após criar, você escolherá qual exemplo carregar nesta tabela."
            type="success"
            showIcon
          />
        )}

        {startMode === 'scratch' && (
          <Alert
            message="📌 Próximo passo"
            description="Após criar, você será direcionado para configurar a API desta tabela."
            type="info"
            showIcon
          />
        )}
      </Space>
    </Modal>
  );
};

export default CreateTableModal;
