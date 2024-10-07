import React, { useEffect, useState, useRef } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
//import { Roboto } from 'next/font/google';
import { Protest_Guerrilla } from 'next/font/google';
import { useWallet } from '@solana/wallet-adapter-react';


const protestGuerrilla = Protest_Guerrilla({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const GameTitleIntro = () => {
  const audioRefBirdIntro = useRef();
  const images = ['/bird4.png', 'none', '/bird3.png' , 'none', '/bird2.png', 'none', '/bird1.png', 'none', '/bird5.png'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const { disconnect } = useWallet();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const handleBegin = () => {

    try {
      disconnect();
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }


    setShowOverlay(false);
    if (audioRefBirdIntro.current) {
      audioRefBirdIntro.current.play().catch(error => console.error("Playback failed:", error));
    }
  };

  return (
    <div 
      className={`${protestGuerrilla.className} relative bg-cover bg-center h-screen w-full transition-all duration-1000 ease-in-out flex flex-col items-center justify-center`}
      style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
    >
      <audio ref={audioRefBirdIntro} src='/introduction2.mp3' loop />
      
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient">
        BIRD MOVE
      </h1>
      
      <WalletMultiButton />

      {showOverlay && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center">
          <button 
            onClick={handleBegin}
            className="w-[200px] h-[80px] bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105"
          >
            Begin
          </button>
        </div>
      )}
    </div>
  );
};

export default GameTitleIntro;