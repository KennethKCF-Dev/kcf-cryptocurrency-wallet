import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout';
import { Divider, List, ListItem, Tab, Tabs, Tooltip, ListItemAvatar, Avatar, ListItemText, CircularProgress, Button, TextField, ListItemIcon, Typography } from '@mui/material';
import TabPanel from '../../components/tabPanel/TabPanel';
import axios from 'axios';
import { CHAINS_CONFIG } from '../../chains';
import { ethers } from 'ethers';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";

function WalletView({
  wallet,
  seedPhrase,
  setWallet,
  setSeedPhrase,
  selectedChain,
  setEncryptedJson
}) {
  const [tabValue, setTabValue] = useState(0);
  const [tokenList, setTokenList] = useState(null)
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [amountToSend, setAmountToSend] = useState(null);
  const [sendToAddress, setSendToAddress] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [hash, setHash] = useState(null);
  const [activity, setActivity] = useState(null);

  const navigate = useNavigate();

  const getAccountTokens = async () => {
    setIsLoading(true)

    try {
      const res = await axios.get(`https://wallet.kcfcodingstudio.com/api/getTokens`, {
        params: {
          userAddress: wallet,
          chain: selectedChain
        }
      })

      const response = res.data;

      if (response.tokens.length > 0) setTokenList(response.tokens)
      if (response.transactions.length > 0) setActivity(response.transactions);
      setBalance(response.balance);
      setIsLoading(false);
    } catch (err) {
      console.log(err)
    }
  }

  const sendTransaction = async (to, amount) => {
    const chain = CHAINS_CONFIG[selectedChain];

    const provider = new ethers.JsonRpcProvider(chain.rpcUrl)

    const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;

    const wallet = new ethers.Wallet(privateKey, provider);

    const tx = {
      to: to,
      value: ethers.parseEther(amount.toString())
    }

    setProcessing(true);
    try {
      const transaction = await wallet.sendTransaction(tx);

      setHash(transaction.hash);
      const receipt = await transaction.wait();

      setHash(null);
      setProcessing(false);
      setAmountToSend(null);
      setSendToAddress(null);

      if (receipt.status === 1) {
        getAccountTokens();
      } else {
        console.log("Failed")
      }

    } catch (er) {
      setAmountToSend(null);
      setSeedPhrase(null);
    }
  }

  const logout = () => {
    setEncryptedJson(null);
    setSeedPhrase(null);
    setWallet(null);
    setTokenList(null);
    setBalance(0);
    navigate('/');
  }

  const copyToClipboard = (copyText) => {
    let isCopy = copy(copyText);
    if (isCopy) {
      toast.success("Copied to Clipboard");
    }
  };

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
      <Button
        className='copyButton'
        color="primary"
        variant="contained"
        onClick={() => copyToClipboard(wallet)}
      >
        <div>
          {wallet.slice(0, 4)}...{wallet.slice(38)}
        </div>
        <ContentCopyIcon className='copyButtonIcon' />
      </Button>
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
            <Tab label="Transfer" />
            <Tab label="Activity" />
          </Tabs>
          <TabPanel value={tabValue} index={1}>
            {activity ? (
              <List disablePadding>
                {activity.map((transaction, index) => {
                  return (
                    <ListItem key={index} >
                      <ListItemAvatar>
                        <Avatar>
                          {transaction.from === wallet.toLowerCase() ? <CallMadeIcon /> : <CallReceivedIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          transaction.from === wallet.toLowerCase() ? `To: ${transaction.to.slice(0, 4)}...${transaction.to.slice(38)}` : `From: ${transaction.from.slice(0, 4)}...${transaction.from.slice(38)}`
                        }
                        secondary={
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {transaction.receiptStatus ? <p style={{ color: 'green', margin: 0 }}>Successed</p> : <p style={{ color: 'red' }}>Failed</p>}
                          </Typography>
                        }
                      />
                      <ListItemText
                        sx={{ textAlign: 'end' }}
                        primary={
                          transaction.value / (10 ** 18) + ' ' + CHAINS_CONFIG[transaction.chain].ticker
                        }
                        secondary={transaction.blockTimestamp.slice(4, 15)}
                      />
                    </ListItem>
                  )
                })}
              </List>
            ) : (
              <span>You seem to not have any activity yet</span>
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={0}>
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
              disabled={
                sendToAddress == null || amountToSend == null
              }
              color="primary"
              variant="contained"
              onClick={() => sendTransaction(sendToAddress, amountToSend)}
            >
              Send Tokens
            </Button>
            {processing && (
              <>
                <CircularProgress />
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
      <p className='refreshButton' style={{ marginTop: "5rem" }} onClick={() => getAccountTokens()}>
        Refresh
      </p>
    </div>
  )
}

export default WalletView