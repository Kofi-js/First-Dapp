import { useState } from 'react'
import abi from './abi.json'
import {ethers} from 'ethers'



function App() {
  const [userInput, setUserInput] = useState('')
  const [retrievedMessage, setRetrievedMessage] = useState('')
  const contractAddress = '0x32871De03345ECfba742e1BC163E66C2903F7640'
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
<div>
    <h1>Kofi DApp</h1>      
    <input 
        type="text" 
        value={userInput} 
        onChange={(e) => setUserInput(e.target.value)} 
        placeholder="Enter your message"
    />
    <button onClick={setMessage}>Send Message</button>
    <button onClick={getMessage}>Retrieve Message</button>
    <h2>Previous Messages:</h2>
    <p>{retrievedMessage.length > 0 ? retrievedMessage.join(',') : "No messages yet"}</p>
  </div>
  )
}



export default App