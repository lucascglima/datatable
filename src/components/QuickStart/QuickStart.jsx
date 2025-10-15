/**
 * QuickStart Component
 * Interface visual para carregar exemplos pré-configurados
 */

import React, { useState } from 'react';
import { Row, Col, Typography, Space, Alert, Button, Modal, message } from 'antd';
import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import QuickStartCard from './QuickStartCard';
import { getExamplesList, getExampleConfig } from '../../utils/preset-examples';

const { Title, Paragraph, Text } = Typography;

const QuickStart = ({ onLoadExample, currentExample }) => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const examples = getExamplesList();

  const handleLoadExample = (exampleKey) => {
    const config = getExampleConfig(exampleKey);
    if (config) {
      onLoadExample(config, exampleKey);
      message.success({
        content: '✨ Exemplo carregado com sucesso! Vá para a página "Exemplo da Tabela" para ver o resultado.',
        duration: 5,
      });
    } else {
      message.error('Erro ao carregar o exemplo. Tente novamente.');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <Title level={2} style={{ marginBottom: '8px' }}>
            🚀 Começar Rapidamente
          </Title>
          <Paragraph style={{ fontSize: '16px', color: '#595959', maxWidth: '800px', margin: '0 auto' }}>
            Escolha um dos exemplos abaixo para carregar uma configuração completa e funcional.
            <br />
            Você pode visualizar a tabela imediatamente e depois personalizar como quiser!
          </Paragraph>
        </div>

        {/* Help Alert */}
        <Alert
          message="💡 Como funciona?"
          description={
            <Space direction="vertical" size="small">
              <Text>
                1️⃣ <Text strong>Escolha um exemplo</Text> que mais se parece com o que você precisa
              </Text>
              <Text>
                2️⃣ <Text strong>Clique em "Carregar Este Exemplo"</Text> para aplicar a configuração
              </Text>
              <Text>
                3️⃣ <Text strong>Vá para "Exemplo da Tabela"</Text> no menu lateral para ver funcionando
              </Text>
              <Text>
                4️⃣ <Text strong>Personalize</Text> a configuração nas páginas de Configuração
              </Text>
            </Space>
          }
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          action={
            <Button size="small" onClick={() => setShowHelpModal(true)}>
              Ajuda Detalhada
            </Button>
          }
        />

        {/* Examples Grid */}
        <Row gutter={[24, 24]}>
          {examples.map((example) => (
            <Col xs={24} sm={24} md={12} lg={8} key={example.key}>
              <QuickStartCard
                example={example}
                onLoad={handleLoadExample}
                isLoaded={currentExample === example.key}
              />
            </Col>
          ))}
        </Row>

        {/* Footer Help */}
        <Alert
          message="Precisa de ajuda?"
          description={
            <Space direction="vertical" size="small">
              <Text>
                • <Text strong>Primeiro uso?</Text> Recomendamos começar com "Lista de Usuários"
              </Text>
              <Text>
                • <Text strong>Quer botões de ação?</Text> Experimente "Usuários com Botões de Ação"
              </Text>
              <Text>
                • <Text strong>Quer ícones?</Text> Veja o exemplo "Lista de Posts"
              </Text>
              <Text>
                • <Text strong>Não encontrou o que precisa?</Text> Carregue qualquer exemplo e personalize!
              </Text>
            </Space>
          }
          type="success"
          showIcon
          icon={<QuestionCircleOutlined />}
        />
      </Space>

      {/* Help Modal */}
      <Modal
        title="📚 Guia Completo de Início Rápido"
        open={showHelpModal}
        onCancel={() => setShowHelpModal(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setShowHelpModal(false)}>
            Entendi!
          </Button>,
        ]}
        width={700}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={4}>O que são esses exemplos?</Title>
            <Paragraph>
              Os exemplos são configurações <Text strong>completas e funcionais</Text> que conectam
              automaticamente com uma API de demonstração (JSONPlaceholder). Você pode ver a tabela
              funcionando imediatamente, sem precisar configurar nada!
            </Paragraph>
          </div>

          <div>
            <Title level={4}>Posso modificar depois?</Title>
            <Paragraph>
              <Text strong>Sim!</Text> Depois de carregar um exemplo, você pode ir nas páginas de
              Configuração (menu lateral) e modificar qualquer coisa:
            </Paragraph>
            <ul>
              <li>Mudar a URL da API para usar seus próprios dados</li>
              <li>Adicionar ou remover colunas</li>
              <li>Mudar cores, botões e ícones</li>
              <li>Configurar eventos personalizados</li>
            </ul>
          </div>

          <div>
            <Title level={4}>O que acontece quando eu carregar um exemplo?</Title>
            <Paragraph>
              A configuração do exemplo será <Text strong>salva automaticamente</Text> e você poderá
              visualizar a tabela funcionando imediatamente. Sua configuração anterior será substituída,
              então se você fez mudanças importantes, salve-as antes!
            </Paragraph>
          </div>

          <div>
            <Title level={4}>Qual exemplo devo escolher?</Title>
            <Paragraph>
              <Text strong>Para iniciantes:</Text> Comece com "Lista de Usuários" - é o mais simples
              <br />
              <Text strong>Para usar botões:</Text> Escolha "Usuários com Botões de Ação"
              <br />
              <Text strong>Para usar ícones:</Text> Escolha "Lista de Posts"
            </Paragraph>
          </div>
        </Space>
      </Modal>
    </div>
  );
};

export default QuickStart;
