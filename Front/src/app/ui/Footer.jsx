import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="py-6 md:px-8 md:py-0  shadow-darkPink">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-darkPink md:text-left font-lifeSavers font-bold">
          &copy; {new Date().getFullYear()} Claudia González
        </p>
        <div className="flex space-x-4">
          <a href="https://github.com/claudiaglez" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub className="text-darkPink hover:text-lightPink text-2xl" />
          </a>
          <a href="https://linkedin.com/in/claudiaglezgarcia" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin className="text-darkPink hover:text-lightPink text-2xl" />
          </a>
        </div>
      </div>
    </footer>
  );
}
export default Footer