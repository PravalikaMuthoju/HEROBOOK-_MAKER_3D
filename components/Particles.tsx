import React from 'react';

const Particles: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes drift {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(-100vh) translateX(var(--drift-x)) rotate(360deg); opacity: 0; }
        }
        .particle {
          position: absolute;
          bottom: -20px;
          animation-name: drift;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          opacity: 0;
          color: var(--color);
        }
      `}</style>
      {Array.from({ length: 20 }).map((_, i) => {
        const style = {
          '--drift-x': `${Math.random() * 20 - 10}vw`,
          animationDelay: `${Math.random() * 30}s`,
          animationDuration: `${20 + Math.random() * 20}s`,
          left: `${Math.random() * 100}vw`,
        } as React.CSSProperties;

        const type = Math.floor(Math.random() * 3);
        switch (type) {
          case 0: // Star
            style['--color'] = '#F59E0B'; // amber-500
            return <div key={i} className="particle text-2xl" style={style}>&#10022;</div>;
          case 1: // Bolt
            style['--color'] = '#EC4899'; // pink-500
            return <div key={i} className="particle text-2xl" style={style}>&#9889;</div>;
          case 2: // Bubble
          default:
            style['--color'] = '#4F46E5'; // indigo-600
            return <div key={i} className="particle w-4 h-4 rounded-full bg-current" style={style}></div>;
        }
      })}
    </>
  );
};

export default Particles;
