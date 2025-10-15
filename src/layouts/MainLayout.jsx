/**
 * Main Layout
 * Layout principal com menu lateral e breadcrumb
 */

import React, { useState, useMemo } from 'react';
import { Layout, Menu, Breadcrumb, Typography } from 'antd';
import {
  HomeOutlined,
  TableOutlined,
  SettingOutlined,
  BookOutlined,
  RocketOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTables } from '../contexts/TablesContext';
import theme from '../styles/theme';

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { tables, activeTableId } = useTables();

  // Get user tables (non-examples)
  const userTables = useMemo(() => {
    return tables.filter((t) => !t.isExample);
  }, [tables]);

  // Build menu items dynamically
  const menuItems = useMemo(() => {
    const items = [
      {
        key: '/tables',
        icon: <HomeOutlined />,
        label: 'Início',
        onClick: () => navigate('/tables'),
      },
    ];

    // Minhas Tabelas section
    if (userTables.length > 0) {
      items.push({
        key: 'my-tables',
        icon: <TableOutlined />,
        label: 'Minhas Tabelas',
        children: [
          ...userTables.map((table) => ({
            key: `/table/${table.id}`,
            label: table.name,
            onClick: () => navigate(`/table/${table.id}`),
          })),
          {
            type: 'divider',
          },
          {
            key: 'new-table',
            icon: <PlusOutlined />,
            label: 'Nova Tabela',
            onClick: () => navigate('/tables'),
          },
        ],
      });
    } else {
      items.push({
        key: '/tables-empty',
        icon: <TableOutlined />,
        label: 'Minhas Tabelas',
        onClick: () => navigate('/tables'),
      });
    }

    // Examples section
    items.push({
      key: '/examples',
      icon: <RocketOutlined />,
      label: 'Exemplos Prontos',
      onClick: () => navigate('/examples'),
    });

    // Configuration section (only if there's an active table)
    if (activeTableId) {
      items.push({
        key: 'config',
        icon: <SettingOutlined />,
        label: 'Configurar Tabela Atual',
        children: [
          {
            key: `/config/${activeTableId}/general`,
            label: 'Geral',
            onClick: () => navigate(`/config/${activeTableId}/general`),
          },
          {
            key: `/config/${activeTableId}/columns`,
            label: 'Colunas',
            onClick: () => navigate(`/config/${activeTableId}/columns`),
          },
          {
            key: `/config/${activeTableId}/mapping`,
            label: 'Mapeamento',
            onClick: () => navigate(`/config/${activeTableId}/mapping`),
          },
          {
            key: `/config/${activeTableId}/events`,
            label: 'Eventos',
            onClick: () => navigate(`/config/${activeTableId}/events`),
          },
        ],
      });
    }

    // Documentation
    items.push({
      key: '/documentation',
      icon: <BookOutlined />,
      label: 'Documentação',
      onClick: () => navigate('/documentation'),
    });

    return items;
  }, [userTables, activeTableId, navigate]);

  // Get current selected key
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return '/tables';
    return path;
  };

  // Get open keys for submenu
  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/config')) return ['config'];
    if (path.startsWith('/table/')) return ['my-tables'];
    return [];
  };

  // Generate breadcrumb based on current path
  const breadcrumbItems = useMemo(() => {
    const path = location.pathname;
    const items = [{ key: 'home', title: 'Início' }];

    if (path.startsWith('/tables')) {
      items.push({ key: 'tables', title: 'Minhas Tabelas' });
    } else if (path.startsWith('/table/')) {
      const tableId = path.split('/')[2];
      const table = tables.find((t) => t.id === tableId);
      items.push({ key: 'tables', title: 'Minhas Tabelas' });
      if (table) {
        items.push({ key: 'table', title: table.name });
      }
    } else if (path.startsWith('/config/')) {
      const tableId = path.split('/')[2];
      const table = tables.find((t) => t.id === tableId);
      items.push({ key: 'config', title: 'Configuração' });
      if (table) {
        items.push({ key: 'table', title: table.name });
      }
      if (path.includes('/general')) items.push({ key: 'general', title: 'Geral' });
      if (path.includes('/columns')) items.push({ key: 'columns', title: 'Colunas' });
      if (path.includes('/mapping')) items.push({ key: 'mapping', title: 'Mapeamento' });
      if (path.includes('/events')) items.push({ key: 'events', title: 'Eventos' });
    } else if (path === '/examples') {
      items.push({ key: 'examples', title: 'Exemplos Prontos' });
    } else if (path === '/documentation') {
      items.push({ key: 'documentation', title: 'Documentação' });
    }

    return items;
  }, [location.pathname, tables]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Menu Lateral */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={theme.sider.width}
        collapsedWidth={theme.sider.collapsedWidth}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            margin: '16px',
            borderRadius: '8px',
          }}
        >
          {!collapsed ? (
            <Title level={4} style={{ color: 'white', margin: 0 }}>
              <TableOutlined /> DataTable Pro
            </Title>
          ) : (
            <TableOutlined style={{ fontSize: '24px', color: 'white' }} />
          )}
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
        />
      </Sider>

      {/* Content Area */}
      <Layout
        style={{
          marginLeft: collapsed ? theme.sider.collapsedWidth : theme.sider.width,
          transition: 'margin-left 0.2s',
        }}
      >
        {/* Header with Breadcrumb */}
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              style: { fontSize: '18px', cursor: 'pointer' },
              onClick: () => setCollapsed(!collapsed),
            })}
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </Header>

        {/* Main Content */}
        <Content
          style={{
            margin: 0,
            minHeight: 'calc(100vh - 64px)',
            background: theme.colors.background,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
