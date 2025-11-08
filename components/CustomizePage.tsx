import React, { useState } from 'react';
import { CustomizationOptions, HairColorOption, EmblemOption, StyleOption, ColorOption, PoseOption } from '../types';
import { HAIR_COLOR_OPTIONS, EMBLEM_OPTIONS, STYLE_OPTIONS, COLOR_OPTIONS, POSE_OPTIONS } from '../constants';
import Icon from './Icon';

interface CustomizePageProps {
  initialOptions: CustomizationOptions;
  onComplete: (options: CustomizationOptions) => void;
}

const colorMap: { [key in ColorOption]: string } = {
    Red: 'bg-red-500',
    Blue: 'bg-blue-500',
    Green: 'bg-green-500',
    Yellow: 'bg-yellow-400',
    Purple: 'bg-purple-500',
};

const hairColorMap: { [key in HairColorOption]: string } = {
    Original: 'bg-gradient-to-r from-yellow-400 via-pink-500 to-indigo-500',
    Black: 'bg-black',
    Brown: 'bg-amber-800',
    Blonde: 'bg-yellow-300',
    Red: 'bg-red-700',
}

const Emblem: React.FC<{ shape: EmblemOption, className?: string }> = ({ shape, className }) => {
    switch(shape) {
        case 'Lightning': return <div className={className}>&#9889;</div>
        case 'Star': return <div className={className}>&#9733;</div>
        case 'Heart': return <div className={className}>&#9829;</div>
        case 'Circle': return <div className={`${className} rounded-full bg-current`} />
        default: return null;
    }
}

const CustomizePage: React.FC<CustomizePageProps> = ({ initialOptions, onComplete }) => {
  const [options, setOptions] = useState<CustomizationOptions>(initialOptions);

  const updateOption = <K extends keyof CustomizationOptions>(key: K, value: CustomizationOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="animate-slide-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Customize Your Hero</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Fine-tune your hero's look and give them a name!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Customization Options */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-cartoon">
          <div className="space-y-8">
            {/* Hero Name */}
            <div>
              <label htmlFor="heroName" className="block text-xl font-bold mb-2">Hero Name</label>
              <input
                id="heroName"
                type="text"
                value={options.heroName}
                onChange={(e) => updateOption('heroName', e.target.value)}
                placeholder="Captain Awesome"
                className="w-full max-w-md p-3 text-lg border-2 border-black rounded-xl bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary"
              />
            </div>

            {/* Art Style, Color, Pose */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-xl font-bold mb-3">Art Style</label>
                    <div className="flex flex-wrap gap-3">{STYLE_OPTIONS.map(opt => (<button key={opt} onClick={() => updateOption('style', opt)} className={`px-4 py-2 rounded-xl font-bold transition-all border-2 border-black text-sm ${options.style === opt ? 'bg-brand-primary text-white shadow-inner' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 shadow-cartoon-sm hover:shadow-none hover:translate-y-0.5 transform'}`}>{opt}</button>))}</div>
                </div>
                <div>
                    <label className="block text-xl font-bold mb-3">Suit Color</label>
                    <div className="flex flex-wrap gap-4 items-center">{COLOR_OPTIONS.map(opt => (<button key={opt} onClick={() => updateOption('color', opt)} className={`w-10 h-10 rounded-full ${colorMap[opt]} transition-transform transform hover:scale-110 border-2 border-black ${options.color === opt ? 'ring-4 ring-offset-2 dark:ring-offset-slate-800 ring-black' : ''}`} aria-label={`Select ${opt} color`} />))}</div>
                </div>
                 <div>
                    <label className="block text-xl font-bold mb-3">Pose</label>
                    <div className="flex flex-wrap gap-3">{POSE_OPTIONS.map(opt => (<button key={opt} onClick={() => updateOption('pose', opt)} className={`px-4 py-2 rounded-xl font-bold transition-all border-2 border-black text-sm ${options.pose === opt ? 'bg-brand-primary text-white shadow-inner' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 shadow-cartoon-sm hover:shadow-none hover:translate-y-0.5 transform'}`}>{opt}</button>))}</div>
                </div>
            </div>

             {/* Hair Color & Emblem */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xl font-bold mb-3">Hair Color</label>
                    <div className="flex flex-wrap gap-4 items-center">{HAIR_COLOR_OPTIONS.map(opt => (<button key={opt} onClick={() => updateOption('hairColor', opt)} className={`w-10 h-10 rounded-full ${hairColorMap[opt]} transition-transform transform hover:scale-110 border-2 border-black ${options.hairColor === opt ? 'ring-4 ring-offset-2 dark:ring-offset-slate-800 ring-black' : ''}`} aria-label={`Select ${opt} hair color`} />))}</div>
                </div>
                <div>
                    <label className="block text-xl font-bold mb-3">Emblem Shape</label>
                     <div className="flex flex-wrap gap-3">{EMBLEM_OPTIONS.map(opt => (<button key={opt} onClick={() => updateOption('emblemShape', opt)} className={`w-12 h-12 flex items-center justify-center text-3xl rounded-xl font-bold transition-all border-2 border-black ${options.emblemShape === opt ? 'bg-brand-primary text-white shadow-inner' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 shadow-cartoon-sm hover:shadow-none hover:translate-y-0.5 transform'}`}><Emblem shape={opt} className="w-8 h-8"/></button>))}</div>
                </div>
            </div>
          </div>
        </div>

        {/* Right Side: Live Preview */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-black shadow-cartoon-sm group hover:shadow-cartoon transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-4 text-center">Live Preview</h3>
            <div className={`relative w-full aspect-square ${colorMap[options.color]} rounded-2xl border-2 border-black flex items-center justify-center overflow-hidden transition-colors duration-300`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="text-white text-8xl font-black group-hover:scale-110 transition-transform duration-500 ease-out transform">
                    <Emblem shape={options.emblemShape} className="w-32 h-32 drop-shadow-lg" />
                </div>
                <div className="absolute top-4 left-4">
                    <div className={`w-16 h-16 rounded-full ${hairColorMap[options.hairColor]} border-2 border-black`}></div>
                </div>
                <div className="absolute bottom-4 bg-black/50 px-4 py-2 rounded-lg">
                    <p className="text-white font-bold text-2xl">{options.heroName || 'Your Hero'}</p>
                </div>
            </div>
            <p className="text-center mt-4 text-slate-500 dark:text-slate-400 font-semibold">{options.style} Style, {options.pose} Pose</p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => onComplete(options)}
          disabled={!options.heroName}
          className="px-12 py-4 text-2xl font-bold text-black bg-brand-secondary rounded-2xl border-2 border-black shadow-cartoon-sm hover:shadow-cartoon transition-all duration-200 transform hover:-translate-y-1 hover:-translate-x-1 focus:outline-none focus:ring-4 focus:ring-amber-400/50 disabled:bg-slate-400 disabled:text-slate-600 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
        >
          {options.heroName ? 'Create My Hero!' : 'Please Enter a Name'}
        </button>
      </div>
    </div>
  );
};

export default CustomizePage;
