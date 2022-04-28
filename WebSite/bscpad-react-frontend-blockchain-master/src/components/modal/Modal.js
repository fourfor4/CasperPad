import React, { useState, useEffect, useRef } from 'react';
import { useEthers } from "@usedapp/core";
import Modal from 'react-bootstrap/Modal';
import { Toast } from 'react-bootstrap';
import metamask from "../../assets/icons/metamask.svg";
import binance from "../../assets/icons/binance.png";
import walletconnect_img from '../../assets/icons/walletconnect.png';
import {
  useWeb3React
} from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const trust = 'https://trustwallet.com/assets/images/media/assets/TWT.svg';

const MyModal = ({ isOpen, setIsOpen, onlyOneToast}) => {
  ///////////////////trust-wallet////////////////////////
  // const context = useWeb3React();
  const {
    connector,
    library,
    account: accountConnect,
    chainId: chainIdConnect,
    activate,
    active,
    error
  } = useWeb3React();
  ///////////////////end-trust-wallet////////////////////
    const unmounted = useRef(true);
    const [show, setShow] = useState(isOpen);
    const [showToast, setShowToast] = useState(false);
    const { activateBrowserWallet, deactivate, account, chainId } = useEthers();
    const handleClose = () => setIsOpen(false);
    const walletconnect = new WalletConnectConnector({
      rpc: { 56: "https://bsc-dataseed.binance.org/" },
      bridge: "https://bridge.walletconnect.org",
      qrcode: true,
      pollingInterval: 12000
    });

    useEffect( () => {
        console.log('accountConnect', accountConnect);
        if(accountConnect){ //trustwallet
          account = accountConnect;
          console.log('chainId', chainId);
        }
        if(chainIdConnect) //trustwallet
          chainId = chainIdConnect;
        
        if(account && !onlyOneToast && !(chainId == 56 || chainId == 97 || chainId == 1337)){
            setShowToast(true);
            deactivate();
        }
        return () => { unmounted.current = false }
    }, [accountConnect, chainId, chainIdConnect, active]);

    function handleConnectWalletMeta(){
        activateBrowserWallet();
        handleClose();
    }

    function handleConnectWalletTrust() {
      activate(walletconnect);
    }

    function handleDisconnectWallet(){
        deactivate();
        handleClose();
    }

    return (
      <>
        <Modal show={isOpen} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Connect Wallet</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
              
          <div className="outer bg-black absolute top-0 left-0 h-full w-full z-20 opacity-80"></div>

            <div className="absolute top-0 left-0 h-full w-full z-30 flex items-center justify-center" onClick={() => handleClose()} >
                <div className="inner max-w-screen-sm flex-grow  text-white  bg-gradient-to-br from-yellow-200 to-yellow-700 p-1 opacity-100 rounded-3xl" onClick={ (e) => { e.stopPropagation(); }} >
                    {account && (
                        <>
                            <div data-bs-dismiss="modal" id="wallet-connect-metamask" className="c-list border-b px-3 py-2 d-flex align-items-center">
                                <div className="text-white col-12 m-auto"> <span style={{wordBreak: 'break-all'}}>{account}</span></div>
                            </div>
                            <div data-bs-dismiss="modal" id="wallet-connect-metamask" className="c-list border-b px-3 py-2 d-flex align-items-center cursor-pointer">
                                <a href={"https://bscscan.com/address/" + account} target="_blank" className="text-white m-auto"> View on BSCScan </a>
                                <a className="text-white m-auto" onClick={ handleDisconnectWallet }> Disconnect</a>
                            </div>
                        </>
                    ) || (
                        <>
                            <div data-bs-dismiss="modal" id="wallet-connect-metamask" className="c-list border-b px-3 py-2 d-flex align-items-center cursor-pointer" onClick={ handleConnectWalletMeta }>
                                <div className="text-white mr-auto"> MetaMask</div>
                                <img src={metamask} width="30px" className="me-2" alt="casperpad" />
                            </div>
                            {/* <div data-bs-dismiss="modal" id="wallet-connect-binance chain wallet" className="c-list border-b px-3 py-2 d-flex align-items-center cursor-pointer" onClick={ handleConnectWalletMeta }>
                                <div className="text-white mr-auto"> Binance Chain Wallet</div>
                                <img src={binance} className="me-2" alt="casperpad" />
                            </div> */}
                            {/* <div data-bs-dismiss="modal" id="wallet-connect-binance chain wallet" className="c-list border-b px-3 py-2 d-flex align-items-center cursor-pointer" onClick={ handleConnectWalletTrust }>
                                <div className="text-white mr-auto"> Wallet Connect</div>
                                <img src={walletconnect_img} className="me-2 trustwallet" alt="casperpad" />
                            </div> */}
                        </>
                    )}
                </div>
            </div>
          </Modal.Body>
        </Modal>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={7000} autohide>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Notice</strong>
            <small className="mr-auto"></small>
          </Toast.Header>
          <Toast.Body>Your wallet must connect to the Binance Smart Chain!</Toast.Body>
        </Toast>
      </>
    );
  }
  
  export default MyModal;