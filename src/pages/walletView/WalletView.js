import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout';
import { Divider, List, ListItem, Tab, Tabs, Tooltip, ListItemAvatar, Avatar, ListItemText, CircularProgress, Button, TextField } from '@mui/material';
import TabPanel from '../../components/tabPanel/TabPanel';
import axios from 'axios';
import { CHAINS_CONFIG } from '../../chains';
import { ethers } from 'ethers';

function WalletView({
  wallet,
  seedPhrase,
  setWallet,
  setSeedPhrase,
  selectedChain
}) {
  const [tabValue, setTabValue] = useState(0);
  const [tokenList, setTokenList] = useState(null)
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [amountToSend, setAmountToSend] = useState(null);
  const [sendToAddress, setSendToAddress] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [hash, setHash] = useState(null);

  const navigate = useNavigate();

  const getAccountTokens = async () => {
    setIsLoading(true)

    const res = await axios.get(`https://wallet.kcfcodingstudio.com/api/getTokens`, {
      params: {
        userAddress: wallet,
        chain: selectedChain
      }
    })

    const response = res.data;

    if (response.tokens.length > 0) setTokenList(response.tokens)
    setBalance(response.balance);
    setIsLoading(false);
  }

  const sendTransaction = async(to, amount) => {
    const chain = CHAINS_CONFIG[selectedChain];

    const provider = new ethers.JsonRpcProvider(chain.rpcUrl)

    const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;

    const wallet = new ethers.Wallet(privateKey, provider);

    const tx ={ 
      to: to,
      value: ethers.parseEther(amount.toString())
    }

    setProcessing(true);
    try{
      const transaction = await wallet.sendTransaction(tx);

      setHash(transaction.hash);
      const receipt = await transaction.wait();

      setHash(null);
      setProcessing(false);
      setAmountToSend(null);
      setSendToAddress(null);

      if(receipt.status === 1){
        getAccountTokens();
      }else {
        console.log("Failed")
      }

    }catch(er){
      setAmountToSend(null);
      setSeedPhrase(null);
    }
  }

  const logout = () => {
    setSeedPhrase(null);
    setWallet(null);
    setTokenList(null);
    setBalance(0);
    navigate('/');
  }

  const onTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  useEffect(() => {
    if (!wallet || !selectedChain) return;
    setTokenList(null);
    setBalance(0);
    getAccountTokens();
  }, []);

  useEffect(() => {
    if (!wallet) return;
    setTokenList(null);
    setBalance(0);
    getAccountTokens();
  }, [selectedChain])

  return (
    <div className='content'>
      <div className='logoutButton' onClick={logout}>
        <LogoutIcon />
      </div>
      <div className='walletName'>Wallet</div>
      <Tooltip title={wallet}>
        <div>
          {wallet.slice(0, 4)}...{wallet.slice(38)}
        </div>
      </Tooltip>
      <Divider
        flexItem
      />
      {isLoading ?
        <CircularProgress />
        :
        <div className='walletView'>
          <Tabs
            // className='walletView'
            centered
            value={tabValue}
            onChange={onTabChange}
          >
            <Tab label="Token" />
            <Tab label="Transfer" />
            {/* <Tab label="Firends" /> */}
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            {tokenList ? (
              <List disablePadding>
                {tokenList.map((token) => {
                  <ListItem disablePadding>
                    <ListItemAvatar>
                      <Avatar>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Photos" secondary="Jan 9, 2014" />
                    {/* <div>{
                    Number(token)
                  }</div> */}
                  </ListItem>
                })}
              </List>
            ) : (
              <span>You seem to not have any tokens yet</span>
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <h3>Native Balance</h3>
            <h1>
              {balance === 0 ? '0.0' : balance.toFixed(4)} {CHAINS_CONFIG[selectedChain].ticker}
            </h1>
            <div className='sendRow'>
              <TextField
                fullWidth
                label="To:"
                variant="outlined"
                value={sendToAddress}
                onChange={(e) => setSendToAddress(e.target.value)}
                placeholder='0x'
              />
            </div>
            <div className='sendRow'>
              <TextField
                fullWidth
                label="Amounts:"
                variant="outlined"
                value={amountToSend}
                onChange={(e) => setAmountToSend(e.target.value)}
                placeholder='0'
              />
            </div>
            <Button
              style={{
                width: "100%",
                marginTop: "20px",
                marginBottom: "20px"
              }}
              color="primary"
              variant="contained"
              onClick={() =>sendTransaction(sendToAddress, amountToSend)}
            >
              Send Tokens
            </Button>
            {processing && (
              <>
                <CircularProgress/>
                {hash && (
                  <Tooltip title={hash}>
                    <p>Hover For Tx Hash</p>
                  </Tooltip>
                )}
              </>
            )}
          </TabPanel>
        </div>
      }
    </div>
  )
}

export default WalletView