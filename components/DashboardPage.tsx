import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import { useSettings } from '../hooks/useSettings';

interface DashboardPageProps {
  onStart: () => void;
  onContinue: () => void;
  imageCount: number;
  avatarCount: number;
  sceneCount: number;
}

// --- Helper Hooks & Components ---

const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
  
    useEffect(() => {
      let frame = 0;
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        // Apply an ease-out cubic function for a smoother animation
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.round(end * easedProgress);
  
        // Ensure the count does not exceed the end value
        setCount(Math.min(end, currentCount));
  
        if (frame === totalFrames) {
          clearInterval(counter);
          setCount(end); // Ensure it ends on the exact value
        }
      }, frameRate);
  
      return () => clearInterval(counter);
    }, [end, duration, totalFrames]);
  
    return count;
};

const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
    const count = useCountUp(value > 100 ? 100 : value);
    return <span className="tabular-nums">{count}{value > 100 ? '+' : ''}</span>;
};

const funFacts = [
    "A hero's journey starts with a single step!",
    "Every hero has a unique origin story.",
    "The greatest power is kindness.",
    "Even heroes need to do their homework!",
    "Teamwork makes the dream work!",
];

const StatCard: React.FC<{ icon: string; title: string; count: number; gradient: string }> = ({ icon, title, count, gradient }) => (
    <div className="group relative bg-white/40 dark:bg-slate-900/40 p-6 rounded-3xl border-2 border-white/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl backdrop-blur-md hover:-translate-y-2 transform transition-all duration-300">
        <div className={`absolute -inset-1 rounded-3xl ${gradient} opacity-20 group-hover:opacity-40 blur-md transition-all duration-300`}></div>
        <div className="relative flex items-center">
             <div className={`flex-shrink-0 w-16 h-16 ${gradient} rounded-full flex items-center justify-center text-white shadow-md border-2 border-white/50`}>
                <Icon name={icon as any} className="w-8 h-8" />
            </div>
            <div className="ml-4">
                <p className="text-slate-600 dark:text-slate-300 font-bold">{title}</p>
                <p className="text-5xl font-bold text-slate-800 dark:text-white">
                    <AnimatedCounter value={count} />
                </p>
            </div>
        </div>
        <div className="absolute bottom-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {funFacts[Math.floor(Math.random() * funFacts.length)]}
        </div>
    </div>
);

const Toast: React.FC<{ message: string; onDismiss: () => void }> = ({ message, onDismiss }) => {
    useEffect(() => {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }, [onDismiss]);
  
    return (
      <div className="bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in">
        {message}
      </div>
    );
};

const DashboardPage: React.FC<DashboardPageProps> = ({ onStart, onContinue, imageCount, avatarCount, sceneCount }) => {
  const hasPreviousSession = imageCount > 0 || avatarCount > 0;
  const { settings } = useSettings();
  const [showConfetti, setShowConfetti] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  const showToast = (message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
  };

  const dismissToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  
  const backgroundClass = settings.theme === 'black' 
    ? 'bg-black' 
    : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-amber-100 dark:from-slate-900 dark:via-indigo-900 dark:to-slate-800';

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in overflow-hidden ${backgroundClass} rounded-3xl border-4 border-black shadow-cartoon p-4`}>
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-[blob-spin_20s_linear_infinite]"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-300 dark:bg-amber-800 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-[blob-spin_15s_linear_infinite_reverse]"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-[blob-spin_25s_linear_infinite]"></div>
        {showConfetti && Array.from({length: 30}).map((_, i) => (
             <div key={i} className="absolute top-1/2 left-1/2 w-3 h-3 bg-brand-primary rounded-full animate-[confetti-pop_0.8s_ease-out_forwards]" style={{ transform: `rotate(${i * 12}deg) translateX(40px)`}} />
        ))}
       
        <nav className="absolute top-4 right-4 z-10 hidden md:flex items-center gap-2 bg-white/30 dark:bg-black/30 backdrop-blur-sm p-2 rounded-full border border-white/50 dark:border-black/50">
            {['Home', 'Gallery', 'Storybook', 'Profile Card', 'Settings'].map(item => (
                 <button key={item} onClick={() => showToast(`Navigating to ${item}...`)} className="px-3 py-1 text-sm font-bold rounded-full hover:bg-white/50 dark:hover:bg-black/50 transition-colors">{item}</button>
            ))}
            <button onClick={() => showToast('Logging out...')} className="px-3 py-1 text-sm font-bold rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-colors">Logout</button>
        </nav>

        <div className="relative z-10 p-8 sm:p-12">
            <h1 className="text-5xl md:text-7xl font-bold text-brand-primary dark:text-brand-light drop-shadow-[3px_3px_0_rgba(0,0,0,0.1)] dark:drop-shadow-[3px_3px_0_rgba(0,0,0,0.4)] headline-wobble cursor-pointer">
            HeroBook Maker
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 animate-[fadeIn_1s_ease-in-out_0.5s_backwards]">
            Your personal AI-powered hero creator.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8 text-left">
                <StatCard icon="upload" title="Photos Uploaded" count={imageCount} gradient="bg-gradient-to-br from-pink-500 to-orange-400" />
                <StatCard icon="camera" title="Avatars Generated" count={avatarCount} gradient="bg-gradient-to-br from-blue-500 to-purple-500" />
                <StatCard icon="share" title="Scenes Created" count={sceneCount} gradient="bg-gradient-to-br from-green-400 to-teal-500" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={onStart}
                    className="relative group w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-xl font-bold text-white bg-brand-primary rounded-2xl border-2 border-black shadow-cartoon-sm hover:shadow-cartoon transition-all duration-200 transform hover:-translate-y-1 hover:-translate-x-1 focus:outline-none focus:ring-4 focus:ring-brand-primary/50 overflow-hidden"
                >
                    <div className="shine-effect opacity-50 group-hover:opacity-100 transition-opacity"></div>
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
        
        <div className="absolute bottom-4 z-10 flex gap-4">
            <button onClick={() => showToast('Going to Previous Page...')} className="px-4 py-2 bg-white/40 dark:bg-black/40 backdrop-blur-sm rounded-full border border-white/50 dark:border-black/50 font-bold hover:scale-105 transition-transform">◀️ Previous</button>
            <button onClick={() => showToast('Going to Next Page...')} className="px-4 py-2 bg-white/40 dark:bg-black/40 backdrop-blur-sm rounded-full border border-white/50 dark:border-black/50 font-bold hover:scale-105 transition-transform">Next ▶️</button>
        </div>
        
        <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2">
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast.message} onDismiss={() => dismissToast(toast.id)} />
            ))}
        </div>
    </div>
  );
};

export default DashboardPage;