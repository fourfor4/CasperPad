import React, { Component } from 'react';

import aboutus from '../../assets/img/aboutus.png';

export default class AboutUs extends Component {
    render() {
        return (
            <div className="container aboutus">
                <h2 className="col-12 text-center font-weight-bold text-white hero-title">About Us</h2>
                <div className="row">
                    <div className="col-md-6 mx-3 mx-md-0 d-flex flex-column">
                        <p className="hero-description font-weight-bold mt-auto"><h3>Who We Are?</h3></p>
                        <p className="hero-description text-white font-weight-bold"><h4>We are the first key to the Casper Network Ecosystem. Once we unlock this door, projects can start launching on the Casper Network through our extensive IDO network.</h4></p>
                        <p className="hero-description">CasperPad will empower crypto currency projects with the ability to distribute tokens and raise liquidity.</p><br />

                        <p className="hero-description font-weight-bold"><h3>What We Do?</h3></p>
                        <p className="hero-description text-white font-weight-bold mb-auto"><h4>We will assist in Blockchain development, marketing, strategies, and listings. Launching through CasperPad empowers your project and gives it high legitimacy if you pass our screening systems.</h4></p>
                    </div>
                    <div className="col-md-6 mx-3 mx-md-0 text-center rotation-container">
                        <section className="container round">
                            <section className="projects_about">
                                <section className="projects_about">
                                    <section className="round-card round-card_about">
                                        <div className="round-card-header"> <h6 className="text-tertiary"> Officially <br/>Endorsed <br/>Launchpad</h6> </div>
                                        <p className="hero-description mb-3">We will be the first Launchpad that is endorsed by its own Blockchain.</p>
                                        <hr />
                                    </section>
                                    <section className="round-card">
                                        <div className="round-card-header"> <h6 className="text-tertiary"> Strict <br/>Launch <br/>System</h6> </div>
                                        <p className="hero-description mb-3">We go through each application in detail to understand their needs and if they apply to our community wants.</p>
                                        <hr />
                                    </section>
                                </section>
                                <section className="projects_about d-flex">
                                    <section className="round-card mt-auto mb-auto">
                                        <div className="round-card-header"> <h6 className="text-tertiary"> Fair <br/>Allocation <br/>System</h6> </div>
                                        <p className="hero-description mb-3">We believe in decentralization and understand that there are investors with different needs.</p>
                                        <hr />
                                    </section>
                                </section>
                            </section>

                            
                        </section>
                        {/* <div className="rotation"></div> */}
                        {/* <img src={aboutus} alt="about us" /> */}
                    </div>
                </div>
            </div >
        );
    }
}
