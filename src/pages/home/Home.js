import './Home.css'
import React, { useEffect, useState } from 'react'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { faCopy as farCopy } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import walletLogo from '../../asset/wallet_color.svg'

function Home() {

  const [balance, setBalance] = useState(0);
  const [copyBtn, setCopyBtn] = useState(false);

  const handleCopyBtn = () => {
    setCopyBtn(true);
  }

  const navigate = useNavigate();

  return (
    <div className='content'>
      <img src={walletLogo} alt='logo' className='frontPageLogo'/>
      <h2>Hello</h2>
      <h4> Welcome to your Web 3 Wallet</h4>
      <Button
        className='frontPageButton'
        color="primary"
        variant="contained"
        onClick={() => navigate("/create")}
      >
        Create your Wallet
      </Button>
      <Button className='frontPageButton signin' color='info' variant="outlined">Sign In</Button>
      <Button
        className='frontPageButton'
        color="primary"
        variant="contained"
        onClick={() => navigate("/recover")}
      >
        Recover with Seed Phrase
      </Button>
    </div>
  )
}

export default Home