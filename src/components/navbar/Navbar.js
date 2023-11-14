import './Navbar.css';
import React, {useEffect, useState} from "react";
import { Route, Routes, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faNavicon } from '@fortawesome/free-solid-svg-icons';
//import { Button } from '@mui/material';
import { Button } from '../button/Button';


function Navbar() {

    const [activeNav, setActiveNav] = useState(false);
    const [enableButton, setEnableButton] = useState(true);

    const handleNav = () => {
        setActiveNav(!activeNav);
    }

    const closeMobileMenu = () => {
        setActiveNav(false);
    }

    const showButton = () => {
        if(window.innerWidth <= 960){
            setEnableButton(false);
        }else {
            setEnableButton(true);
        }
    }

    useEffect(() => {
        showButton();
    }, []);

    window.addEventListener('resize', showButton);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                    Logo
                </Link>
                <div className="menu-icon" onClick={handleNav}>
                    {activeNav ? 
                        <FontAwesomeIcon icon={faTimes}/>
                        : <FontAwesomeIcon icon={faNavicon}/>
                    }
                </div>
                <ul className={activeNav ? 'nav-menu active' : 'nav-menu'}>
                    <li className="nav-item">
                        <Link to='/dashboard' className="nav-links" onClick={closeMobileMenu}>
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/asset' className="nav-links" onClick={closeMobileMenu}>
                            Trade
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/friend' className="nav-links" onClick={closeMobileMenu}>
                            Friend
                        </Link>
                    </li>
                    <li>
                        <Button buttonStyle='btn--outline'>
                            Logout
                        </Button>
                    </li>                
                </ul>
                {enableButton && 
                    <Button buttonStyle='btn--outline'>
                        Logout
                    </Button>
                }
            </div>
        </nav>
    )
}

export default Navbar;