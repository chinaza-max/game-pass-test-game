
import React,  {useEffect, useState, useRef}from 'react'
import { useWallet } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter,  PhantomWalletName} from '@solana/wallet-adapter-wallets';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Transaction } from '@solana/web3.js';
import axios from 'axios';
import Image from "next/image";
import Counter from "./counter";
//import soundFile from '../../app/assets/BKKS8SE-bird-unknown-water-bird.mp3';
//const playlist = require('../public/audio/BKKS8SE-bird-unknown-water-bird.mp3');
 


export default function CustomWalletButton() {
  const characterRef = useRef(null);
  const blockRef = useRef(null);
  const [count, setCount] = useState(0);
  const [gameName, setGameName] = useState(null);
  const [highest, setHighest] = useState(0);
  const [level, setLevel] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const countRef = useRef(count);
  const { publicKey, signTransaction } = useWallet();
  const [showButton, setShowButton ] = useState(false);

  
  const [ gameId, setGameId ] = useState("5T8oSQdzrhYHqs6WgYCGeEdu1ntHRpqvzczfRXnku2Vk");
  const [userGameAcctPublicKey, setUserGameAcctPublicKey ] = useState("HqnvPVa3Lue7WfGKB322FxhhBEfJbdXkz6CaTFwwhUm6");
  
  const [message, setMessage] = useState('');

  //const audioRef = useRef(new Audio(playlist));

 /* const playSound = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const stopSound = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };*/

  const startCounter = () => {
    
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setCount(prevCount =>{ 
          const newCount = prevCount + 1;
          countRef.current = newCount; 
          return newCount;
        });

      }, 1000);
    }
  };

  const pauseCounter = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  };

  const resetCounter = () => {
    clearInterval(intervalRef.current);
    setCount(0);
    countRef.current = 0;
    setIsRunning(false);
  };


  const jump = () => {
    if (characterRef.current) {
      characterRef.current.classList.add('animate');
      setTimeout(() => {
        if (characterRef.current) {
          characterRef.current.classList.remove('animate');
        }
      }, 500);
    }
  };



  
  const fetchGameAccount =  async (gameId)=> {
 
    try {
      const response = await axios.get('http://localhost:3001/api/v1/game/getSingleUserGameAccount', {
        params: {
          gameId: gameId,
          userGameAcctPublicKey: publicKey,
        },
      });

      setHighest(response.data.data.score)
      setLevel(response.data.data.level)

      const response2 = await axios.get('http://localhost:3001/api/v1/game/getSingleGameAccount', {
        params: {
          gameId: gameId,
        },
      });

      setGameName(response2.data.data.gameName)

      setShowButton(true)


    } catch (error) {
      console.error('Error fetching game account data:', error);
    }
  };

  const updateLevel=async (level, userGameAcctPublicKey)=>{

    console.log("level, userGameAcctPublicKey")
    console.log(level, userGameAcctPublicKey)
    console.log("level, userGameAcctPublicKey")

    
      try {
        if (!publicKey) {
          setMessage('Wallet not connected');
          return;
        }
  
        const response = await fetch('http://localhost:3001/api/v1/game/getTrasaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            { 
              userGameAcctPublicKey,
              type:"updateUserLevel",
              level
           })
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch transaction from server');
        }
  
        const data2=await response.json()
  
  
        const { transaction }= data2.data
  
        const recoveredTransaction = Transaction.from(Buffer.from(transaction, 'base64'));
  
        // Step 2: Sign the transaction
        const signedTransaction = await signTransaction(recoveredTransaction);

        const sendResponse = await fetch('http://localhost:3001/api/v1/game/userGameAccountActions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({/*uniqueId,userPublicKey:publicKey.toString() ,*/
            signedTransaction: signedTransaction.serialize().toString('base64'), 
            type:"updateUserLevel"
          }),
            
        });
  
        if (!sendResponse.ok) {
          throw new Error('Failed to submit signed transaction to server');
        }
  
        const result = await sendResponse.json();
          (result.message);
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }

  }


  const updateScore=async (score, userGameAcctPublicKey)=>{

    console.log("score, userGameAcctPublicKey")
    console.log(score, userGameAcctPublicKey)
    console.log("score, userGameAcctPublicKey")


    try {
      if (!publicKey) {
        setMessage('Wallet not connected');
        return;
      }

      const response = await fetch('http://localhost:3001/api/v1/game/getTrasaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          { 
            userGameAcctPublicKey,
            type:"updateUserScore",
            score
         })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transaction from server');
      }

      const data2=await response.json()


      const { transaction }= data2.data

      const recoveredTransaction = Transaction.from(Buffer.from(transaction, 'base64'));

      // Step 2: Sign the transaction
      const signedTransaction = await signTransaction(recoveredTransaction);

      const sendResponse = await fetch('http://localhost:3001/api/v1/game/userGameAccountActions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({/*uniqueId,userPublicKey:publicKey.toString() ,*/
          signedTransaction: signedTransaction.serialize().toString('base64'), 
          type:"updateUserScore"
        }),
          
      });

      if (!sendResponse.ok) {
        throw new Error('Failed to submit signed transaction to server');
      }

      const result = await sendResponse.json();
        (result.message);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }

}

