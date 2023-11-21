const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 7771;

app.use(cors());
app.use(express.json());

app.get("/getTokens", async (req, res) => {

  const { userAddress, chain } = req.query;

  const tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
    chain: chain,
    address: userAddress,
  });

  const balance = await Moralis.EvmApi.balance.getNativeBalance({
    chain: chain,
    address: userAddress
  });

  const jsonResponse = {
    tokens: tokens.raw,
    //nfts: myNfts,
    balance: balance.raw.balance / (10 ** 18)
  }

  console.log(jsonResponse)
  return res.status(200).json(jsonResponse);
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});