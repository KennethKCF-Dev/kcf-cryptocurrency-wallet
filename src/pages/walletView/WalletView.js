import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout';
import { Divider, List, ListItem, Tab, Tabs, ListItemAvatar, Avatar, ListItemText, CircularProgress, Button, TextField, Typography, ListItemButton, InputAdornment, IconButton } from '@mui/material';
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
  setEncryptedJson,
  setDisableChainSelector
}) {
  const [tabValue, setTabValue] = useState(0);
  const [tokenList, setTokenList] = useState(null)
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [amountToSend, setAmountToSend] = useState(null);
  const [sendToAddress, setSendToAddress] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [hash, setHash] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [gasFee, setGasFee] = useState(0);
  const [disable, setDisable] = useState(true);

  const navigate = useNavigate();

  const cryptoExplorer = (tx) => {
    window.open(CHAINS_CONFIG[selectedChain].explorer + tx, '_blank', 'rel=noopener noreferrer')
  }

  const getTx = (to, amount) => {
    setDisable(true)
    setDisableChainSelector(false)
    const validAddress = ethers.isAddress(to);

    if (!validAddress) {
      toast.error('Invalid Address.');
      return;
    }

    if (Number(amount) === 0) {
      return;
    }

    if (Number(amount) < 0) {
      toast.error('Invalid amount.');
      return;
    }

    if (Number(amount) > balance) {
      toast.error('Not enough balance.');
      return;
    }

    const tx = {
      to: to,
      value: ethers.parseEther(amount.toString())
    }

    setDisable(false)
    setDisableChainSelector(true)
    return tx
  }

  const getTxGasFee = async (to, amount) => {
    const tx = getTx(to, amount)
    if (!tx) return;

    const chain = CHAINS_CONFIG[selectedChain];
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl)
    const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;
    const wallet = new ethers.Wallet(privateKey, provider);

    try {
      const gasPrice = await wallet.estimateGas(tx);
      setGasFee(ethers.formatUnits(gasPrice, 'gwei'))
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
  }

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
      if (response.transactions.length > 0) setTransactions(response.transactions);
      setBalance(response.balance);
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setIsLoading(false);
    }
  }

  const sendTransaction = async (to, amount) => {
    const tx = getTx(to, amount)
    if (!tx) return;

    const chain = CHAINS_CONFIG[selectedChain];
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl)
    const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;
    const wallet = new ethers.Wallet(privateKey, provider);

    setProcessing(true);
    try {
      const transaction = await wallet.sendTransaction(tx);

      setHash(transaction.hash);
      const receipt = await transaction.wait();

      setHash(null);
      setAmountToSend(null);
      setSendToAddress(null);

      if (receipt.status === 1) {
        getAccountTokens();
      } else {
        console.log("Failed")
      }

    } catch (err) {
      toast.error(err.message)
      setAmountToSend(null);
      //setSeedPhrase(null);
      return;
    } finally {
      setProcessing(false);
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
        <CircularProgress style={{ margin: 'auto' }} />
        :
        <div className='walletView'>
          <Tabs
            centered
            value={tabValue}
            onChange={onTabChange}
          >
            <Tab label="Transfer" />
            <Tab label="Transactions" />
          </Tabs>
          <TabPanel value={tabValue} index={1}>
            {transactions ? (
              <List disablePadding>
                {transactions.map((transaction, index) => {
                  return (
                    <ListItem key={index} >
                      <ListItemButton
                        onClick={() => cryptoExplorer(transaction.hash)}
                      >
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
                      </ListItemButton>
                    </ListItem>
                  )
                })}
              </List>
            ) : (
              <span>You seem to not have any transactions yet</span>
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
                typeof='number'
                value={sendToAddress || undefined}
                onChange={(e) => setSendToAddress(e.target.value)}
                placeholder='0x'
              />
            </div>
            <div className='sendRow'>
              <TextField
                fullWidth
                label="Amounts:"
                variant="outlined"
                type='number'
                value={amountToSend || undefined}
                onChange={(e) => {
                  if (sendToAddress) {
                    getTxGasFee(sendToAddress, e.target.value)
                  }
                  setAmountToSend(e.target.value)
                }}
                placeholder='0'
              />
            </div>
            {!disable &&
        <>
          <h5>
            {"Gas (estimated): " + gasFee + CHAINS_CONFIG[selectedChain].ticker}
          </h5>
          <h5>
            {`Total: ${Number(amountToSend) + Number(gasFee)}${CHAINS_CONFIG[selectedChain].ticker}`}
          </h5>
        </>
      }
      {!processing ? (
        <Button
          style={{
            width: "100%",
            marginTop: "20px",
            marginBottom: "20px"
          }}
          disabled={disable}
          color="primary"
          variant="contained"
          onClick={() => sendTransaction(sendToAddress, amountToSend)}
        >
          Send Tokens
        </Button>
      ) : (
        <>
          <div style={{ margin: 'auto' }}>
            <CircularProgress />
          </div>
          {hash && (
            <Button
              style={{
                width: '10rem',
                marginTop: '1rem',
                marginBottom: '1rem',
                borderRadius: '5rem',
                backgroundColor: '#1976d2d4'
              }}
              color="primary"
              variant="contained"
              onClick={() => cryptoExplorer(hash)}
            >
              Tx Detail
            </Button>
          )}
        </>
      )}
    </TabPanel>
        </div >
      }
<p className='refreshButton' style={{ marginTop: "5rem" }} onClick={() => getAccountTokens()}>
  Refresh
</p>
    </div >
  )
}

export default WalletView