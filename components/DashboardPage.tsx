import React from 'react';
import Icon from './Icon';

interface DashboardPageProps {
  onStart: () => void;
  onContinue: () => void;
  imageCount: number;
  avatarCount: number;
  sceneCount: number;
}

const StatCard: React.FC<{ icon: React.ComponentProps<typeof Icon>['name']; title: string; count: number }> = ({ icon, title, count }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-black shadow-cartoon-sm hover:shadow-cartoon hover:-translate-y-1 transform transition-all duration-200">
        <div className="flex items-center">
            <Icon name={icon} className="w-10 h-10 text-brand-secondary mr-4" />
            <div>
                <p className="text-slate-500 dark:text-slate-400 font-bold">{title}</p>
                <p className="text-4xl font-bold text-slate-800 dark:text-white">{count}</p>
            </div>
        </div>
    </div>
);

const DashboardPage: React.FC<DashboardPageProps> = ({ onStart, onContinue, imageCount, avatarCount, sceneCount }) => {
  const hasPreviousSession = imageCount > 0 || avatarCount > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in">
      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-8 sm:p-12 rounded-3xl border-4 border-black shadow-cartoon max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-brand-primary dark:text-brand-light drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)] dark:drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]">
          HeroBook Maker
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Your personal AI-powered hero creator.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8 text-left">
            <StatCard icon="upload" title="Photos Uploaded" count={imageCount} />
            <StatCard icon="camera" title="Avatars Generated" count={avatarCount} />
            <StatCard icon="share" title="Scenes Created" count={sceneCount} />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-xl font-bold text-white bg-brand-primary rounded-2xl border-2 border-black shadow-cartoon-sm hover:shadow-cartoon transition-all duration-200 transform hover:-translate-y-1 hover:-translate-x-1 focus:outline-none focus:ring-4 focus:ring-brand-primary/50"
          >
            {hasPreviousSession ? 'Start New Adventure' : 'Start Your Adventure'}
          </button>
          {hasPreviousSession && (
              <button
                onClick={onContinue}
                className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-xl font-bold text-black bg-brand-secondary rounded-2xl border-2 border-black shadow-cartoon-sm hover:shadow-cartoon transition-all duration-200 transform hover:-translate-y-1 hover:-translate-x-1 focus:outline-none focus:ring-4 focus:ring-amber-400/50"
              >
                Continue Where You Left Off
              </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
