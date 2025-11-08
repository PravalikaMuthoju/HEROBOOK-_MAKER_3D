
import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Results, CustomizationOptions } from '../types';
import Icon from './Icon';
import Confetti from './Confetti';
import Spinner from './Spinner';

interface HeroProfileCardPageProps {
  results: Results | null;
  customization: CustomizationOptions | null;
}

const StatBar: React.FC<{ label: string, level: number }> = ({ label, level }) => (
    <div>
        <div className="flex justify-between items-end mb-1">
            <p className="font-bold text-sm text-slate-700 dark:text-slate-300">{label}</p>
            <p className="font-bold text-xs text-slate-500 dark:text-slate-400">LVL {level}</p>
        </div>
        <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-3 border border-black p-0.5">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full" style={{ width: `${level * 10}%` }}></div>
        </div>
    </div>
);

const HeroProfileCardPage: React.FC<HeroProfileCardPageProps> = ({ results, customization }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mainAvatarUrl, setMainAvatarUrl] = useState(results?.avatars[0]?.url || '');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('hasSeenConfetti');
    if (!hasSeen) {
      setShowConfetti(true);
      sessionStorage.setItem('hasSeenConfetti', 'true');
    }
  }, []);

  const handleExportCard = () => {
    if (cardRef.current) {
      html2canvas(cardRef.current, {
        backgroundColor: null, // transparent background
        useCORS: true,
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${customization?.heroName || 'hero'}-profile-card.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };
  
  const handleDownloadAll = async () => {
    if (!results || !customization) return;
    setIsDownloading(true);
    
    const collageContainer = document.createElement('div');
    collageContainer.style.position = 'absolute';
    collageContainer.style.left = '-9999px';
    collageContainer.style.width = '1200px';
    collageContainer.style.padding = '20px';
    collageContainer.style.background = '#000';
    collageContainer.style.display = 'grid';
    collageContainer.style.gridTemplateColumns = 'repeat(5, 1fr)';
    collageContainer.style.gap = '15px';
    document.body.appendChild(collageContainer);
    
    const imageLoadPromises = results.avatars.map(item => {
        return new Promise<void>(resolve => {
            const img = new Image();
            img.src = item.url;
            img.crossOrigin = 'anonymous';
            img.style.width = '100%';
            img.style.objectFit = 'cover';
            img.style.aspectRatio = '1 / 1';
            img.style.borderRadius = '8px';
            img.onload = () => { collageContainer.appendChild(img); resolve(); };
            img.onerror = () => resolve();
        });
    });

    await Promise.all(imageLoadPromises);

    try {
        const canvas = await html2canvas(collageContainer, { useCORS: true });
        const link = document.createElement('a');
        link.download = `${customization.heroName || 'herobook'}-avatars.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error("Failed to create collage", error);
    } finally {
        document.body.removeChild(collageContainer);
        setIsDownloading(false);
    }
  };

  if (!results || !customization) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">No hero data found!</h2>
        <p>Please generate a hero first.</p>
      </div>
    );
  }

  const powerLevel = (customization.heroName.length % 10) + 1;
  const powerType = ['Cosmic Rays', 'Super Strength', 'Telekinesis', 'Shapeshifting', 'Elemental Control'][powerLevel % 5];
  const signatureMove = ['Galaxy Punch', 'Meteor Slam', 'Mind Warp', 'Mirage Strike', 'Tornado Kick'][powerLevel % 5];
  const weakness = ['Kittens', 'Spicy Food', 'Loud Noises', 'Tickling', 'Mondays'][powerLevel % 5];
  const originPlanet = ['Zorbon', 'Giggle-Prime', 'Crystalia', 'Fluff-Topia', 'Technos'][powerLevel % 5];


  return (
    <div className="flex flex-col items-center animate-slide-in-up relative">
      {showConfetti && <Confetti />}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Hero Profile Card</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Your hero's official trading card. Export and share it!
        </p>
      </div>
      
      {/* The Card */}
      <div ref={cardRef} className="w-full max-w-sm bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-3xl border-4 border-black shadow-cartoon p-4">
        {/* Header */}
        <div className="text-center bg-slate-800 text-white p-2 rounded-t-xl border-b-4 border-amber-400">
            <h3 className="text-3xl font-bold tracking-wider">{customization.heroName}</h3>
            <p className="text-sm font-semibold text-amber-300">THE MIGHTY</p>
        </div>
        
        {/* Image */}
        <div className="my-4 p-1 bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 rounded-xl border-2 border-black shadow-inner">
            <img src={mainAvatarUrl} alt={customization.heroName} className="w-full h-auto object-cover rounded-lg aspect-square" />
        </div>

        {/* Stats */}
        <div className="bg-white/70 dark:bg-slate-800/50 p-4 rounded-xl border-2 border-black space-y-3">
            <StatBar label="POWER LEVEL" level={powerLevel} />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-800 dark:text-slate-200">
                <div><strong className="text-slate-500 dark:text-slate-400 block">POWER:</strong> {powerType}</div>
                <div><strong className="text-slate-500 dark:text-slate-400 block">MOVE:</strong> {signatureMove}</div>
                <div><strong className="text-slate-500 dark:text-slate-400 block">WEAKNESS:</strong> {weakness}</div>
                <div><strong className="text-slate-500 dark:text-slate-400 block">ORIGIN:</strong> {originPlanet}</div>
            </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-8 max-w-xl w-full">
        <h3 className="text-xl font-bold text-center mb-4">Choose Your Avatar</h3>
        <div className="grid grid-cols-5 gap-3">
          {results.avatars.map((avatar) => (
            <div key={avatar.id} className="aspect-square">
              <img
                src={avatar.url}
                alt={`Avatar ${avatar.id}`}
                onClick={() => setMainAvatarUrl(avatar.url)}
                className={`w-full h-full object-cover rounded-xl border-4 cursor-pointer transition-all duration-200 shadow-cartoon-sm hover:animate-wiggle ${mainAvatarUrl === avatar.url ? 'border-brand-secondary' : 'border-black'}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={handleExportCard}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-bold text-white bg-green-600 rounded-2xl border-2 border-black shadow-cartoon-sm hover:shadow-cartoon transition-all duration-200 transform hover:-translate-y-1 hover:-translate-x-1 focus:outline-none focus:ring-4 focus:ring-green-500/50"
        >
          <Icon name="arrow-down-tray" />
          Export Card
        </button>
         <button
          onClick={handleDownloadAll}
          disabled={isDownloading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-bold text-white bg-blue-600 rounded-2xl border-2 border-black shadow-cartoon-sm hover:shadow-cartoon transition-all duration-200 transform hover:-translate-y-1 hover:-translate-x-1 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {isDownloading ? <Spinner /> : <Icon name="arrow-down-tray" />}
          {isDownloading ? 'Working...' : 'Download All'}
        </button>
      </div>
    </div>
  );
};

export default HeroProfileCardPage;