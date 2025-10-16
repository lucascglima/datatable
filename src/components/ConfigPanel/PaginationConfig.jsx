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
