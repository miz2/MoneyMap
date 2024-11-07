import React from 'react';
import './Logo.css';

const Logo: React.FC = () => {
  return (
    <div className="logo-container">
      <span className="logo-left">&lt;</span>
      <span className="logo-name">Money Map</span>
      <span className="logo-right">&gt;</span>

    </div>
  );
};

export default Logo;
