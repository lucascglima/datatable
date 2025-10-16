/**
 * Action Config Modal
 * Modal com wizard de 3 passos para configurar ações visuais
 * Passo 1: Escolher tipo de elemento (Botão/Ícone/Link)
 * Passo 2: Configurar aparência
 * Passo 3: Definir ação
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Steps,
  Form,
  Input,
  Select,
  Radio,
  Space,
  Button,
  Card,
  Typography,
  ColorPicker,
  message,
} from 'antd';
import {
  AppstoreOutlined,
  FormatPainterOutlined,
  ThunderboltOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import IconGallery from './IconGallery';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

/**
 * Componente ActionConfigModal
 */
const ActionConfigModal = ({ visible, onCancel, onSave, initialData = null }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);

  // Estados para controle do wizard
  const [elementType, setElementType] = useState('button');
  const [actionType, setActionType] = useState('navigate');

  /**
   * Inicializa form com dados existentes (modo edição)
   */
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
      setElementType(initialData.elementType || 'button');
      setActionType(initialData.actionType || 'navigate');
    } else {
      form.resetFields();
      setElementType('button');
      setActionType('navigate');
    }
  }, [initialData, visible, form]);

  /**
   * Definição dos passos
   */
  const steps = [
    {
      title: 'Tipo',
      icon: <AppstoreOutlined />,
      description: 'Escolha o elemento',
    },
    {
      title: 'Aparência',
      icon: <FormatPainterOutlined />,
      description: 'Configure o visual',
    },
    {
      title: 'Ação',
      icon: <ThunderboltOutlined />,
      description: 'Defina o comportamento',
    },
  ];

  /**
   * Valida passo atual antes de avançar
   */
  const validateCurrentStep = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(['elementType', 'identifier']);
      } else if (currentStep === 1) {
        // Valida campos específicos do tipo de elemento
        const fields = ['elementType'];
        if (elementType === 'button') {
          fields.push('buttonText', 'buttonType');
        } else if (elementType === 'icon') {
          fields.push('iconName', 'iconColor');
        } else if (elementType === 'link') {
          fields.push('linkText');
        }
        await form.validateFields(fields);
      } else if (currentStep === 2) {
        // Valida campos específicos do tipo de ação
        const fields = ['actionType'];
        if (actionType === 'navigate') {
          fields.push('navigateUrl');
        } else if (actionType === 'modal') {
          fields.push('modalTitle', 'modalContent');
        } else if (actionType === 'api') {
          fields.push('apiEndpoint', 'apiMethod');
        } else if (actionType === 'copy') {
          fields.push('copyField');
        } else if (actionType === 'download') {
          fields.push('downloadUrl');
        } else if (actionType === 'javascript') {
          fields.push('javascriptCode');
        }
        await form.validateFields(fields);
      }
      return true;
    } catch (error) {
      message.error('Por favor, preencha todos os campos obrigatórios');
      return false;
    }
  };

  /**
   * Avança para o próximo passo
   */
  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * Volta para o passo anterior
   */
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Salva a configuração
   */
  const handleSave = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    try {
      const values = await form.validateFields();
      onSave(values);
      message.success('Ação configurada com sucesso!');
      handleCancel();
    } catch (error) {
      message.error('Erro ao salvar configuração');
    }
  };

  /**
   * Cancela e fecha o modal
   */
  const handleCancel = () => {
    form.resetFields();
    setCurrentStep(0);
    setElementType('button');
    setActionType('navigate');
    onCancel();
  };

  /**
   * Renderiza conteúdo do Passo 1: Tipo de Elemento
   */
  const renderStep1 = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={5}>Escolha o tipo de elemento</Title>
        <Paragraph type="secondary">
          Selecione se você deseja criar um Botão, Ícone ou Link.
        </Paragraph>
      </div>

      <Form.Item
        name="elementType"
        label="Tipo de Elemento"
        rules={[{ required: true, message: 'Selecione um tipo' }]}
        initialValue="button"
      >
        <Radio.Group
          onChange={(e) => setElementType(e.target.value)}
          buttonStyle="solid"
          size="large"
        >
          <Radio.Button value="button">Botão</Radio.Button>
          <Radio.Button value="icon">Ícone</Radio.Button>
          <Radio.Button value="link">Link</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="identifier"
        label="Identificador Único"
        rules={[
          { required: true, message: 'Identificador é obrigatório' },
          {
            pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
            message: 'Use apenas letras, números e underscore (sem espaços)',
          },
        ]}
        tooltip="Este identificador será usado para referenciar a ação na configuração de colunas"
      >
        <Input placeholder="ex: editAction, deleteAction, viewDetails" />
      </Form.Item>

      <Card size="small" style={{ background: '#f0f5ff' }}>
        <Text type="secondary">
          {elementType === 'button' && '📘 Botão: Elemento visual destacado, ideal para ações principais'}
          {elementType === 'icon' && '🎨 Ícone: Elemento compacto, ideal para ações secundárias em tabelas'}
          {elementType === 'link' && '🔗 Link: Texto clicável, ideal para navegação'}
        </Text>
      </Card>
    </Space>
  );

  /**
   * Renderiza conteúdo do Passo 2: Aparência
   */
  const renderStep2 = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={5}>Configure a aparência</Title>
        <Paragraph type="secondary">
          Personalize como o elemento será exibido.
        </Paragraph>
      </div>

      {/* Configurações específicas para Botão */}
      {elementType === 'button' && (
        <>
          <Form.Item
            name="buttonText"
            label="Texto do Botão"
            rules={[{ required: true, message: 'Texto é obrigatório' }]}
          >
            <Input placeholder="ex: Editar, Excluir, Ver Detalhes" />
          </Form.Item>

          <Form.Item
            name="buttonType"
            label="Estilo do Botão"
            initialValue="default"
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="primary">Primário</Radio.Button>
              <Radio.Button value="default">Padrão</Radio.Button>
              <Radio.Button value="dashed">Tracejado</Radio.Button>
              <Radio.Button value="text">Texto</Radio.Button>
              <Radio.Button value="link">Link</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="buttonIcon" label="Ícone do Botão (opcional)">
            <IconGallery
              value={form.getFieldValue('buttonIcon')}
              onChange={(iconName) => form.setFieldsValue({ buttonIcon: iconName })}
              size="small"
            />
          </Form.Item>
        </>
      )}

      {/* Configurações específicas para Ícone */}
      {elementType === 'icon' && (
        <>
          <Form.Item
            name="iconName"
            label="Escolha o Ícone"
            rules={[{ required: true, message: 'Ícone é obrigatório' }]}
          >
            <IconGallery
              value={form.getFieldValue('iconName')}
              onChange={(iconName) => form.setFieldsValue({ iconName })}
            />
          </Form.Item>

          <Form.Item
            name="iconColor"
            label="Cor do Ícone"
            initialValue="#1890ff"
          >
            <ColorPicker
              showText
              format="hex"
              onChange={(color) => {
                form.setFieldsValue({ iconColor: color.toHexString() });
              }}
            />
          </Form.Item>

          <Form.Item name="iconTooltip" label="Tooltip (opcional)">
            <Input placeholder="Texto que aparece ao passar o mouse" />
          </Form.Item>
        </>
      )}

      {/* Configurações específicas para Link */}
      {elementType === 'link' && (
        <>
          <Form.Item
            name="linkText"
            label="Texto do Link"
            rules={[{ required: true, message: 'Texto é obrigatório' }]}
          >
            <Input placeholder="ex: Ver mais, Acessar, Download" />
          </Form.Item>

          <Form.Item name="linkIcon" label="Ícone do Link (opcional)">
            <IconGallery
              value={form.getFieldValue('linkIcon')}
              onChange={(iconName) => form.setFieldsValue({ linkIcon: iconName })}
              size="small"
            />
          </Form.Item>
        </>
      )}
    </Space>
  );

  /**
   * Renderiza conteúdo do Passo 3: Ação
   */
  const renderStep3 = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={5}>Defina a ação</Title>
        <Paragraph type="secondary">
          O que acontece quando o usuário clica?
        </Paragraph>
      </div>

      <Form.Item
        name="actionType"
        label="Tipo de Ação"
        rules={[{ required: true, message: 'Selecione uma ação' }]}
        initialValue="navigate"
      >
        <Select
          onChange={(value) => setActionType(value)}
          size="large"
          options={[
            { value: 'navigate', label: '🔗 Navegar para outra página' },
            { value: 'modal', label: '📋 Abrir modal com informações' },
            { value: 'api', label: '🌐 Chamar API (ex: deletar, atualizar)' },
            { value: 'copy', label: '📋 Copiar texto para área de transferência' },
            { value: 'download', label: '💾 Baixar arquivo' },
            { value: 'javascript', label: '⚙️ Executar JavaScript customizado' },
          ]}
        />
      </Form.Item>

      {/* Campos específicos para cada tipo de ação */}
      {actionType === 'navigate' && (
        <Form.Item
          name="navigateUrl"
          label="URL de Destino"
          rules={[{ required: true, message: 'URL é obrigatória' }]}
          tooltip="Use {fieldName} para interpolar valores da linha. Ex: /user/{id}"
        >
          <Input placeholder="/details/{id}" />
        </Form.Item>
      )}

      {actionType === 'modal' && (
        <>
          <Form.Item
            name="modalTitle"
            label="Título do Modal"
            rules={[{ required: true }]}
          >
            <Input placeholder="Detalhes do Registro" />
          </Form.Item>
          <Form.Item
            name="modalContent"
            label="Conteúdo"
            rules={[{ required: true }]}
            tooltip="Use {fieldName} para mostrar valores da linha"
          >
            <TextArea rows={4} placeholder="Nome: {name}\nEmail: {email}\nStatus: {status}" />
          </Form.Item>
        </>
      )}

      {actionType === 'api' && (
        <>
          <Form.Item
            name="apiEndpoint"
            label="Endpoint da API"
            rules={[{ required: true }]}
            tooltip="Use {fieldName} para valores dinâmicos. Ex: /api/users/{id}"
          >
            <Input placeholder="/api/users/{id}" />
          </Form.Item>
          <Form.Item
            name="apiMethod"
            label="Método HTTP"
            initialValue="DELETE"
          >
            <Radio.Group>
              <Radio.Button value="GET">GET</Radio.Button>
              <Radio.Button value="POST">POST</Radio.Button>
              <Radio.Button value="PUT">PUT</Radio.Button>
              <Radio.Button value="DELETE">DELETE</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="apiConfirmMessage" label="Mensagem de Confirmação (opcional)">
            <Input placeholder="Tem certeza que deseja excluir?" />
          </Form.Item>
        </>
      )}

      {actionType === 'copy' && (
        <Form.Item
          name="copyField"
          label="Campo para Copiar"
          rules={[{ required: true }]}
          tooltip="Nome do campo que será copiado. Ex: email, id, link"
        >
          <Input placeholder="email" />
        </Form.Item>
      )}

      {actionType === 'download' && (
        <Form.Item
          name="downloadUrl"
          label="URL do Arquivo"
          rules={[{ required: true }]}
          tooltip="Use {fieldName} para valores dinâmicos"
        >
          <Input placeholder="/api/download/{fileId}" />
        </Form.Item>
      )}

      {actionType === 'javascript' && (
        <Form.Item
          name="javascriptCode"
          label="Código JavaScript"
          rules={[{ required: true }]}
          tooltip="Use a variável 'record' para acessar dados da linha"
        >
          <TextArea
            rows={6}
            placeholder="console.log('Clicou em:', record.name);\nalert('ID: ' + record.id);"
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>
      )}

      <Card size="small" style={{ background: '#fffbe6' }}>
        <Text type="secondary">
          💡 Dica: Você pode usar <Text code>{'{fieldName}'}</Text> para interpolar valores da linha da tabela
        </Text>
      </Card>
    </Space>
  );

  /**
   * Renderiza conteúdo do passo atual
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <Modal
      title={initialData ? 'Editar Ação' : 'Criar Nova Ação'}
      open={visible}
      onCancel={handleCancel}
      width={800}
      footer={null}
    >
      {/* Steps */}
      <Steps
        current={currentStep}
        items={steps}
        style={{ marginBottom: 32 }}
      />

      {/* Form */}
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          elementType: 'button',
          buttonType: 'default',
          actionType: 'navigate',
          apiMethod: 'DELETE',
          iconColor: '#1890ff',
        }}
      >
        {renderStepContent()}
      </Form>

      {/* Footer com botões de navegação */}
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Anterior
        </Button>

        <Space>
          <Button onClick={handleCancel}>Cancelar</Button>

          {currentStep < steps.length - 1 ? (
            <Button type="primary" onClick={handleNext} icon={<ArrowRightOutlined />}>
              Próximo
            </Button>
          ) : (
            <Button type="primary" onClick={handleSave}>
              Salvar Ação
            </Button>
          )}
        </Space>
      </div>
    </Modal>
  );
};

export default ActionConfigModal;
