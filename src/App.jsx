/**
 * App Component - Application with Router and Layout
 */

import React from 'react';
import { ConfigProvider } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TablesProvider } from './contexts/TablesContext';
import MainLayout from './layouts/MainLayout';
import TablesListPage from './pages/TablesListPage';
import TableViewPage from './pages/TableViewPage';
import ExamplesGalleryPage from './pages/ExamplesGalleryPage';
import ConfigGeneralPage from './pages/ConfigGeneralPage';
import ConfigColumnsPage from './pages/ConfigColumnsPage';
import ConfigMappingPage from './pages/ConfigMappingPage';
import ConfigEventsPage from './pages/ConfigEventsPage';
import DocumentationPage from './pages/DocumentationPage';

const App = () => {
  const theme = {
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 4,
      fontSize: 14,
    },
  };

  return (
    <ConfigProvider theme={theme}>
      <TablesProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              {/* Redirect root to tables list */}
              <Route path="/" element={<Navigate to="/tables" replace />} />

              {/* Tables Management */}
              <Route path="/tables" element={<TablesListPage />} />
              <Route path="/table/:tableId" element={<TableViewPage />} />

              {/* Examples (QuickStart) */}
              <Route path="/examples" element={<ExamplesGalleryPage />} />

              {/* Configuration (for specific table) */}
              <Route path="/config/:tableId/general" element={<ConfigGeneralPage />} />
              <Route path="/config/:tableId/columns" element={<ConfigColumnsPage />} />
              <Route path="/config/:tableId/mapping" element={<ConfigMappingPage />} />
              <Route path="/config/:tableId/events" element={<ConfigEventsPage />} />

              {/* Documentation */}
              <Route path="/documentation" element={<DocumentationPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/tables" replace />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TablesProvider>
    </ConfigProvider>
  );
};

export default App;
