/**
 * Columns Configuration
 * Componente principal para configuração de colunas
 * Suporta 3 modos: Visual, JSON e Code
 *
 * - Visual: Interface com formulários (mais fácil para iniciantes)
 * - JSON: Editor JSON direto (para quem já tem config pronta)
 * - Code: Editor de código JavaScript com render functions (avançado)
 */

import React, { useState, useEffect } from 'react';
import { Space } from 'antd';
import ColumnModeSelector from './ColumnModeSelector';
import ColumnsVisualEditor from './ColumnsVisualEditor';
import ColumnsJsonEditor from './ColumnsJsonEditor';
import ColumnsCodeEditor from './ColumnsCodeEditor';

const ColumnsConfig = ({ value = [], onChange }) => {
  // Recuperar modo preferido do localStorage ou usar 'visual' como padrão
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('columns_editor_mode');
    return saved || 'visual';
  });

  // Persistir modo preferido
  useEffect(() => {
    localStorage.setItem('columns_editor_mode', mode);
  }, [mode]);

  // Renderizar o editor apropriado baseado no modo
  const renderEditor = () => {
    switch (mode) {
      case 'visual':
        return <ColumnsVisualEditor value={value} onChange={onChange} />;

      case 'json':
        return <ColumnsJsonEditor value={value} onChange={onChange} />;

      case 'code':
        return <ColumnsCodeEditor value={value} onChange={onChange} />;

      default:
        return <ColumnsVisualEditor value={value} onChange={onChange} />;
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Seletor de modo */}
      <ColumnModeSelector value={mode} onChange={setMode} />

      {/* Editor atual */}
      {renderEditor()}
    </Space>
  );
};

export default ColumnsConfig;
