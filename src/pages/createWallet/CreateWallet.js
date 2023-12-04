import React, { useState } from 'react'
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import { Button, Card, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ethers } from "ethers";
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';

function CreateWallet({
    setSeedPhrase,
    setWallet,
    password
}) {

    const [newSeedPhrase, setNewSeedPhrase] = useState(null);

    const navigate = useNavigate();

    const generateWallet = () => {
        const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
        setNewSeedPhrase(mnemonic);
    }

    const setWaletAndMnemonic = async () => {
        setSeedPhrase(newSeedPhrase)
        const wallet = ethers.Wallet.fromPhrase(newSeedPhrase)

        try {
            const encryptedJson = await wallet.encrypt(password);

            localStorage.setItem("walletEncryptedJson", encryptedJson)
        } catch (err) {
            console.log('Failed')
        }


        setWallet(wallet.address)
        navigate('/wallet')
    }

    const copyToClipboard = () => {
        let copyText = newSeedPhrase;
        let isCopy = copy(copyText);
        if (isCopy) {
            toast.success("Copied to Clipboard");
        }
    };

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
                <CardActionArea
                    disabled={newSeedPhrase === null}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    onClick={copyToClipboard}
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
                </CardActionArea>
            </Card>
            {newSeedPhrase && <h5 style={{margin: '1rem auto'}}>Press to copy your key phrase</h5>}
            <Button
                className='frontPageButton signin'
                color='info'
                variant="outlined"
                disabled={!newSeedPhrase}
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