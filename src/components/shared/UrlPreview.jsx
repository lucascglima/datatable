/**
 * UrlPreview Component
 *
 * Exibe uma prévia da URL final que será montada com base nas configurações
 * Mostra a URL completa com interpolação de variáveis e parâmetros
 *
 * @component
 * @example
 * <UrlPreview
 *   baseURL="https://api.example.com"
 *   path="/users/{userId}"
 *   pathParams={[{name: 'userId', value: '123', enabled: true}]}
 *   queryParams={[{name: 'page', value: '1', enabled: true}]}
 * />
 */

import React, { useMemo } from 'react';
import { Alert, Typography, Space, Tag } from 'antd';
import { LinkOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const UrlPreview = ({
  baseURL = '',
  path = '',
  pathParams = [],
  queryParams = [],
  showValidation = true,
}) => {

  /**
   * Monta a URL completa com interpolação de variáveis
   */
  const buildUrl = useMemo(() => {
    let url = baseURL;

    // Remove trailing slash da baseURL
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }

    // Adiciona o path
    let fullPath = path;
    if (!fullPath.startsWith('/')) {
      fullPath = '/' + fullPath;
    }

    // Interpola path params
    const enabledPathParams = pathParams.filter(p => p.enabled && p.name && p.value);
    enabledPathParams.forEach(param => {
      const placeholder = `{${param.name}}`;
      fullPath = fullPath.replace(placeholder, param.value);
    });

    url += fullPath;

    // Adiciona query params
    const enabledQueryParams = queryParams.filter(p => p.enabled && p.name);
    if (enabledQueryParams.length > 0) {
      const queryString = enabledQueryParams
        .map(p => `${encodeURIComponent(p.name)}=${encodeURIComponent(p.value || '')}`)
        .join('&');
      url += `?${queryString}`;
    }

    return url;
  }, [baseURL, path, pathParams, queryParams]);

  /**
   * Valida a configuração e identifica problemas
   */
  const validation = useMemo(() => {
    const issues = [];
    const warnings = [];

    // Verifica se baseURL existe
    if (!baseURL || baseURL.trim() === '') {
      issues.push('URL Base não configurada');
    }

    // Verifica se baseURL é válida
    if (baseURL && !baseURL.match(/^https?:\/\/.+/i)) {
      issues.push('URL Base deve começar com http:// ou https://');
    }

    // Verifica se path existe
    if (!path || path.trim() === '') {
      warnings.push('Path não configurado - usando apenas URL base');
    }

    // Verifica se há placeholders não substituídos no path
    const placeholderRegex = /\{([^}]+)\}/g;
    const matches = [...(path.matchAll(placeholderRegex) || [])];

    matches.forEach(match => {
      const placeholder = match[1];
      const hasParam = pathParams.some(p => p.name === placeholder && p.enabled && p.value);

      if (!hasParam) {
        warnings.push(`Variável "{${placeholder}}" não tem valor configurado`);
      }
    });

    // Verifica query params sem valor
    const emptyQueryParams = queryParams.filter(p => p.enabled && p.name && !p.value);
    if (emptyQueryParams.length > 0) {
      warnings.push(`${emptyQueryParams.length} parâmetro(s) sem valor inicial`);
    }

    return {
      isValid: issues.length === 0,
      issues,
      warnings,
    };
  }, [baseURL, path, pathParams, queryParams]);

  /**
   * Renderiza os alertas de validação
   */
  const renderValidation = () => {
    if (!showValidation) return null;

    if (validation.issues.length > 0) {
      return (
        <Alert
          message="Configuração Incompleta"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {validation.issues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          }
          type="error"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 12 }}
        />
      );
    }

    if (validation.warnings.length > 0) {
      return (
        <Alert
          message="Atenção"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {validation.warnings.map((warning, idx) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 12 }}
        />
      );
    }

    return (
      <Alert
        message="Configuração Válida"
        description="A URL está configurada corretamente e pronta para uso"
        type="success"
        showIcon
        icon={<CheckCircleOutlined />}
        style={{ marginBottom: 12 }}
      />
    );
  };

  /**
   * Destaca diferentes partes da URL com cores
   */
  const renderHighlightedUrl = () => {
    const parts = [];
    let currentUrl = buildUrl;

    // Separa base URL
    const urlMatch = currentUrl.match(/^(https?:\/\/[^/?]+)(.*)/i);
    if (urlMatch) {
      parts.push(
        <Text key="base" strong style={{ color: '#1890ff' }}>
          {urlMatch[1]}
        </Text>
      );
      currentUrl = urlMatch[2];
    }

    // Separa path e query string
    const queryIndex = currentUrl.indexOf('?');
    if (queryIndex > -1) {
      const pathPart = currentUrl.substring(0, queryIndex);
      const queryPart = currentUrl.substring(queryIndex);

      parts.push(
        <Text key="path" style={{ color: '#52c41a' }}>
          {pathPart}
        </Text>
      );
      parts.push(
        <Text key="query" style={{ color: '#722ed1' }}>
          {queryPart}
        </Text>
      );
    } else {
      parts.push(
        <Text key="path" style={{ color: '#52c41a' }}>
          {currentUrl}
        </Text>
      );
    }

    return parts;
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {renderValidation()}

      <Alert
        message={
          <Space>
            <LinkOutlined />
            <Text strong>Preview da URL Final</Text>
          </Space>
        }
        description={
          <div>
            <Paragraph
              copyable={{
                text: buildUrl,
                tooltips: ['Copiar URL', 'URL Copiada!'],
              }}
              style={{
                backgroundColor: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: 12,
                wordBreak: 'break-all',
                fontFamily: 'monospace',
                fontSize: '13px',
              }}
            >
              {renderHighlightedUrl()}
            </Paragraph>

            <Space size="small" wrap>
              <Tag color="blue">Base URL</Tag>
              <Tag color="green">Path</Tag>
              <Tag color="purple">Query Params</Tag>
            </Space>
          </div>
        }
        type="info"
        showIcon={false}
        style={{ border: '1px solid #d9d9d9' }}
      />
    </div>
  );
};

export default UrlPreview;
