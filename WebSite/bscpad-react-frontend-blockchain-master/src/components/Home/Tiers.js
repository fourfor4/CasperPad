import React, { Component } from 'react';

import allocation_system from '../../assets/img/allocation_system.png';

export default class Tiers extends Component {
    render() {
        return (
            <div className="container aboutus">
                <h2 className="col-12 text-center font-weight-bold text-white hero-title">Lottery & Guaranteed Tiers</h2>
                <div className="row">
                    <div className="col-md-6 mx-3 mx-md-0 text-center rotation-container">
                        
                        <div className="col-12 rotation"></div>
                        <h6 className="col-12 text-center font-weight-bold text-tertiary hero-title">CasperPad <br/>Allocation <br/>System</h6>
                        {/* <img src={allocation_system} alt="about us" /> */}
                    </div>
                    <div className="col-md-6 mx-3 mx-md-0 d-flex flex-column">
                        <p className="hero-description font-weight-bold mt-auto"><h3>There will be lottery, and guaranteed Tiers!</h3></p>
                        <p className="hero-description text-white font-weight-bold mb-auto"><h4>We are working on developing a hybrid model that will make the launch as decentralized as possible.</h4></p>
                    </div>
                </div>
            </div >
        );
    }
}
