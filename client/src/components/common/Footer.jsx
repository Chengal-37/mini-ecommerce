import React from 'react';

const Footer = () => (
  <footer className="app-footer">
    <div className="footer-content">
      <span style={{ fontWeight: 800, color: '#ffd600', fontSize: 18 }}>
        ShopNest
      </span>
      <span style={{ color: '#fff', marginLeft: 12, fontWeight: 500 }}>
        © {new Date().getFullYear()} All rights reserved.
      </span>
      <span style={{ marginLeft: 'auto', color: '#ffd600', fontWeight: 700, fontSize: 15 }}>
        Made with <span style={{color:'#ffd600'}}>❤</span> by ShopNest Team
      </span>
    </div>
  </footer>
);

export default Footer;
