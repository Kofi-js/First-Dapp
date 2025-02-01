import { useState } from 'react'
import abi from './abi.json'
import {ethers} from 'ethers'



function App() {
  const [userInput, setUserInput] = useState('')
  const [retrievedMessage, setRetrievedMessage] = useState([])
  const contractAddress = '0xE403dFc20C06f3bBCd78e5EBA0A605e85494CfAc'
  const contractABI = abi

   // Request wallet connection
   async function requestAccounts() {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (err) {
        console.log("Failed to connect wallet", err);
    }
}

// To set Messages
async function setMessage() {
    if (typeof window.ethereum !== 'undefined') {
        await requestAccounts(); // Ensure wallet is connected

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            const tx = await contract.setMessage(userInput);
            const receipt = tx.wait(); // Wait for confirmation
            console.log("Transaction successful:", receipt);
        } catch (err) {
            console.log("Failed Transaction", err);
        }
    } else {
        console.log("MetaMask is not installed.");
    }
}

// To Get Messages
async function getMessage() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        
        try {
            const message = await contract.getMessage(); // Read from contract
            setRetrievedMessage(prevMessages => [message, ...prevMessages]); // Store messages
        } catch (err) {
            console.log("Failed to retrieve message", err);
        }
    } else {
        console.log("MetaMask is not installed.");
    }
}

  return (
<div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center justify-center">
    <h1 className="font-pressStart text-4xl mb-12 text-white">First DApp</h1>
    <div className="w-full max-w-md space-y-6">
        <div className="relative">
        <input 
        type="text" 
        value={userInput} 
        onChange={(e) => setUserInput(e.target.value)} 
        placeholder="Enter your message"
        className="w-full px-4 py-3 bg-gray-800 border-2 rounded-lg text-white font-inter placeholder-gray-500 focus:outline-none focus:border-neon-pink transition-colors"/>
        </div>

        <div className="flex space-x-4">
        <button onClick={setMessage} className="flex-1 px-6 py-3 bg-cyber-darker border-2 border-neon-blue text-neon-blue font-inter rounded-lg hover:bg-neon-blue hover:text-cyber-darker transition-all duration-300">Send Message</button>
        <button onClick={getMessage} className="flex-1 px-6 py-3 bg-cyber-darker border-2 border-neon-purple text-neon-purple font-inter rounded-lg hover:bg-neon-purple hover:text-cyber-darker transition-all duration-300">Retrieve Message</button>
        </div>

        <div className="mt-8">
        <h2 className="font-pressStart text-xl text-white mb-4">Messages:</h2>
        <ul className="space-y-3 font-inter text-white">
            {retrievedMessage.map((data, index) => {
               return <li key={index}>{data}</li>;
            })}
       </ul>
        </div>
    </div>
  </div>
  )
}



export default App