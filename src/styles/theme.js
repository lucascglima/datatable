/**
 * Design System Theme
 * Espaçamentos, cores e estilos padronizados
 */

export const theme = {
  // Espaçamento padronizado
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Cores (extendendo Ant Design)
  colors: {
    primary: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff',
    background: '#f0f2f5',
    card: '#ffffff',
    border: '#d9d9d9',
    text: '#262626',
    textSecondary: '#8c8c8c',
    disabled: '#bfbfbf',
  },

  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },

  // Sombras
  shadow: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.1)',
    lg: '0 8px 16px rgba(0,0,0,0.1)',
  },

  // Breakpoints
  breakpoints: {
    xs: '480px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1600px',
  },

  // Menu lateral
  sider: {
    width: 256,
    collapsedWidth: 80,
    background: '#001529',
  },
};

export default theme;
