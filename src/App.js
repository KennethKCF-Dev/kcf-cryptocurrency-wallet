import logo from './logo.svg';
import './App.css';
//import dotenv from 'dotenv';
import Web3 from 'web3';
import Footer from './components/footer/Footer';
import { Routes, Route } from 'react-router-dom';
import { MenuItem, Select } from '@mui/material';
import { useState } from 'react';

import Home from './pages/home/Home';
import RecoverWallet from './pages/recoverWallet/RecoverWallet';
import WalletView from './pages/walletView/WalletView';
import CreateWallet from './pages/createWallet/CreateWallet';
import SignInWallet from './pages/signinWallet/SignInWallet';

//import Router from './Router';

function App() {

  const [selectedChain, setSelectedChain] = useState("0xaa36a7");
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
          <MenuItem value={"0xaa36a7"}>Sepolia Ethereum</MenuItem>
          <MenuItem value={"0x13881"}>Mumbai Testnet</MenuItem>
        </Select>
      </header>
      {wallet && seedPhrase ?
        <Routes>
          <Route path='/wallet' exact element={
            <WalletView wallet={wallet} setWallet={setWallet} seedPhrase={seedPhrase} setSeedPhrase={setSeedPhrase} selectedChain={selectedChain}/>
          } />
        </Routes>
        :
        <Routes>
          <Route path='/' exact Component={Home} />
          <Route path='/recover' exact element={<RecoverWallet setSeedPhrase={setSeedPhrase} setWallet={setWallet}/>} />
          <Route path='/sign-in' exact Component={SignInWallet} />
          <Route path='/create' exact element={<CreateWallet setSeedPhrase={setSeedPhrase} setWallet={setWallet} />} />
        </Routes>
      }
      {/* <Router setSeedPhrase={setSeedPhrase} setWallet={setWallet} /> */}
    </div>
  );
}

export default App;
