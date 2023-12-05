const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
const rateLimit = require('express-rate-limit')
require("dotenv").config();
const helmet = require('helmet')
const port = 7771;

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: 'Too many requests, please try again later!'
})

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use(helmet())
app.disable('x-powered-by')


app.use("/test", limiter);
app.get("/test", async (req, res) => {
  res.send('hello world')
})

app.use("/getTokens", limiter);
app.get("/getTokens", async (req, res) => {
  try{
    const { userAddress, chain } = req.query;

    const tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
      chain: chain,
      address: userAddress,
    });
  
    const transaction = await Moralis.EvmApi.transaction.getWalletTransactions({
      address: userAddress,
      chain: chain,
    });
  
    const balance = await Moralis.EvmApi.balance.getNativeBalance({
      chain: chain,
      address: userAddress
    });
  
    const jsonResponse = {
      tokens: tokens.raw,
      transactions: transaction.result,
      balance: balance.raw.balance / (10 ** 18)
    }
  
    console.log(jsonResponse)
    return res.status(200).json(jsonResponse);
  } catch (err) {
    console.log(err)
    return res.status(404).json(err.message);
  }
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});