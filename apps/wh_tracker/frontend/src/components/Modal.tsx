import React from 'react';
import styles from './Modal.module.css';

const Modal: React.FC = () => (
  <div className={styles.modal}>
    <div className={styles.modal__backdrop}></div>
    <div className={styles.modal__content}>
      <div className={styles.modal__header}>
        <h3>Modal Title</h3>
        <button className={styles.modal__close}>&times;</button>
      </div>
      <div className={styles.modal__body}>Modal body content</div>
    </div>
  </div>
);

export default Modal;
