import './Home.css'
import React, { useEffect, useState } from 'react'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { faCopy as farCopy } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
 
function Home() {

  const [balance, setBalance] = useState(0);
  const [copyBtn, setCopyBtn] = useState(false);

  const handleCopyBtn = () => {
    setCopyBtn(true);
  }

  return (
    <div className='page'>
        <div className='page-container'>
          <button className='clipboard-btn' onClick={handleCopyBtn}>
            Address
            {copyBtn ? <FontAwesomeIcon icon={faCopy}/> :
            <FontAwesomeIcon icon={farCopy}/> }
          </button> 
          <h1>
            {balance} ETH
          </h1>
          <Button>
            Send
          </Button>
          <Button>
            Share
          </Button>
          
        </div>
    </div>
  )
}

export default Home