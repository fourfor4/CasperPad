const CSPDToken = artifacts.require("CSPDToken");
const Vesting = artifacts.require("Vesting");

contract("Vesting test", async accounts => {
  it("should send coin correctly", async () => {
    await deployer.deploy(CSPDToken);
    const tokenInstance = await CSPDToken.deployed();
    await deployer.deploy(Vesting, tokenInstance.address, accounts[5]);
    const vestingInstance = await Vesting.deployed();

    console.log('tokenInstance', tokenInstance);
    console.log('vestingInstance', vestingInstance);
    // Get initial balances of first and second account.
    const adminAccount = accounts[0];
    const userAccount1 = accounts[1];
    const userAccount2 = accounts[1];
    const treasuryWallet = accounts[5];

    let balance = tokenInstance.balanceOf(adminAccount);
    console.log('balance of admin', balance);
    await tokenInstance.connect(adminAccount).transfer(vestingInstance.address, 50000000000000000000000000);
    await tokenInstance.connect(adminAccount).transfer(userAccount1, 800000000000000000);
    await tokenInstance.connect(adminAccount).transfer(userAccount2, 800000000000000000);

    await vestingInstance.setTierOfAccount(account1, 100);
    await vestingInstance.setTierOfAccount(account2, 100);

  });
});