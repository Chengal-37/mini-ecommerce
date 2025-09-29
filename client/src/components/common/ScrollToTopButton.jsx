import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import '../../assets/styles/main.css';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`scroll-to-top-btn${visible ? ' show' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <FaArrowUp size={22} />
    </button>
  );
};

export default ScrollToTopButton;
