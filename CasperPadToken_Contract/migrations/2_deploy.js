const cspdToken = artifacts.require("CSPDToken");
const vesting = artifacts.require("Vesting");

module.exports = async function (deployer, network, addresses) {
  

  if(network === 'development') {
    await deployer.deploy(cspdToken);
    const tokenInstance = await cspdToken.deployed();
    await deployer.deploy(vesting, tokenInstance.address, '0xb298fff6bBC6356734333e797260FA56f14A0005');
    const vestingInstance = await vesting.deployed();
  } else {

  }
};
