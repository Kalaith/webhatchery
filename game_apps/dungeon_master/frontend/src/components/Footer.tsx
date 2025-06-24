import React from 'react';

interface FooterProps {
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => (
  <footer className="bg-white border-t border-gray-200 shadow-sm px-6 py-4 w-full">
    {children}
  </footer>
);

export default Footer;
