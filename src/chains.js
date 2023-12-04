const SepoliaEthereum = {
    hex: '0xaa36a7',
    name: 'Sepolia Ethereum',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/rV9ASfmfvaVyaISkh9g1Pe8J3vHF-KGx',
    ticker: "SETH",
    explorer: "https://sepolia.etherscan.io/tx/"
}

const GoerliEthereum = {
    hex: '0x5',
    name: 'Goerli Ethereum',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/rV9ASfmfvaVyaISkh9g1Pe8J3vHF-KGx',
    ticker: "GETH",
    explorer: "https://sepolia.etherscan.io/tx/"
}

const PolygonMumbai = {
    hex: '0x13881',
    name: 'Polygon Mumbai',
    rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/-jLNlIvTXZ9CCSHG3z5vB9N924QcEEKV',
    ticker: "MMATIC",
    explorer: "https://mumbai.polygonscan.com/tx/"
}

export const CHAINS_CONFIG = {
    "0xaa36a7": SepoliaEthereum,
    "0x5": GoerliEthereum,
    "0x13881": PolygonMumbai
}