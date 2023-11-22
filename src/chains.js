const SepoliaEthereum = {
    hex: '0xaa36a7',
    name: 'Sepolia Ethereum',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/rV9ASfmfvaVyaISkh9g1Pe8J3vHF-KGx',
    ticker: "SETH"
}

const GoerliEthereum = {
    hex: '0x5',
    name: 'Goerli Ethereum',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/rV9ASfmfvaVyaISkh9g1Pe8J3vHF-KGx',
    ticker: "GETH"
}

const PolygonMumbai = {
    hex: '0x80001',
    name: 'Polygon Mumbai',
    rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/-jLNlIvTXZ9CCSHG3z5vB9N924QcEEKV',
    ticker: "MMATIC"
}

export const CHAINS_CONFIG = {
    "0xaa36a7": SepoliaEthereum,
    "0x5": GoerliEthereum,
    "0x80001": PolygonMumbai
}