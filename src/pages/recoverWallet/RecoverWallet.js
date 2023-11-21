import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { Button, OutlinedInput } from '@mui/material';

function RecoverWallet({
  setSeedPhrase,
  setWallet
}) {
  const [ typeSeed, setTypeSeed ] = useState("");
  const [ nonValid, setNonValid ] = useState(false);

  const navigate = useNavigate();

  const recoverWallet = () => {
    let recoveredWallet;
    try{
      recoveredWallet = ethers.Wallet.fromPhrase(typeSeed);
    }catch(err){
      setNonValid(true)
      return;
    }

    setSeedPhrase(typeSeed);
    setWallet(recoveredWallet.address);
    navigate("/wallet")
    return;
  }

  const seedAdjust = (event) => {
    setNonValid(false);
    setTypeSeed(event.target.value)
  }

  return (
    <div className='content'>
      <div className='mnemonic'>
        <LightbulbOutlinedIcon />
        <div>
          Type your seed phrase in the field below to recover your wallet (it
          should include 12 words seperated with spaces)
        </div>
      </div>
      <OutlinedInput
        multiline
        rows={4}
        className='seedPhraseContainer'
        placeholder='Type your seed phrase here...'
        value={typeSeed}
        onChange={seedAdjust}
      />
      <Button
        disabled={
          typeSeed.split(" ").length !== 12 || typeSeed.slice(-1) === " "
        }
        className='frontPageButton'
        variant='contained'
        type='primary'
        onClick={() => recoverWallet()}
      >
        Recover Wallet
      </Button>
      {nonValid && <p style={{ color: "red"}}> Invalid Seed Phrase </p>}
      <p className='frontPageBottom' onClick={() => navigate("/")}>
        Back Home
      </p>
    </div>
  )
}

export default RecoverWallet