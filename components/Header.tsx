
import React from 'react';
import { Page } from '../types';
import Icon from './Icon';
import { useSettings } from '../hooks/useSettings';

interface HeaderProps {
  currentPage: Page;
  pageHistory: Page[];
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, pageHistory, onBack }) => {
  const { settings, updateSettings } = useSettings();
  
  const handleThemeChange = () => {
    const themes: ('light' | 'dark' | 'black')[] = ['light', 'dark', 'black'];
    const currentIndex = themes.indexOf(settings.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    updateSettings({ theme: nextTheme });
  };

  const showBackButton = pageHistory.length > 0 && currentPage !== Page.Landing && currentPage !== Page.Dashboard;
  
  const themeIcons = {
    light: <Icon name="sun" className="w-6 h-6 text-yellow-500" />,
    dark: <Icon name="moon" className="w-6 h-6 text-indigo-400" />,
    black: <Icon name="star" className="w-6 h-6 text-slate-300" />
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-30 p-4 hidden md:flex justify-between items-center container mx-auto pointer-events-none">
      <div className="pointer-events-auto">
        {showBackButton && (
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-full border-2 border-black shadow-cartoon-sm hover:shadow-cartoon transform hover:-translate-y-0.5 transition-all"
          >
            <Icon name="arrow-left" className="w-5 h-5" />
            <span className="font-bold">Back</span>
          </button>
        )}
      </div>
      <div className="pointer-events-auto">
        <button 
            onClick={handleThemeChange} 
            className="p-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-full border-2 border-black shadow-cartoon-sm hover:shadow-cartoon transform hover:-translate-y-0.5 transition-all"
            aria-label={`Switch to ${settings.theme === 'light' ? 'dark' : settings.theme === 'dark' ? 'black' : 'light'} theme`}
        >
          {themeIcons[settings.theme]}
        </button>
      </div>
    </header>
  );
};

export default Header;