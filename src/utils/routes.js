/**
 * Routes Configuration
 * Mapeamento de rotas e breadcrumbs
 */

export const routes = {
  example: {
    path: '/example',
    title: 'Exemplo da Tabela',
    breadcrumb: ['Início', 'Exemplo'],
    icon: 'TableOutlined',
    key: 'example',
  },
  configGeneral: {
    path: '/config/general',
    title: 'Configuração Geral',
    breadcrumb: ['Início', 'Configuração', 'Geral'],
    icon: 'SettingOutlined',
    key: 'configGeneral',
  },
  configColumns: {
    path: '/config/columns',
    title: 'Configuração de Colunas',
    breadcrumb: ['Início', 'Configuração', 'Colunas'],
    icon: 'TableOutlined',
    key: 'configColumns',
  },
  configMapping: {
    path: '/config/mapping',
    title: 'Mapeamento de Campos',
    breadcrumb: ['Início', 'Configuração', 'Mapeamento'],
    icon: 'ApiOutlined',
    key: 'configMapping',
  },
  configEvents: {
    path: '/config/events',
    title: 'Configuração de Eventos',
    breadcrumb: ['Início', 'Configuração', 'Eventos'],
    icon: 'ThunderboltOutlined',
    key: 'configEvents',
  },
  documentation: {
    path: '/documentation',
    title: 'Documentação',
    breadcrumb: ['Início', 'Documentação'],
    icon: 'BookOutlined',
    key: 'documentation',
  },
};

/**
 * Menu items for sidebar
 */
export const menuItems = [
  {
    key: 'home',
    icon: 'HomeOutlined',
    label: 'Início',
    path: '/example',
  },
  {
    key: 'example',
    icon: 'TableOutlined',
    label: 'Exemplo da Tabela',
    path: '/example',
  },
  {
    key: 'config',
    icon: 'SettingOutlined',
    label: 'Configuração',
    children: [
      {
        key: 'configGeneral',
        label: 'Geral',
        path: '/config/general',
      },
      {
        key: 'configColumns',
        label: 'Colunas',
        path: '/config/columns',
      },
      {
        key: 'configMapping',
        label: 'Mapeamento',
        path: '/config/mapping',
      },
      {
        key: 'configEvents',
        label: 'Eventos',
        path: '/config/events',
      },
    ],
  },
  {
    key: 'documentation',
    icon: 'BookOutlined',
    label: 'Documentação',
    path: '/documentation',
  },
];

/**
 * Get breadcrumb for current path
 */
export const getBreadcrumb = (pathname) => {
  const route = Object.values(routes).find((r) => r.path === pathname);
  return route?.breadcrumb || ['Início'];
};

/**
 * Get title for current path
 */
export const getPageTitle = (pathname) => {
  const route = Object.values(routes).find((r) => r.path === pathname);
  return route?.title || 'DataTable Pro';
};

/**
 * Get menu key for current path
 */
export const getMenuKey = (pathname) => {
  const route = Object.values(routes).find((r) => r.path === pathname);
  return route?.key || 'home';
};

export default routes;
