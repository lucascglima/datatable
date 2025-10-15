/**
 * Examples Gallery Page
 * Galeria de exemplos sempre acessível para criar novas tabelas
 */

import React, { useState } from 'react';
import { Card, Typography, Space, Modal, Form, Input, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTables } from '../contexts/TablesContext';
import QuickStart from '../components/QuickStart';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ExamplesGalleryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createTable, updateTableConfig, setActiveTable } = useTables();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExample, setSelectedExample] = useState(null);
  const [form] = Form.useForm();

  // Check if we have a tableId from query params (coming from create table flow)
  const targetTableId = searchParams.get('tableId');

  /**
   * Handle loading example
   */
  const handleLoadExample = (exampleConfig, exampleKey) => {
    setSelectedExample({ config: exampleConfig, key: exampleKey });

    // If we have a target table ID, load directly into it
    if (targetTableId) {
      updateTableConfig(targetTableId, exampleConfig);
      setActiveTable(targetTableId);
      message.success('Exemplo carregado com sucesso!');
      navigate(`/table/${targetTableId}`);
      return;
    }

    // Otherwise, ask user if they want to create a new table
    setModalVisible(true);
  };

  /**
   * Handle modal OK - create new table with example
   */
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      // Create new table with example config
      const newTable = createTable(
        values.name.trim(),
        values.description?.trim() || '',
        selectedExample.config
      );

      setModalVisible(false);
      form.resetFields();
      message.success(`Tabela "${values.name}" criada com sucesso!`);

      // Navigate to the new table
      navigate(`/table/${newTable.id}`);
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

  /**
   * Handle modal cancel
   */
  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setSelectedExample(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <Title level={2} className="page-title">
          🚀 Galeria de Exemplos
        </Title>
        <Paragraph className="page-description">
          {targetTableId
            ? 'Escolha um exemplo para carregar na sua nova tabela'
            : 'Crie uma nova tabela baseada em um exemplo pronto e funcional'}
        </Paragraph>
      </div>

      <Card>
        <QuickStart
          onLoadExample={handleLoadExample}
          currentExample={null}
        />
      </Card>

      {/* Modal for creating new table */}
      <Modal
        title="Criar Nova Tabela com Este Exemplo"
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Criar Tabela"
        cancelText="Cancelar"
        width={600}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Paragraph>
            Vamos criar uma nova tabela com a configuração deste exemplo.
            Você poderá personalizá-la depois!
          </Paragraph>

          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label={<Text strong>Nome da Tabela</Text>}
              rules={[
                { required: true, message: 'Por favor, digite um nome' },
                { min: 3, message: 'Nome deve ter pelo menos 3 caracteres' },
              ]}
              initialValue={`Exemplo ${selectedExample?.key || ''}`}
            >
              <Input
                placeholder="Ex: Lista de Usuários"
                maxLength={50}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="description"
              label={<Text strong>Descrição (opcional)</Text>}
            >
              <TextArea
                placeholder="Ex: Tabela baseada no exemplo de usuários..."
                rows={3}
                maxLength={200}
                showCount
              />
            </Form.Item>
          </Form>
        </Space>
      </Modal>
    </div>
  );
};

export default ExamplesGalleryPage;
