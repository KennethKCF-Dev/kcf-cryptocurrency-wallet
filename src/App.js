import logo from './logo.svg';
import './App.css';
//import dotenv from 'dotenv';
import Web3 from 'web3';
import Footer from './components/footer/Footer';
import {Routes, Route} from 'react-router-dom';
import Home from './pages/home/Home';
import { MenuItem, Select} from '@mui/material';
import { useState } from 'react';
import Router from './Router';

// import router from './Router';

function App() {

  // const apiKey =  process.env['apiKey'];
  // const node = `https://go.getblock.io/${apiKey}`;

  // const web3 = new Web3(node);

  const [selectedChain, setSelectedChain] = useState("0x1");
  const [wallet, setWallet] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState(null);

  const onChangeSelectedChain = (event) => {
    return setSelectedChain(event.target.value);
  }

  return (
    <div className="App">
      <header>
          <Select value={selectedChain} onChange={onChangeSelectedChain} className='dropdown'>
            <MenuItem value={"0x1"}>Ethereum</MenuItem>
            <MenuItem value={"0x13881"}>Mumbai Testnet</MenuItem>
          </Select>
      </header>
      <Router props={{setSeedPhrase, setWallet}} />
    </div>
  );
}

export default App;
