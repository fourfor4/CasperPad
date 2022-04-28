import React, { useState } from 'react';

import logo from '../assets/logo.png';
import { FaAlignJustify, ImStarEmpty, ImStarFull } from 'react-icons/all';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import MyModal from './modal/Modal';
import { useEthers, useTokenBalance } from "@usedapp/core";
import { cspdTokenAddress, busdTokenAddress } from '../contract_ABI/vestingData';

const Header =() => {
    const {account} = useEthers();
    const tokenBalance = useTokenBalance(cspdTokenAddress, account);

    const [isOpen, setIsOpen] = useState(false);
    const [star, setStar] = useState(true);

    function handleToggle(){
        setIsOpen(!isOpen);
    };

    function handleStar(){
        setStar(!star);
    }

    function connectWallet(){
        setIsOpen(true);
    }

    return (
        <>
        <section className="header">
            <nav className="navbar">
                <a className="cursor-pointer" href="https://www.casper-pad.com/">
                    <img src={logo} alt="logo"></img>
                    <span className='title'>CasperPad</span>
                </a>
                <div className="nav-center">
                    <ul className={isOpen ? "nav-links show-nav" : "nav-links"}>
                        {!account && (
                            <li className=" d-flex"><button className="btn btn-wallet wallet-default my-auto" onClick={connectWallet}> Connect Wallet </button></li>
                        ) || (
                            <li><button className="btn btn-wallet wallet-connected" onClick={connectWallet}> { String(account).substring(0, 6) + "..." + String(account).substring(38) + " : " + Number(tokenBalance/10**18).toFixed(5) + '  CSPD' } </button></li>
                        )}
                        <li><a  className="btn btn-wallet wallet-default my-auto" href="https://www.casper-pad.com/">Home</a></li>
                        {/* <li><Link to="/staking">Staking</Link></li> */}
                        {/* <li><Link to="/error">Error</Link></li> */}
                    </ul>
                    <ul className="nav-mobile">
                        <li>
                            <button type="button" className="nav-btn" onClick={handleToggle}><FaAlignJustify className="nav-icon" /></button>
                        </li>
                        {<li>{star ?
                            <button type="button" className="nav-btn" onClick={handleStar}>
                                <ImStarEmpty className="nav-icon" />
                            </button>
                            : <button type="button" className="nav-btn" onClick={handleStar}>
                                <ImStarFull className="nav-icon" />
                            </button>}
                        </li>}
                    </ul>
                </div>
            </nav>
            <MyModal isOpen = { isOpen } setIsOpen = {setIsOpen} onlyOneToast = {false}/>
        </section>
        </>
    );
}

export default Header;
