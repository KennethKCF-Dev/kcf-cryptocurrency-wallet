import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import RecoverWallet from './pages/recoverWallet/RecoverWallet';
import WalletView from './pages/walletView/WalletView';
import CreateWallet from './pages/createWallet/CreateWallet';

function Router(props) {
    return (
        <Routes>
            <Route path='/' exact Component={Home} />
            <Route path='/recover' exact Component={RecoverWallet} />
            <Route path='/wallet' exact Component={WalletView} />
            <Route path='/create' exact element={<CreateWallet setSeedPhrase={props.setSeedPhrase} setWallet={props.setWallet}/>} />
        </Routes>
    )
}

export default Router