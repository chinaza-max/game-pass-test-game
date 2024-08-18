"use client"
import Image from "next/image";
import { useEffect, useRef, useState } from 'react';
import WalletContext from './context/walletContext.js'
import Game from './components/Game.js'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';



export default function Home() {
 
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);


  return (
    
     <>
     {domLoaded && (
        <WalletContext> 
          <Game/>
        </WalletContext>
     )}
   </>
  );
}
