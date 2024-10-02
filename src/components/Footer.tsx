// components/Footer.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-900 text-dark-200 p-4 mt-8">
      <div className="container mx-auto text-center">
        <p className="mt-2">
          ⭐ If you enjoy our work, please consider giving us a star on{' '}
          <a
            href="https://github.com/Pyramid-IT-Learn/pyramid-leaderboards"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600"
          >
            GitHub
            <FontAwesomeIcon icon={faGithub} size="lg" className="text-primary-600 ml-1" />
          </a>{' '}!
        </p>
        <p>✨ Contributions are always welcome! Let's build something great together! 🚀</p>
      </div>
    </footer>
  );
};

export default Footer;


