import React from 'react';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

const Overlay = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.h2`
  margin: 0;
`;

const ModalBody = styled.div`
  margin: 20px 0;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: #28a745;
  color: white;
`;

const CancelButton = styled(Button)`
  background-color: #dc3545;
  color: white;
`;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  return (
    <Overlay isOpen={isOpen}>
      <ModalContainer>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <ConfirmButton onClick={onConfirm}>Confirm</ConfirmButton>
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;