import React from 'react';

const CreditsPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center animate-fade-in text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-8">
        About HeroBook Maker
      </h2>
      
      <div className="w-full max-w-2xl h-96 bg-black text-white rounded-2xl border-4 border-slate-700 shadow-cartoon p-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-10"></div>
        <div className="absolute inset-0 animate-credits-scroll">
          <div className="space-y-12 text-center text-lg font-semibold">
            <section>
              <h3 className="text-2xl font-bold text-amber-400 mb-2">Developed By</h3>
              <p>A passionate team of creators</p>
              <p>using Google's AI Studio</p>
            </section>
            
            <section>
              <h3 className="text-2xl font-bold text-amber-400 mb-2">Technologies Used</h3>
              <p>React</p>
              <p>Tailwind CSS</p>
              <p>TypeScript</p>
              <p>Vite</p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-amber-400 mb-2">AI Models Used</h3>
              <p>Gemini 2.5 Flash</p>
              <p>Gemini 2.5 Flash Image</p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-amber-400 mb-2">Ethical Notes</h3>
              <p>This application is for creative and entertainment purposes only.</p>
              <p>All user-uploaded data is processed ephemerally and is not stored on our servers.</p>
              <p>We are committed to the responsible use of AI for positive and imaginative experiences.</p>
            </section>

             <section>
              <h3 className="text-2xl font-bold text-amber-400 mt-16 mb-2">Thank You</h3>
              <p>For creating with us!</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsPage;
