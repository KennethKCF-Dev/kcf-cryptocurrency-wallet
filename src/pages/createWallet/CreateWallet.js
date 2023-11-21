import React, { useState } from 'react'
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import { Button, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ethers } from "ethers";

function CreateWallet({
    setSeedPhrase,setWallet
}) {

    const [newSeedPhrase, setNewSeedPhrase] = useState(null);

    const navigate = useNavigate();

    const generateWallet = () => {
        const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
        setNewSeedPhrase(mnemonic);
    }

    const setWaletAndMnemonic = () => {
        setSeedPhrase(newSeedPhrase)
        setWallet(ethers.Wallet.fromPhrase(newSeedPhrase).address)
        navigate('/wallet')
    }

    

    return (
        <div className='content'>
            <div className='mnemonic'>
                <GppMaybeOutlinedIcon />
                <div>
                    Once you generate the seed phrase, save it securely in order to
                    recover your wallet in the future.
                </div>

            </div>
            <Button
                className='frontPageButton'
                color='primary'
                variant="contained"
                onClick={() => generateWallet()}
            >
                Generate Seed Phrase
            </Button>
            <Card
                className='seedPhraseContainer'
                variant="outlined"
            >
                {newSeedPhrase && 
                    <pre 
                        style={{
                            whiteSpace: "pre-wrap",
                            fontSize: "1rem"
                        }}
                    >
                        {newSeedPhrase}
                    </pre>
                }
            </Card>
            <Button
                className='frontPageButton signin'
                color='info'
                variant="outlined"
                onClick={() => setWaletAndMnemonic()}
            >
                Create Your New Wallet
            </Button>
            <p className='frontPageBottom' onClick={() => navigate("/")}>
                Back Home
            </p>
        </div>
    )
}

export default CreateWallet