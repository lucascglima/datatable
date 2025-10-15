/**
 * Edit Table Modal
 * Modal para editar nome e descrição da tabela
 */

import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Space, Typography } from 'antd';
import { EditOutlined, TableOutlined } from '@ant-design/icons';
import { validateTableName, validateTableDescription } from '../../utils/table-utils';

const { TextArea } = Input;
const { Text } = Typography;

const EditTableModal = ({ visible, table, onCancel, onOk, existingTables = [] }) => {
  const [form] = Form.useForm();
  const [nameError, setNameError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (table && visible) {
      form.setFieldsValue({
        name: table.name,
        description: table.description || '',
      });
      setNameError(null);
    }
  }, [table, visible, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Validate name
      const nameValidation = validateTableName(values.name, existingTables, table?.id);
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
      });

      form.resetFields();
      setNameError(null);
    } catch (error) {
      console.error('Erro ao editar tabela:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setNameError(null);
    onCancel();
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (nameError) {
      const validation = validateTableName(value, existingTables, table?.id);
      if (validation.valid) {
        setNameError(null);
      }
    }
  };

  return (
    <Modal
      title={
        <Space>
          <EditOutlined />
          Editar Tabela
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      onOk={handleSave}
      okText="Salvar"
      cancelText="Cancelar"
      confirmLoading={loading}
      width={600}
    >
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
      </Form>
    </Modal>
  );
};

export default EditTableModal;
