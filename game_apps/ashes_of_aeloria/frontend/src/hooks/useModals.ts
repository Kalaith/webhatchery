/**
 * Modal Management Hook
 * Centralized state management for all game modals
 */

import { useState, useCallback } from 'react';

interface ModalState {
  recruitment: boolean;
  help: boolean;
}

const initialModalState: ModalState = {
  recruitment: false,
  help: false
};

export const useModals = () => {
  const [modals, setModals] = useState<ModalState>(initialModalState);

  const openModal = useCallback((modalName: keyof ModalState) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  }, []);

  const closeModal = useCallback((modalName: keyof ModalState) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals(initialModalState);
  }, []);

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    // Convenience methods
    openRecruitment: () => openModal('recruitment'),
    closeRecruitment: () => closeModal('recruitment'),
    openHelp: () => openModal('help'),
    closeHelp: () => closeModal('help')
  };
};
