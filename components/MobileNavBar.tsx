
import React from 'react';
import { Page } from '../types';
import Icon from './Icon';

interface MobileNavBarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const NavItem: React.FC<{
  iconName: React.ComponentProps<typeof Icon>['name'];
  label: string;
  page: Page;
  isActive: boolean;
  onClick: () => void;
}> = ({ iconName, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-1/4 pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-brand-primary dark:text-brand-secondary' : 'text-slate-500 dark:text-slate-400 hover:text-brand-primary'
    }`}
  >
    <Icon name={iconName} className="w-7 h-7 mb-0.5" />
    <span className="text-xs font-bold">{label}</span>
  </button>
);

const MobileNavBar: React.FC<MobileNavBarProps> = ({ activePage, onNavigate }) => {
  const navItems = [
    { icon: 'upload', label: 'Upload', page: Page.Upload },
    { icon: 'share', label: 'Results', page: Page.Results },
    { icon: 'arrow-path', label: 'Settings', page: Page.Settings },
  ] as const;

  const isNavItemActive = (page: Page) => {
    // Group related pages under one nav item for active state
    if (page === Page.Upload || page === Page.Review || page === Page.Customize || page === Page.Processing) return activePage === Page.Upload;
    if (page === Page.Results || page === Page.ProfileCard) return activePage === Page.Results;
    return page === activePage;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t-2 border-slate-200 dark:border-slate-700 shadow-lg z-40">
      <div className="flex justify-around items-center h-full">
        <NavItem
          iconName="home"
          label="Home"
          page={Page.Dashboard}
          isActive={activePage === Page.Dashboard || activePage === Page.Landing}
          onClick={() => onNavigate(Page.Dashboard)}
        />
        {navItems.map(item => (
            <NavItem
              key={item.page}
              iconName={item.icon}
              label={item.label}
              page={item.page}
              isActive={isNavItemActive(item.page)}
              onClick={() => onNavigate(item.page)}
            />
        ))}
      </div>
    </nav>
  );
};

export default MobileNavBar;