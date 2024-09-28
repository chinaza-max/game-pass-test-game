
import React,  {useEffect, useState, useRef}from 'react'
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { PhantomWalletAdapter,  PhantomWalletName} from '@solana/wallet-adapter-wallets';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Connection,Transaction ,clusterApiUrl , sendAndConfirmTransaction } from '@solana/web3.js';

import axios from 'axios';
import Image from "next/image";
import Counter from "./counter";
import Onboarding from "./onboarding";
import LoadingScreen from "./loadingscreen";


export default function Game() {
  const characterRef = useRef(null);
  const blockRef = useRef(null);
  const [count, setCount] = useState(0);
  const [gameName, setGameName] = useState(null);
  const [highest, setHighest] = useState(0);
  const [level, setLevel] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const countRef = useRef(count);
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const [showButton, setShowButton ] = useState(false);
  const audioRefBird = useRef();
  const audioRefAir = useRef();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const connection = new Connection(clusterApiUrl('devnet'));
  //const [domain, setDomain] = useState("http://localhost:3001/api/v1");
  const [domain, setDomain] = useState("/api/game");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [error, setError] = useState(null);


  
  const [timerId, setTimerId] = useState(null);

  
  const [ gameId, setGameId ] = useState("4aJW6PimTjEqDHFqbwDNRYZB4nXcoUwuqQ9uguivNSCv");
  const [userGameAcctPublicKey, setUserGameAcctPublicKey ] = useState("");
  
  const [message, setMessage] = useState('');

  //const audioRefBird = useRef(new Audio(playlist));

  const playSound = () => {

    audioRefBird.current.play()
    audioRefBird.current.volume =0.2
    audioRefAir.current.volume=0.4


    if (timerId) {
      clearInterval(timerId);
    }

    if (audioRefBird.current) {
      const newTimerId = setInterval(() => {
        audioRefBird.current.play()
        audioRefAir.current.play()

      }, 7000);


      setTimerId(newTimerId);

    }

   
  };

  const stopSound = () => {

    if (audioRefBird.current) {
      audioRefBird.current.pause();
      audioRefAir.current.pause();
      audioRefBird.current.currentTime = 0;
      audioRefAir.current.currentTime = 0;
      clearInterval(timerId);
      setTimerId(null);
    }

 
  };

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
    stopSound()
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



  const checkAuthentication = async () => {

    try {
      const response = await axios.post(`${domain}`, {
        actionType:'doesUserGameAccountExist',
        gamerPublicKey:publicKey,
        gameId: gameId
      });

      if(response.data.data==false){
        setIsAuthenticated('false');
        fetchGameAccount(response.data.data.accountId,false);

      }else{
        setUserGameAcctPublicKey(response.data.data.accountId);
        setIsAuthenticated(response.data);
        fetchGameAccount(response.data.data.accountId);
      }


    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
    }
  };





  
  const fetchGameAccount =  async (userGameAcctPublicKey, loadBoth=true)=> {
 
    try {

      if(loadBoth){
        const response = await axios.get(`${domain}`, {
          params: {
            type: 'getSingleUserGameAccount',
            userGameAcctPublicKey: userGameAcctPublicKey,
          },
        });
  
        setHighest(response.data.data.score)
        setLevel(response.data.data.level)
      }
     

     
      const response2 = await axios.get(`${domain}`, {
        params: {
          type: 'getSingleGameAccount',
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
    
      try {
        if (!publicKey) {
          setMessage('Wallet not connected');
          return;
        }
  
        const response = await fetch(`${domain}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            { 
              userGameAcctPublicKey,
              type:"updateUserLevel",
              actionType: 'userGameAccountActions',
              level
           })
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch transaction from server');
        } 
        else{
          setTimeout(() => {
            fetchGameAccount(userGameAcctPublicKey)
          }, 5000);
        }
  
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }

  }


  const updateScore=async (score, userGameAcctPublicKey)=>{


    try {
      if (!publicKey) {
        setMessage('Wallet not connected');
        return;
      }

      const response = await fetch(`${domain}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          { 
            userGameAcctPublicKey,
            type:"updateUserScore",
            actionType: 'userGameAccountActions',
            score
         })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transaction from server');
      }
      else{
        setTimeout(() => {
          fetchGameAccount(userGameAcctPublicKey)
        }, 10000);

      }

    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }

}

const startGame=()=>{
  playSound()
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
      checkAuthentication()
    }
  },[publicKey])

//      setSignUpLoading(false)
/*
  const createUserGameAccount =async ()=>{

    setSignUpLoading(true)
    const response = await fetch(`${domain}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        { 
          gamerPublicKey:publicKey.toString(),
          gameId,
          type:"initializeUserGameAccount",
          actionType:"initializeUserGameAccount",
          userAvatar:"https://cdn.pixabay.com/photo/2023/02/10/08/00/chick-7780328_1280.png"
        }),
    });

    if (!response.ok) {
      setSignUpLoading(false)
      throw new Error('Failed to fetch transaction from server');
    }

    const data = await response.json();
    const { serializedTransaction } = data.data;

    const recoveredTransaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));
    
    const latestBlockhash = await connection.getLatestBlockhash();
    recoveredTransaction.recentBlockhash = latestBlockhash.blockhash;
    recoveredTransaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;

    const signedTransaction = await signTransaction(recoveredTransaction);

    const txnSignature = await sendAndConfirmTransaction(
      connection,
      signedTransaction,
      [],  // We don't need to pass publicKey here as it's already in the transaction
      {
        commitment: 'confirmed',
        maxRetries: 5,
      }
    );

    console.log('Transaction confirmed:', txnSignature);

    setTimeout(() => {
      setSignUpLoading(false);
      router.reload();
    }, 3000);
    


  }    */


    
    const createUserGameAccount = async () => {
      if (!publicKey || !signTransaction) {
        setError('Wallet not connected');
        return;
      }
  
      setSignUpLoading(true);
      setError(null);
  
      try {
        const response = await fetch(`${domain}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            gamerPublicKey: publicKey.toString(),
            gameId,
            type: "initializeUserGameAccount",
            actionType: "initializeUserGameAccount",
            userAvatar: "https://cdn.pixabay.com/photo/2023/02/10/08/00/chick-7780328_1280.png"
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch transaction from server');
        }
  
        const data = await response.json();
        const { serializedTransaction } = data.data;
  
        const recoveredTransaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));

        // Sign the transaction
        const signedTransaction = await signTransaction(recoveredTransaction);
      
        console.log(signedTransaction)
        console.log("signedTransaction")
        const base64Tx = signedTransaction.serialize().toString('base64');

        console.log(base64Tx)
        console.log("base64Tx")

        const response2 = await fetch(`${domain}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            signedTransaction: base64Tx,
            actionType: "sendTransactionInitializeUserGameAccount"
          }),
        });
  
        if (!response2.ok) {
          throw new Error('Failed to send transaction to server');
        }

        setTimeout(() => {
          setSignUpLoading(false);
          router.reload();
        }, 3000);

        
      } catch (err) {
        setSignUpLoading(false);
       
        console.log(err)

        console.log(err.message)

        console.error('Transaction error:', err);
      }
    };
 

  useEffect(() => {
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timerId]);
  


  useEffect(() => {

    if(isAuthenticated!="false"&&isAuthenticated!=null){
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
           /* window.alert(`You lose   Score:${countRef.current}`)*/
  
            stopGame()
          
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
    }

  }, [gameName ,highest, level,showButton]);


  return (
    <>

      {!publicKey ? (
         <>
         
          <Onboarding/>

          
        </>
      ) : isAuthenticated === null ? (
        <LoadingScreen/>
      ) : isAuthenticated!="false" ? (
     
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

        <audio ref={audioRefBird} src='/Vulture3.mp3' />
        <audio ref={audioRefAir} src='/air1.mp3' />

        </>  
    ) : (
      <>
      
      <div 
      className={`relative bg-cover bg-center h-screen w-full transition-all duration-1000 ease-in-out flex flex-col items-center justify-center`}
      style={{ backgroundImage: `url(/bird4.png)` }}
    >

        <button onClick={createUserGameAccount} className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300">
        
        
        {
          signUpLoading  ? <div className="text-center mb-2 text-black"> Loading ..... </div> :
          `Sign Up  for ${gameName}`
        }
      
        </button>
      </div>    

      </>
    )}
    </>  
  )
}

/*
export async function getServerSideProps(){

  console.log(process.env.SECRET)
  
  return {
    props:{
      hello:"hello world" 
    }
  }
}*/