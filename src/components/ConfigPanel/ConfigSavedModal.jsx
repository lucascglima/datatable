/**
 * Config Saved Modal
 * Modal exibido após salvar configuração com sucesso
 *
 * Oferece opções ao usuário:
 * - Ver Tabela: Navega para visualização da tabela
 * - Criar Outra: Cria nova tabela
 * - Continuar Configurando: Fecha modal e permanece na página
 */

import React from 'react';
import { Modal, Button, Space, Typography, Card } from 'antd';
import {
  CheckCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const ConfigSavedModal = ({ visible, onClose, tableName, onViewTable, onCreateAnother }) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      closable={false}
    >
      <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
        {/* Ícone de sucesso */}
        <div style={{ fontSize: '64px', color: '#52c41a' }}>
          <CheckCircleOutlined />
        </div>

        {/* Título */}
        <div>
          <Title level={3} style={{ marginBottom: 8 }}>
            Configuração Salva com Sucesso!
          </Title>
          <Paragraph style={{ marginBottom: 0, color: '#595959' }}>
            Sua tabela "{tableName}" foi configurada e está pronta para uso.
          </Paragraph>
        </div>

        {/* Opções */}
        <Card style={{ width: '100%' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Text strong style={{ fontSize: '16px' }}>
              O que deseja fazer agora?
            </Text>

            {/* Opção 1: Ver Tabela */}
            <Button
              type="primary"
              size="large"
              icon={<EyeOutlined />}
              block
              onClick={onViewTable}
            >
              Ver Tabela Funcionando
            </Button>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '-8px' }}>
              Visualize sua tabela com os dados da API configurada
            </Text>

            {/* Opção 2: Criar Outra Tabela */}
            <Button
              size="large"
              icon={<PlusOutlined />}
              block
              onClick={onCreateAnother}
              style={{ marginTop: 8 }}
            >
              Criar Outra Tabela
            </Button>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '-8px' }}>
              Inicie uma nova configuração do zero ou a partir de um exemplo
            </Text>

            {/* Opção 3: Continuar Configurando */}
            <Button
              size="large"
              icon={<SettingOutlined />}
              block
              onClick={onClose}
              style={{ marginTop: 8 }}
            >
              Continuar Configurando
            </Button>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '-8px' }}>
              Ajuste outras seções da configuração (colunas, eventos, etc)
            </Text>
          </Space>
        </Card>

        {/* Dica */}
        <Paragraph style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: 0 }}>
          💡 Você pode acessar todas as suas tabelas através do menu "Minhas Tabelas"
        </Paragraph>
      </Space>
    </Modal>
  );
};

export default ConfigSavedModal;
