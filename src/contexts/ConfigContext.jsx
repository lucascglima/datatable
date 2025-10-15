/**
 * Config Context
 * Compartilha configuração entre todas as páginas
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadConfig, saveConfig as saveToStorage } from '../services/storage';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedConfig = loadConfig();
    setConfig(savedConfig);
    setLoading(false);
  }, []);

  const updateConfig = (newConfig) => {
    setConfig(newConfig);
    saveToStorage(newConfig);
  };

  const updatePartialConfig = (section, data) => {
    const newConfig = {
      ...config,
      [section]: data,
    };
    setConfig(newConfig);
    saveToStorage(newConfig);
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        setConfig: updateConfig,
        updatePartialConfig,
        loading,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
};

export default ConfigContext;
