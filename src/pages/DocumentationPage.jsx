/**
 * Documentation Page
 * Página completa de documentação
 */

import React from 'react';
import { Typography } from 'antd';
import { useTables } from '../contexts/TablesContext';
import DocumentationTab from '../components/ConfigPanel/DocumentationTab';

const { Title, Paragraph } = Typography;

const DocumentationPage = () => {
  const { getActiveTable } = useTables();
  const activeTable = getActiveTable();
  const config = activeTable?.config || null;

  return (
    <div className="page-container">
      <div className="page-header">
        <Title level={2} className="page-title">
          Documentação
        </Title>
        <Paragraph className="page-description">
          Guias completos, exemplos de configuração e referência de API.
        </Paragraph>
      </div>

      <DocumentationTab currentConfig={config} />
    </div>
  );
};

export default DocumentationPage;
