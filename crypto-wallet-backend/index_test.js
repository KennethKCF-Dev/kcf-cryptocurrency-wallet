// const express = require('express')
// const { Network, Alchemy } = require('alchemy-sdk')
// const app = express()
// const port = 7771

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

// const settings = {
//     apiKey: "rV9ASfmfvaVyaISkh9g1Pe8J3vHF-KGx",
//     network: Network.ETH_SEPOLIA,
// };

// const alchemy = new Alchemy(settings);

// // Get the latest block
// const latestBlock = alchemy.core.getBlockNumber();

// // Get all outbound transfers for a provided address
// // alchemy.core
// //     .getTokensForOwner('0xb7ac255F1faF3159A46922B9ecA9216Fbab0AE9E')
// //     .then(console.log);

// alchemy.core.getBalance('0xb7ac255F1faF3159A46922B9ecA9216Fbab0AE9E').then(console.log);