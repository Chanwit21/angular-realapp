import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <p>
        <span className="footer__copyright">&copy;</span> 2018 MTH
      </p>
      <p>
        Crafted with <i className="fas fa-heart footer__icon"></i> by{' '}
        <a href="https://www.linkedin.com/in/matt-holland/" target="_blank" className="footer__signature">
          Matt H
        </a>
      </p>
    </footer>
  );
}

export default Footer;
