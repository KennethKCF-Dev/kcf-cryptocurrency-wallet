import logo from './logo.svg';
import './App.css';
//import dotenv from 'dotenv';
import Web3 from 'web3';
import Footer from './components/footer/Footer';
import { Routes, Route } from 'react-router-dom';
import { MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from './pages/home/Home';
import RecoverWallet from './pages/recoverWallet/RecoverWallet';
import WalletView from './pages/walletView/WalletView';
import CreateWallet from './pages/createWallet/CreateWallet';
import SignInWallet from './pages/signinWallet/SignInWallet';
import walletLogo_bw from './asset/wallet_logo.svg';

//import Router from './Router';

function App() {

  const [selectedChain, setSelectedChain] = useState("0xaa36a7");
  const [wallet, setWallet] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState(null);
  const [password, setPassword] = useState(null);
  const [isRecover, setIsRecover] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [encryptedJson, setEncryptedJson] = useState(null);

  const onChangeSelectedChain = (event) => {
    return setSelectedChain(event.target.value);
  }

  useEffect(() => {
    const encryptedJson = localStorage.getItem("walletEncryptedJson");
    if (encryptedJson) setEncryptedJson(encryptedJson);
  }, [])

  return (
    <div className="App">
      <ToastContainer
        position="top-center"
        autoClose={500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
      />
      <header>
        <img className='headerLogo' alt='logo' src={walletLogo_bw} />
        <Select value={selectedChain} onChange={onChangeSelectedChain} className='dropdown'>
          <MenuItem value={"0xaa36a7"}>Sepolia Ethereum</MenuItem>
          <MenuItem value={"0x5"}>Goerli Ethereum</MenuItem>
          <MenuItem value={"0x80001"}>Polygon Mumbai</MenuItem>
        </Select>
      </header>
      {wallet && seedPhrase ?
        <Routes>
          <Route path='/wallet' exact element={
            <WalletView wallet={wallet} setWallet={setWallet} seedPhrase={seedPhrase} setSeedPhrase={setSeedPhrase} selectedChain={selectedChain} setEncryptedJson={setEncryptedJson} />
          } />
        </Routes>
        :
        <Routes>
          <Route path='/' exact element={<Home encryptedJson={encryptedJson} setIsNew={setIsNew} setEncryptedJson={setEncryptedJson} setIsRecover={setIsRecover} />} />
          <Route path='/recover' exact element={<RecoverWallet password={password} setSeedPhrase={setSeedPhrase} setWallet={setWallet} />} />
          <Route path='/sign-in' exact element={<SignInWallet encryptedJson={encryptedJson} isNew={isNew} isRecover={isRecover} password={password} setPassword={setPassword} setSeedPhrase={setSeedPhrase} setWallet={setWallet} />} />
          <Route path='/create' exact element={<CreateWallet setSeedPhrase={setSeedPhrase} setWallet={setWallet} />} />
        </Routes>
      }
    </div>
  );
}

export default App;