const startGame=()=>{

  //playSound()
  startCounter()
  if (blockRef.current && !blockRef.current.classList.contains('animate2')) {
    blockRef.current.classList.add('animate2');
  }
  setShowButton(false)

}


const stopGame=()=>{

  pauseCounter()
  resetCounter()
  if (blockRef.current) {
    if (!blockRef.current.classList.contains('animate2')) {} 
    else {
      blockRef.current.classList.remove('animate2');
    }
  }

  setShowButton(true)

}

 

  useEffect(()=>{

    if(publicKey){

      fetchGameAccount(gameId, userGameAcctPublicKey);
    }
  },[publicKey])

 

  


  useEffect(() => {
 
    countRef.current = count;
    const checkDead = setInterval(() => {
      const characterTop = parseInt(
        window.getComputedStyle(characterRef.current).getPropertyValue('top')
      );
      const blockLeft = parseInt(
        window.getComputedStyle(blockRef.current).getPropertyValue('left')
      );

      if (blockLeft < 20 && blockLeft > 0 && characterTop >= 130) {

        
        if(publicKey){

          if(Math.floor(countRef.current / 10)> level ){

            const levelDifference=Math.floor(countRef.current / 10)-level
            updateLevel(levelDifference, userGameAcctPublicKey )
          }
          if(countRef.current > highest ){
            const scoreDifference=countRef.current-highest
            updateScore( scoreDifference , userGameAcctPublicKey)
          }
          window.alert(`You lose   Score:${countRef.current}`)

          stopGame()
          fetchGameAccount(gameId)

          //pauseCounter()

         // resetCounter()
         // startCounter()

          blockRef.current.style.left = '980px';
        }
      }
    }, 10);

    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

   
    return () => {
      
      //clearInterval(intervalRef.current); 
      clearInterval(checkDead);

    };
  }, [gameName ,highest, level,showButton]);




  return (
    <>
      <main onClick={jump}>
          
          <div id="clouds">
          
          {showButton ? 
            <button onClick={startGame} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">start game</button>
          :
              ''
            }
          <div className="flex justify-between text-gray-900"> 
              <div>
                <strong>Game Name</strong>:
                <span> {gameName}</span>
              </div>

              <div> 
                <WalletMultiButton/>

              </div>

            </div>

            <div className="flex justify-between"> 
              <div className="">
                <div className="text-red-500">              
                  <strong>Highest score</strong>:
                  <span> {highest}</span>
                </div>
                <div className="text-green-500">
                  <strong >Level</strong>:
                  <span> {level}</span>
                </div>
              </div>

              <div className="text-green-500 mr-8 border flex"> 
              

                <span><strong >Counter</strong></span>:
                <span> 
                    <Counter countP={count}/> 
                </span> 
              </div>

            </div>

          <div id="game">
              <div id="character" ref={characterRef} >

                <div className="bird bird--one"></div>

              </div>
              <div id="block"  ref={blockRef} >
                  <Image 
                    src="/bullet-svgrepo-com.svg"
                    width={500}
                    height={500}
                    className="-rotate-90"
                    alt="Picture of the author"
                  />            
                </div>
          </div>
            <div className="cloud x1"></div> 
            <div className="cloud x2"></div>
            <div className="cloud x3"></div>
            <div className="cloud x4"></div>
            <div className="cloud x5"></div>
        </div>
      </main>

    </>
  )
}
