import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import walletLogo from '../../asset/wallet_color.svg'
import { Button, CircularProgress, TextField } from '@mui/material';
import { ethers } from 'ethers';

function SignInWallet({
  password,
  setPassword,
  isRecover,
  isNew,
  encryptedJson,
  setSeedPhrase,
  setWallet
}) {

  const [nonValid, setNonValid] = useState(false);
  const [nonLength, setNonLength] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate();

  const validConfirmPassword = (value) => {
    if (password !== value) {
      setNonValid(true)
      setDisableButton(true);
      return;
    }
    setDisableButton(false);
    setNonValid(false)
  }

  const validPasswordLength = (value) => {
    if (value.length < 8) {
      setNonLength(true);
      setPassword(null);
      return;
    }
    setPassword(value);
    setNonLength(false);
  }

  const validPassword = async () => {
    setIsLoading(true);
    try {
      const wallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, password);

      setSeedPhrase(wallet.mnemonic.phrase);
      setWallet(wallet.address)
      setNonValid(false);
      navigate("/wallet")
    } catch (err) {
      setNonValid(true);
      console.log(err)
    }
    setIsLoading(false);
  }

  return (
    <div className='content'>
      <img src={walletLogo} alt='logo' className='frontPageLogo' />
      {!isNew ? (
        <>
          <h2>Welcome back!</h2>
          <h4>The decentralized web awaits</h4>
          <div className='passwordRow'>
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
            />
          </div>
          {nonValid && <p style={{ color: "red" }}> Invalid password </p>}
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              className='frontPageButton'
              color="primary"
              variant="contained"
              onClick={() => validPassword()}
            >
              Next
            </Button>
          )}
        </>
      ) : (
        <>
          <h2>Web 3 Wallet</h2>
          <h4>Encrypt your new DEN</h4>
          <div className='passwordRow'>
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              onChange={(e) => validPasswordLength(e.target.value)}
              placeholder='New Password (min 8 chars)'
            />
          </div>
          <div className='passwordRow'>
            <TextField
              fullWidth
              label="Comfirm Password"
              variant="outlined"
              onChange={(e) => validConfirmPassword(e.target.value)}
              placeholder='Comfirm Password'
            />
          </div>
          {nonValid && <p style={{ color: "red" }}> Invalid password </p>}
          {nonLength && <p style={{ color: "red" }}> Minium length of password is 8. </p>}
          <Button
            disabled={disableButton}
            className='frontPageButton'
            color="primary"
            variant="contained"
            onClick={() => isRecover ? navigate("/recover") : navigate("/create")}
          >
            Next
          </Button>
        </>
      )}
      <p className='frontPageBottom' style={{ marginTop: "5rem" }} onClick={() => navigate("/")}>
        Back Home
      </p>
    </div>
  )
}

export default SignInWallet