import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => (
  <header className={styles.header}>
    <div className={styles.header__content}>
      <h1 className={styles.header__title}>WebHatchery Project Tracker</h1>
      <div className={styles.header__actions}>
        <div className={styles['search-container']}>
          <input type="text" className={styles['search-input']} placeholder="Search projects..." />
        </div>
        <button className={styles['suggest-btn']}>Suggest New Project</button>
      </div>
    </div>
  </header>
);

export default Header;
