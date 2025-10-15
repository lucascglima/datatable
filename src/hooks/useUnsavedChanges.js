/**
 * useUnsavedChanges Hook
 * Detecta mudanças não salvas e previne navegação acidental
 *
 * Funcionalidades:
 * - Detecta quando há mudanças não salvas
 * - Mostra confirmação antes de sair da página
 * - Integra com React Router para prevenir navegação
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useBlocker } from 'react-router-dom';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

/**
 * Hook para gerenciar mudanças não salvas
 * @param {Object} initialState - Estado inicial dos dados
 * @param {Object} currentState - Estado atual dos dados
 * @returns {Object} - { hasUnsavedChanges, setHasUnsavedChanges, confirmNavigation, resetChanges }
 */
export const useUnsavedChanges = (initialState, currentState) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const initialStateRef = useRef(initialState);

  // Atualizar ref quando initialState mudar (após save)
  useEffect(() => {
    initialStateRef.current = initialState;
  }, [initialState]);

  // Detectar mudanças comparando estado inicial com atual
  useEffect(() => {
    if (!initialState || !currentState) {
      setHasUnsavedChanges(false);
      return;
    }

    const hasChanges = JSON.stringify(initialStateRef.current) !== JSON.stringify(currentState);
    setHasUnsavedChanges(hasChanges);
  }, [initialState, currentState]);

  // Bloquear navegação se houver mudanças não salvas
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname;
  });

  // Mostrar modal de confirmação quando navegação for bloqueada
  useEffect(() => {
    if (blocker.state === 'blocked') {
      Modal.confirm({
        title: 'Você tem mudanças não salvas',
        icon: <ExclamationCircleOutlined />,
        content: 'Deseja sair sem salvar? Todas as alterações serão perdidas.',
        okText: 'Sair sem Salvar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          setHasUnsavedChanges(false);
          blocker.proceed();
        },
        onCancel() {
          blocker.reset();
        },
      });
    }
  }, [blocker]);

  // Prevenir fechamento da aba/janela do navegador
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Você tem mudanças não salvas. Deseja realmente sair?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  /**
   * Confirma navegação com mudanças não salvas
   * @param {Function} navigateFunc - Função de navegação a ser executada
   */
  const confirmNavigation = (navigateFunc) => {
    if (!hasUnsavedChanges) {
      navigateFunc();
      return;
    }

    Modal.confirm({
      title: 'Você tem mudanças não salvas',
      icon: <ExclamationCircleOutlined />,
      content: 'Deseja sair sem salvar? Todas as alterações serão perdidas.',
      okText: 'Sair sem Salvar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        setHasUnsavedChanges(false);
        navigateFunc();
      },
    });
  };

  /**
   * Reseta o estado de mudanças não salvas
   * Usar após salvar com sucesso
   */
  const resetChanges = () => {
    setHasUnsavedChanges(false);
    initialStateRef.current = currentState;
  };

  return {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    confirmNavigation,
    resetChanges,
  };
};

/**
 * Hook simplificado para uso rápido
 * @param {boolean} isDirty - Se há mudanças não salvas
 */
export const usePrompt = (isDirty) => {
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);
};
