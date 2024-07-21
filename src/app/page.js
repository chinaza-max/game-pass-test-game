"use client"
import Image from "next/image";
import { useEffect, useRef, useState } from 'react';
import WalletContext from './context/walletContext.js'
import CustomWalletButton from './components/customWalletButton.js'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';



export default function Home() {
 
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  //const { connected } = useWallet();
  //const { publicKey, signTransaction } = useWallet();




  
 // const [currentScore, setCurrentScore] = useState(null);

  



 




  const updateLevel=(level)=>{


  }

  /*
  useEffect(() => {

    console.log(Connection, PublicKey)
    
    countRef.current = count;
    startCounter()
    const checkDead = setInterval(() => {
      const characterTop = parseInt(
        window.getComputedStyle(characterRef.current).getPropertyValue('top')
      );
      const blockLeft = parseInt(
        window.getComputedStyle(blockRef.current).getPropertyValue('left')
      );

      if (blockLeft < 20 && blockLeft > 0 && characterTop >= 130) {
         
        //console.log("Current Score:", countRef.current);
        //    const newLevel = Math.floor(currentCount / 10);

       // console.log("Current level:",Math.floor(countRef.current / 10));
        if(Math.floor(countRef.current / 10)>level ){
            updateLevel
        }
        pauseCounter()

        //window.alert(`You lose   Score:${countRef.current}`)
        resetCounter()
        startCounter()

        blockRef.current.style.left = '980px';

      }
    }, 10);

    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

   

    return () => {
      
      clearInterval(intervalRef.current); 
      clearInterval(checkDead);

    };
  }, []);*/

  /*useEffect(() => {
    console.log(connected)
    if (connected) {
      
      const gameId = '9qfHYgoCCXWtvDvwCi5HPH2tSatpU89ARBrt2cpqBwyA';
      const userGameAcctPublicKey = 'zWzDrxPioNY6YLiKkpGFugRV9eZao7rVxpMcPAenTqM';
      fetchGameAccount(gameId, userGameAcctPublicKey);

    }
  }, [connected]);*/

 


  return (
    
     <>
     {domLoaded && (
        <WalletContext> 
          <CustomWalletButton/>
        </WalletContext>
     )}
   </>
  );
}
