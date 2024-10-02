// components/Footer.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-900 text-dark-200 p-4 mt-8">
      <div className="container mx-auto text-center">
        <p className="mb-2">GNU GENERAL PUBLIC LICENSE</p>
        <p className="mb-2">Version 3, 29 June 2007</p>
        <div className="flex justify-center mt-4">
          <a
            href="https://github.com/Pyramid-IT-Learn/Pyramid-Performance-Tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 hover:underline flex items-center mx-2"
          >
            <FontAwesomeIcon icon={faGithub} className="mr-2" />
            Scraper Source Code
          </a>
          <span className="mx-2">|</span>
          <a
            href="https://github.com/Pyramid-IT-Learn/pyramid-leaderboards-backend"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 hover:underline flex items-center mx-2"
          >
            <FontAwesomeIcon icon={faGithub} className="mr-2" />
            Backend Source Code
          </a>
        </div>
        <p className="mt-4">Contributions are appreciated!</p>
      </div>
    </footer>
  );
};

export default Footer;
