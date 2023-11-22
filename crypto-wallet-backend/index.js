const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 7771;

app.use(cors());
app.use(express.json());

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
      //nfts: myNfts,
      balance: balance.raw.balance / (10 ** 18)
    }
  
    console.log(jsonResponse)
    return res.status(200).json(jsonResponse);
  }catch(err){
    console.log(err)
    return res.status(400).json(err);
  }
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});