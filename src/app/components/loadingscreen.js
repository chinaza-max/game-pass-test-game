import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-[#1a1a2e] text-white font-sans">
      <div className="text-center">
        <div className="text-xl mb-5">Loading Game...</div>
        <div className="w-52 h-2 bg-[#16213e] rounded overflow-hidden">
          <div className="w-0 h-full bg-[#0f3460] animate-loading"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            width: 0%;
          }
          50% {
            width: 50%;
          }
          100% {
            width: 100%;
          }    
        }

        .animate-loading {
          animation: loading 5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
