
import React, { useState } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [consentGiven, setConsentGiven] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in">
      <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-3xl border-4 border-black shadow-cartoon transform hover:rotate-[-1deg] transition-transform duration-300 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-brand-primary dark:text-brand-light drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)] dark:drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]">
          Welcome to HeroBook Maker!
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Turn your child into a superhero! Upload their photos, and our AI will create amazing 3D cartoon avatars and personalized superhero story scenes.
        </p>

        <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 border-2 border-black rounded-xl text-left">
          <p className="font-bold text-yellow-900 dark:text-yellow-200">Important Note:</p>
          <p className="text-yellow-800 dark:text-yellow-300">This experience is designed for children aged 5-10. For best results, please use clear, forward-facing photos.</p>
        </div>

        <div className="mt-8 text-left">
          <label htmlFor="consent" className="flex items-start space-x-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <input
              id="consent"
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-1 h-6 w-6 rounded-md border-2 border-black text-brand-primary focus:ring-brand-primary focus:ring-offset-0"
            />
            <div className="flex-1">
              <span className="font-bold text-slate-800 dark:text-slate-100">Privacy & Data Consent</span>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                I understand that the uploaded photos will be processed by an AI to generate avatars. All uploaded data will be automatically deleted from the servers after 24 hours. I confirm I have the parental rights to use these photos.
              </p>
            </div>
          </label>
        </div>

        <button
          onClick={onStart}
          disabled={!consentGiven}
          className="mt-8 w-full md:w-auto inline-flex items-center justify-center px-10 py-4 text-xl font-bold text-white bg-brand-primary rounded-2xl border-2 border-black shadow-cartoon-sm hover:shadow-cartoon transition-all duration-200 transform hover:-translate-y-1 hover:-translate-x-1 focus:outline-none focus:ring-4 focus:ring-brand-primary/50 disabled:bg-slate-400 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
        >
          Start Your Adventure
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
