/**
 * Delete Confirm Modal
 * Modal de confirmação para deletar tabela
 */

import React from 'react';
import { Modal, Typography, Space, Alert } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const DeleteConfirmModal = ({ visible, table, onCancel, onConfirm, loading = false }) => {
  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
          <Text>Confirmar Exclusão</Text>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Sim, Excluir"
      cancelText="Cancelar"
      okButtonProps={{
        danger: true,
        icon: <DeleteOutlined />,
        loading,
      }}
      width={500}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          message="⚠️ Atenção! Esta ação não pode ser desfeita."
          type="warning"
          showIcon
        />

        <div>
          <Paragraph>
            Você está prestes a excluir a seguinte tabela:
          </Paragraph>

          <div
            style={{
              padding: '16px',
              background: '#f5f5f5',
              borderRadius: '8px',
              border: '1px solid #d9d9d9',
            }}
          >
            <Space direction="vertical" size="small">
              <Text strong style={{ fontSize: '16px' }}>
                {table?.name || 'Tabela'}
              </Text>
              {table?.description && (
                <Text type="secondary">{table.description}</Text>
              )}
            </Space>
          </div>

          <Paragraph style={{ marginTop: 16 }}>
            Todas as configurações desta tabela serão <Text strong>permanentemente perdidas</Text>,
            incluindo:
          </Paragraph>

          <ul style={{ paddingLeft: '20px' }}>
            <li>Configuração da API</li>
            <li>Colunas personalizadas</li>
            <li>Mapeamento de dados</li>
            <li>Eventos configurados</li>
            <li>Todas as outras configurações</li>
          </ul>

          <Paragraph>
            <Text strong>Tem certeza que deseja continuar?</Text>
          </Paragraph>
        </div>
      </Space>
    </Modal>
  );
};

export default DeleteConfirmModal;
