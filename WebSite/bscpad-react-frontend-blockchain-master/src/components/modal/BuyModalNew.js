import React, { useState, useEffect, useRef } from 'react';
import { useEthers, useTokenBalance } from "@usedapp/core";
import Modal from 'react-bootstrap/Modal';
import { Toast, Form, Row, Col } from 'react-bootstrap';
import metamask from "../../assets/icons/metamask.svg";
import binance from "../../assets/icons/binance.png";
import { 
    cspdTokenAddress, 
    vestingContractAddress, 
    busdTokenAddress, 
    usdtTokenAddress, 
    whitelistOfTiers 
} from '../../contract_ABI/vestingDataNew';
import { 
    useGetTierOfAccount,
    useCspdContractMethod,
    useVestingContractMethod,
    useUsdtContractMethod,
    useBusdContractMethod
} from '../../util/interactNew';

const BuyModalNew = ({ isOpen, setIsOpen, onlyOneToast}) => {
    const unmounted = useRef(true);
    const [isOpenBuy, setIsOpenBuy] = useState(false);
    const [showToastBuy, setShowToastBuy] = useState(false);
    const [buyUsdAmount, setBuyUsdAmount] = useState();
    const [buyCspdAmount, setBuyCspdAmount] = useState(0);
    const [payCurrency, setPayCurrency] = useState(usdtTokenAddress);
    const [tier, setTier] = useState(0);
    const [toastTextBuy, setToastTextBuy] = useState('');
    const { account } = useEthers();
    // const busdBalance = Number(useTokenBalance(busdTokenAddress, account) / 10 ** 18).toFixed(3);
    let maxAmountOfTier = useGetTierOfAccount(account);
    console.log('maxAmountOfTier', maxAmountOfTier)
    useEffect( () => {
        setTier(maxAmountOfTier ? Number((maxAmountOfTier*0.008)).toFixed(3) : 0);
        setBuyUsdAmount(tier);
        return () => { unmounted.current = false }
    }, [maxAmountOfTier]);

    useEffect( () => {
        setBuyCspdAmount(Number(buyUsdAmount * 1000 / 8).toFixed(3));
        return () => { unmounted.current = false }
    }, [ buyUsdAmount]);

    const handleClose = () => {
        setIsOpen(false);
    }
    const handleCloseBuy = () => setIsOpenBuy(false);

    const { state: stateApproveUsdt, send: approveUsdt, events: getEventApproveUsdt } = useUsdtContractMethod("approve");
    const { state: stateApproveBusd, send: approveBusd, events: getEventApproveBusd } = useBusdContractMethod("approve");
    function handleApprove() {
        var tmp_tier = parseFloat(tier);
        var tmp_buyUsdAmount = parseFloat(buyUsdAmount);
        console.log('tier amount:', tmp_tier, typeof tmp_tier);
        console.log('approve amount:', tmp_buyUsdAmount, typeof tmp_buyUsdAmount);
        if(tmp_buyUsdAmount > tmp_tier){
            handleClose();
            setToastTextBuy("Your amount is more than your tier of whitelist!");
            setShowToastBuy(true);
        }else {
            let approveAmount = (buyUsdAmount * 10 ** 18).toString();
            console.log('payCurrency:', payCurrency);
            if(payCurrency == usdtTokenAddress){
                approveUsdt(vestingContractAddress, approveAmount);
            }else {
                approveBusd(vestingContractAddress, approveAmount);
            }        
            console.log('approve amount:', approveAmount);
        }

        
    }

    useEffect( () => {
        if(stateApproveUsdt.status == 'Success' || stateApproveBusd.status == 'Success'){
            console.log('stateApproveUsdt::', stateApproveUsdt);
            console.log('stateApproveBusd::', stateApproveBusd);
            handleClose();
            setIsOpenBuy(true);
        }
        return () => { unmounted.current = false }
    }, [ stateApproveUsdt, stateApproveBusd ]);

    function handleSwitchCurrency(currency) {
        console.log(currency);
        if(currency == 'usdt'){
            setPayCurrency(usdtTokenAddress);
        }else {
            setPayCurrency(busdTokenAddress);
        }
    }

    const { state: stateAddVest, send: addVest, events: getEventAddVest } = useVestingContractMethod("addVest");
    function handleBuy() {
        if(whitelistOfTiers[account])
            addVest(Math.round(buyCspdAmount), true, payCurrency);
        else
            console.log('invailid whitelist')    
    }

    useEffect( () => {
        if(stateAddVest.status == 'Success') {
            handleCloseBuy();
            setToastTextBuy("The vesting schedule was added successfully!");
            setShowToastBuy(true);
        }else if(stateAddVest.status == 'Exception') {
            handleCloseBuy();
            setToastTextBuy(stateAddVest.errorMessage);
            setShowToastBuy(true);
        }
        return () => { unmounted.current = false }
    }, [ stateAddVest ]);

    return (
      <>
        <Toast onClose={() => setShowToastBuy(false)} show={showToastBuy} delay={7000} autohide>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Notice</strong>
            <small className="mr-auto"></small>
          </Toast.Header>
          <Toast.Body>{ toastTextBuy }</Toast.Body>
        </Toast>
        <Modal show={isOpen} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Approve</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
              
          <div className="outer bg-black absolute top-0 left-0 h-full w-full z-20 opacity-80"></div>

            <div className="absolute top-0 left-0 h-full w-full z-30 flex items-center justify-center" onClick={() => handleClose()} >
                <div className="inner max-w-screen-sm flex-grow  text-white  bg-gradient-to-br from-yellow-200 to-yellow-700 p-1 opacity-100 rounded-3xl" onClick={ (e) => { e.stopPropagation(); }} >
                    {account && (
                        <>
                            <div data-bs-dismiss="modal" id="wallet-connect-metamask" className="c-list border-b px-3 py-2 d-flex align-items-center">
                                <div className="text-white m-auto"> The Buyable Maximum Amount Of Your Tier Is ${tier}! <br/>(Note: You can insert the token to the vesting schedule with only one buying.)</div>
                            </div>
                            <div data-bs-dismiss="modal" id="wallet-connect-metamask" className="c-list border-b px-3 py-2 d-flex align-items-center">
                                <div className="text-white m-auto"> 
                                    <Form>
                                        <Form.Check
                                            inline
                                            defaultChecked={payCurrency == usdtTokenAddress ? true : false}
                                            label="USDT"
                                            name="group1"
                                            type="radio"
                                            id="inline-radio-1"
                                            onClick={() => handleSwitchCurrency('usdt')}
                                        />
                                        <Form.Check
                                            inline
                                            defaultChecked={payCurrency == busdTokenAddress ? true : false}
                                            label="BUSD"
                                            name="group1"
                                            type="radio"
                                            id="inline-radio-2"
                                            onClick={() => handleSwitchCurrency('busd')}
                                        />
                                    </Form>
                                </div>
                                <div>
                                    <input className='form-control' type="number" step="0.01" max={ tier }  value={ buyUsdAmount } onChange={e => setBuyUsdAmount(e.target.value)} />
                                </div>
                            </div>
                            <div data-bs-dismiss="modal" id="wallet-connect-metamask" className="c-list border-b px-3 py-2 d-flex align-items-center">
                                <div className="text-white m-auto"> CSPD</div>
                                <div>
                                    <input className='form-control' type="text" value={ buyCspdAmount } disabled/>
                                </div>
                            </div>
                            <div data-bs-dismiss="modal" id="wallet-connect-metamask" className="c-list border-b px-3 py-2 d-flex align-items-center cursor-pointer">
                                <button className="btn btn-wallet wallet-connected m-auto" onClick={ handleClose }> Cancel </button>
                                <button className="btn btn-wallet wallet-connected m-auto" onClick={ handleApprove }> Enable</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal show={isOpenBuy} onHide={handleCloseBuy}>
          <Modal.Header closeButton>
            <Modal.Title>Buy CSPD Token</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
              
          <div className="outer bg-black absolute top-0 left-0 h-full w-full z-20 opacity-80"></div>

            <div className="absolute top-0 left-0 h-full w-full z-30 flex items-center justify-center" onClick={() => handleCloseBuy()} >
                <div className="inner max-w-screen-sm flex-grow  text-white  bg-gradient-to-br from-yellow-200 to-yellow-700 p-1 opacity-100 rounded-3xl" onClick={ (e) => { e.stopPropagation(); }} >
                    {account && (
                        <>
                            <div data-bs-dismiss="modal" id="wallet-connect-metamask" className="c-list border-b px-3 py-2 d-flex align-items-center">
                                <div className="text-white m-auto"> Approve Successfully! </div>
                            </div>
                            <div data-bs-dismiss="modal" id="wallet-connect-metamask" className="c-list border-b px-3 py-2 d-flex align-items-center">
                                <div className="text-white m-auto"> USD</div>
                                <div>
                                    <input className='form-control' type="number" value={ buyUsdAmount } disabled />
                                </div>
                            </div>
                            <div data-bs-dismiss="modal" id="wallet-connect-metamask" className="c-list border-b px-3 py-2 d-flex align-items-center">
                                <div className="text-white m-auto"> CSPD</div>
                                <div>
                                    <input className='form-control' type="text" value={ buyCspdAmount } disabled/>
                                </div>
                            </div>
                            <div data-bs-dismiss="modal" id="wallet-connect-metamask" className="c-list border-b px-3 py-2 d-flex align-items-center cursor-pointer">
                                <button className="btn btn-wallet wallet-connected m-auto" onClick={ handleBuy }> Buy </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
  
  export default BuyModalNew;