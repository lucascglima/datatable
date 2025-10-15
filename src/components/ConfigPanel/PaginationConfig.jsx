/**
 * Pagination Configuration
 * Configuração de parâmetros de paginação da API
 * Agora com Tags/Chips para opções de tamanho de página
 */

import React, { useState } from 'react';
import { Form, InputNumber, Select, Switch, Space, Alert, Tag, Input, Button } from 'antd';
import { InfoCircleOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';

const { Option } = Select;

const PaginationConfig = ({ value = {}, onChange }) => {
  const {
    enabled = true,
    defaultPageSize = 20,
    pageSizeOptions = [10, 20, 50, 100],
    showSizeChanger = true,
    startFrom = 1,
  } = value;

  // Estado local para novo valor a adicionar
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const updateField = (field, val) => {
    onChange({ ...value, [field]: val });
  };

  /**
   * Remove uma opção de tamanho
   */
  const handleRemoveOption = (optionToRemove) => {
    const newOptions = pageSizeOptions.filter(opt => opt !== optionToRemove);
    updateField('pageSizeOptions', newOptions);
  };

  /**
   * Adiciona nova opção de tamanho
   */
  const handleAddOption = () => {
    const newValue = parseInt(inputValue);

    if (!isNaN(newValue) && newValue > 0 && !pageSizeOptions.includes(newValue)) {
      const newOptions = [...pageSizeOptions, newValue].sort((a, b) => a - b);
      updateField('pageSizeOptions', newOptions);
    }

    setInputValue('');
    setInputVisible(false);
  };

  /**
   * Cancela adição de nova opção
   */
  const handleCancelAdd = () => {
    setInputValue('');
    setInputVisible(false);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Configuração de Paginação"
        description="Configure como a paginação funcionará na tabela. Quando desabilitada, o footer da tabela será ocultado automaticamente."
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
      />

      <Form layout="vertical">
        <Form.Item
          label="Habilitar Paginação"
          help="Ative para exibir controles de paginação no footer da tabela"
        >
          <Switch
            checked={enabled}
            onChange={(checked) => updateField('enabled', checked)}
            checkedChildren="Habilitado"
            unCheckedChildren="Desabilitado"
          />
        </Form.Item>

        {enabled && (
          <>
            <Space style={{ width: '100%' }} size="large">
              <Form.Item
                label="Página Inicial"
                help="Primeira página começa em 0 ou 1?"
                style={{ flex: 1 }}
              >
                <Select
                  value={startFrom}
                  onChange={(val) => updateField('startFrom', val)}
                >
                  <Option value={0}>0 (zero-indexed)</Option>
                  <Option value={1}>1 (one-indexed)</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Tamanho Padrão da Página"
                help="Quantidade de itens exibidos por página"
                style={{ flex: 1 }}
              >
                <InputNumber
                  min={1}
                  max={1000}
                  value={defaultPageSize}
                  onChange={(val) => updateField('defaultPageSize', val)}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Space>

            <Form.Item
              label="Opções de Tamanho de Página"
              help="Clique no + para adicionar novas opções. Clique no X para remover."
            >
              <div>
                <Space size={[0, 8]} wrap>
                  {pageSizeOptions.map((option) => (
                    <Tag
                      key={option}
                      closable
                      onClose={() => handleRemoveOption(option)}
                      color="blue"
                      style={{ fontSize: '14px', padding: '4px 8px' }}
                    >
                      {option} itens
                    </Tag>
                  ))}

                  {inputVisible ? (
                    <Space.Compact>
                      <Input
                        type="number"
                        size="small"
                        style={{ width: 80 }}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onPressEnter={handleAddOption}
                        onBlur={handleAddOption}
                        placeholder="Ex: 30"
                        autoFocus
                      />
                      <Button
                        size="small"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddOption}
                      />
                      <Button
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={handleCancelAdd}
                      />
                    </Space.Compact>
                  ) : (
                    <Tag
                      onClick={() => setInputVisible(true)}
                      style={{
                        background: '#fff',
                        borderStyle: 'dashed',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '4px 8px'
                      }}
                    >
                      <PlusOutlined /> Adicionar
                    </Tag>
                  )}
                </Space>

                <div style={{ marginTop: 8, fontSize: '12px', color: '#8c8c8c' }}>
                  💡 Dica: As opções são ordenadas automaticamente do menor para o maior
                </div>
              </div>
            </Form.Item>

            <Form.Item
              label="Mostrar Seletor de Tamanho"
              help="Permite ao usuário escolher quantos itens exibir por página"
            >
              <Switch
                checked={showSizeChanger}
                onChange={(checked) => updateField('showSizeChanger', checked)}
                checkedChildren="Sim"
                unCheckedChildren="Não"
              />
            </Form.Item>
          </>
        )}
      </Form>

      {enabled && (
        <Alert
          message="💡 Dica sobre Query Params"
          description="Para que a paginação funcione corretamente com sua API, configure os Query Params na aba 'API' com as referências PAGE_CHANGE e PAGE_SIZE_CHANGE."
          type="success"
          showIcon
        />
      )}

      {!enabled && (
        <Alert
          message="ℹ️ Paginação Desabilitada"
          description="Com a paginação desabilitada, o footer da tabela não será exibido e todos os dados serão mostrados de uma vez."
          type="warning"
          showIcon
        />
      )}

      <Alert
        message="Exemplos de Configuração"
        description={
          <div>
            <p><strong>Configuração padrão (recomendada):</strong></p>
            <ul>
              <li>Página inicial: 1</li>
              <li>Tamanho padrão: 20 itens</li>
              <li>Opções: 10, 20, 50, 100</li>
            </ul>

            <p><strong>Para APIs com offset (começando em 0):</strong></p>
            <ul>
              <li>Página inicial: 0</li>
              <li>Tamanho padrão: 20 itens</li>
              <li>Configure query params com nomes como "offset" e "limit"</li>
            </ul>
          </div>
        }
        type="info"
        showIcon
        style={{ marginTop: 16 }}
      />
    </Space>
  );
};

export default PaginationConfig;
