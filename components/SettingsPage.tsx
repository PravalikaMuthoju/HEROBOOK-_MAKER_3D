
import React from 'react';
import { useSettings } from '../hooks/useSettings';
import { AppSettings, Page } from '../types';

interface SettingsPageProps {
  onNavigate: (page: Page) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { settings, updateSettings } = useSettings();

  const handleSettingChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    updateSettings({ [key]: value });
  };

  const Toggle: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void }> = ({ label, enabled, onChange }) => (
    <div className="flex items-center justify-between">
      <span className="font-bold text-lg">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors border-2 border-black ${
          enabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <span
          className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform border-2 border-black ${
            enabled ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const OptionButton: React.FC<{ label: string, isActive: boolean, onClick: () => void}> = ({ label, isActive, onClick }) => (
     <button onClick={onClick} className={`px-5 py-2 rounded-xl font-bold transition-all border-2 border-black text-base ${isActive ? 'bg-brand-primary text-white shadow-inner' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 shadow-cartoon-sm hover:shadow-none hover:translate-y-0.5 transform'}`}>
        {label}
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto animate-slide-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Customize your HeroBook Maker experience.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-cartoon space-y-8">
        {/* Theme */}
        <div>
          <h3 className="text-xl font-bold mb-3">Theme</h3>
          <div className="flex flex-wrap gap-3">
            <OptionButton label="Light" isActive={settings.theme === 'light'} onClick={() => handleSettingChange('theme', 'light')} />
            <OptionButton label="Dark" isActive={settings.theme === 'dark'} onClick={() => handleSettingChange('theme', 'dark')} />
            <OptionButton label="Pure Black" isActive={settings.theme === 'black'} onClick={() => handleSettingChange('theme', 'black')} />
          </div>
        </div>
        
        {/* Generation Quality */}
        <div>
          <h3 className="text-xl font-bold mb-3">Generation Quality</h3>
           <div className="flex flex-wrap gap-3">
            <OptionButton label="Normal" isActive={settings.generationQuality === 'normal'} onClick={() => handleSettingChange('generationQuality', 'normal')} />
            <OptionButton label="Eco (Faster, Lower GPU)" isActive={settings.generationQuality === 'eco'} onClick={() => handleSettingChange('generationQuality', 'eco')} />
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-6">
            <Toggle label="Enable Animations" enabled={settings.enableAnimations} onChange={(val) => handleSettingChange('enableAnimations', val)} />
            <Toggle label="Enable Sounds" enabled={settings.enableSounds} onChange={(val) => handleSettingChange('enableSounds', val)} />
        </div>
        
        {/* About/Credits */}
        <div className="pt-6 border-t-2 border-slate-200 dark:border-slate-700 text-center">
            <button
                onClick={() => onNavigate(Page.Credits)}
                className="font-bold text-brand-primary dark:text-brand-light hover:underline"
            >
                About & Credits
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;