import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center p-4 bg-transparent text-slate-500 dark:text-slate-400">
      <div className="container mx-auto text-sm">
        <p><strong>Privacy Note:</strong> No photos are stored permanently. They are immediately discarded after generation.</p>
        <p>&copy; {new Date().getFullYear()} HeroBook Maker. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
