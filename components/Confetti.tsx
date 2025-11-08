
import React from 'react';

const Confetti: React.FC = () => {
  const confettiCount = 100;
  const colors = ['#4F46E5', '#F59E0B', '#EC4899', '#10B981', '#3B82F6'];

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotateZ(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotateZ(var(--rotation-end));
          }
        }
        .confetti {
          position: absolute;
          top: -20px;
          left: var(--left-start);
          width: var(--size);
          height: var(--size);
          background-color: var(--color);
          opacity: 0;
          animation-name: confetti-fall;
          animation-timing-function: linear;
          animation-duration: var(--duration);
          animation-delay: var(--delay);
          animation-fill-mode: forwards;
          clip-path: var(--clip);
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {Array.from({ length: confettiCount }).map((_, i) => {
          const style: React.CSSProperties = {
            '--left-start': `${Math.random() * 100}vw`,
            '--size': `${Math.random() * 8 + 6}px`,
            '--color': colors[Math.floor(Math.random() * colors.length)],
            '--duration': `${Math.random() * 3 + 4}s`,
            '--delay': `${Math.random() * 2}s`,
            '--rotation-end': `${Math.random() * 720 - 360}deg`,
            '--clip': Math.random() > 0.5 
              ? 'polygon(50% 0%, 0% 100%, 100% 100%)' 
              : 'circle(50% at 50% 50%)',
          };
          return <div key={i} className="confetti" style={style}></div>;
        })}
      </div>
    </>
  );
};

export default Confetti;