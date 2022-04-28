import React, { Component } from 'react';

import aboutus from '../../assets/img/aboutus.png';

export default class Tokenomics extends Component {
    render() {
        return (
            <div className="container aboutus">
                <section className="container round">
                    <h2 className="col-12 text-center font-weight-bold text-white hero-title">Tokenomics</h2>

                    <section className="projects_tokenomics">
                        <section className="round-card_tokenomics">
                            <div className="round-card-header_tokenomics"> <h1> 5%</h1> </div>
                            <p className="hero-description mb-3">Airdrop</p>
                            <hr />
                        </section>
                        <section className="round-card_tokenomics">
                            <div className="round-card-header_tokenomics"> <h1>15%</h1> </div>
                            <p className="hero-description mb-3">Public Sale</p>
                            <hr />
                        </section>
                        <section className="round-card_tokenomics">
                            <div className="round-card-header_tokenomics"> <h1>20%</h1> </div>
                            <p className="hero-description mb-3">Private Sale</p>
                            <hr />
                        </section>
                        <section className="round-card_tokenomics">
                            <div className="round-card-header_tokenomics"> <h1>10%</h1> </div>
                            <p className="hero-description mb-3">Liqidity</p>
                            <hr />
                        </section>
                    </section>
                    <section className="projects">
                        <section className="round-card_tokenomics">
                            <div className="round-card-header_tokenomics"> <h1>20%</h1> </div>
                            <p className="hero-description mb-3">Team</p>
                            <hr />
                        </section>
                        <section className="round-card_tokenomics">
                            <div className="round-card-header_tokenomics"> <h1>10%</h1> </div>
                            <p className="hero-description mb-3">Advisory</p>
                            <hr />
                        </section>
                        <section className="round-card_tokenomics">
                            <div className="round-card-header_tokenomics"> <h1>20%</h1> </div>
                            <p className="hero-description mb-3">Staking</p>
                            <hr />
                        </section>
                    </section>
                </section>
            </div>
        );
    }
}
