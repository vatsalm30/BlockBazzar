var Market = artifacts.require("./Market.sol");
var SaleTokens = artifacts.require("./SaleTokens.sol");

module.exports = function(deployer) {
  deployer.deploy(Market);
  deployer.deploy(SaleTokens);
};
