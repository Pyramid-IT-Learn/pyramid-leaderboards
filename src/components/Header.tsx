// Header.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-dark-900 bg-opacity-90 p-4 fixed w-full top-0 left-0 shadow-lg z-50 backdrop-filter backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <img src={logo} alt="Logo" className="h-8 w-auto mr-2 sm:h-10 sm:mr-4" />
          <h1 className="text-xl sm:text-2xl font-bold text-primary-600 group-hover:text-primary-500 transition-colors duration-300 text-shadow-glow shadow-primary-600">
            Pyramid Ranker
          </h1>
        </Link>
        <nav className="hidden sm:flex items-center space-x-6">
          <Link to="/" className="text-dark-50 hover:text-primary-400 transition-colors duration-300">Home</Link>
          <Link to="/leaderboard" className="text-dark-50 hover:text-primary-400 transition-colors duration-300">Leaderboard</Link>
        </nav>
        <button
          className="sm:hidden text-dark-50 hover:text-primary-400 transition-colors duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      {isMenuOpen && (
        <nav className="sm:hidden mt-4 flex flex-col space-y-2">
          <Link to="/" className="font-semibold text-dark-100 hover:text-primary-400 transition-colors duration-300 px-4 py-2">Home</Link>
          <Link to="/leaderboard" className="font-semibold text-dark-100 hover:text-primary-400 transition-colors duration-300 px-4 py-2">Leaderboard</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;