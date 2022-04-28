import React, { useState, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';

import { SiWebpack, AiFillTwitterCircle, AiOutlineMedium, FaTelegramPlane, BsCircleFill } from 'react-icons/all';
import { ProgressBar } from 'react-bootstrap';
import { 
    useSoldAmount,
    useGetParticipants
} from '../../util/interactNew';
import { 
    whitelistOfTiers,
    preSaleAmount
} from '../../contract_ABI/vestingDataNew';

export default function CustomCardNew({ project }) {
    const unmounted = useRef(true);
    const [totalPresaleAmount, setTotalPresaleAmount] = useState(0);
    const [soldAmount, setSoldAmount] = useState(0);
    const [progressValue, setProgressValue] = useState(0);
    const [ participants ] = useGetParticipants();

    // let totalPresaleAmount_tmp = useBalanceOfVesting();
    const totalPresaleAmount_tmp = preSaleAmount * 10 ** 18;
    let soldAmount_tmp = useSoldAmount();

    function handleGoDetail(projectAddress){
        window.location = "/project/" + projectAddress;
    }

    useEffect( () => {
        setSoldAmount(soldAmount_tmp ? Number((soldAmount_tmp/10**18).toString()).toFixed(2) : 0);
        setTotalPresaleAmount(totalPresaleAmount_tmp ? Number((totalPresaleAmount_tmp/10**18).toString()).toFixed(2) : 0);
        setProgressValue(Number(soldAmount * 100 / totalPresaleAmount).toFixed(2));
        return () => { unmounted.current = false }
    }, [soldAmount_tmp, soldAmount, totalPresaleAmount, totalPresaleAmount_tmp]);

    return (
        <section className="custom-card cursor-pointer" onClick={ () => handleGoDetail(project.contractAddress) }>
            <div className="custom-card-header">
                <a href={"/project/" + project.contractAddress}><img className="tokenLogo" src={project.picture} alt="project profile"></img></a>
                <div className="custom-card-title">
                    <strong>{project.name + ' (' + 'Five Tiers' + ')'}</strong>
                    <div className="social-links">
                        <a href="https://Casper-pad.com"><SiWebpack className="social-link" /></a>
                        <a href="https://twitter.com/Casper_Pad"><AiFillTwitterCircle className="social-link" /></a>
                        <a href="https://casperpad.medium.com"><AiOutlineMedium className="social-link" /></a>
                        <a href=" https://t.me/CasperPadPublic"><FaTelegramPlane className="social-link" /></a>
                    </div>
                    <span className="status" style={{ backgroundColor: `${project.status === 'Coming' ? 'rgb(240 185 19 / 26%)' : project.status === 'Open' ? 'rgb(92 184 92 / 26%)' : 'rgb(255 0 0 / 25%)'}`, color: `${project.status === 'Coming' ? '#f1b90c' : project.status === 'Open' ? '#5cb85c' : 'red'}` }}>
                        <BsCircleFill style={{ fontSize: '.6rem', verticalAlign: 'middle' }} />
                        {project.status === 'Coming' ? ' Opens in TBA' : project.status === 'Open' ? ' Opened' : ' Closed'}
                    </span>
                    <div className="social-links">
                        <span className="status">USDT</span>
                        <span className="status">BUSD</span>
                    </div>
                </div>
            </div>
            <div className="custom-card-body">
                {project.message}
                <a href={"/project/" + project.contractAddress} style={{ color: '#6239f2', marginTop: '10px' }}>Learn more</a>
            </div>
            <div className="custom-card-footer">
                <div className="information">
                    <div>Token Price<br /><span>{project.swap_rate}</span></div>
                    <div>Cap<br /><span>{project.cap}</span></div>
                    <div>Access<br /><span>{project.access}</span></div>
                </div>
                <div className="custom-progress-bar">
                    <div className="progress-title">
                        <span>Progress</span>
                        <span>Participants <span style={{ color: 'white', fontWeight: 'bold' }}>{ Number(participants) }</span></span>
                    </div>
                    <ProgressBar now={progressValue} variant="pro" />
                    <div className="progress-title">
                        <span style={{ color: 'white', fontWeight: 'bold' }}>{progressValue}%</span>
                        <span style={{ color: 'white', fontWeight: 'bold' }}>{ soldAmount + '/' + totalPresaleAmount }</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

CustomCardNew.propTypes = {
    project: PropTypes.object.isRequired,
}
