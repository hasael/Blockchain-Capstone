// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./SquareVerifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function (deployer) {
  let symbol = 'ELT';
  let name = 'El token';

  deployer.deploy(SquareVerifier)
    .then(verifierContract => {
      console.log('Verifier address' + verifierContract.address);
      return deployer.deploy(SolnSquareVerifier, name, symbol, verifierContract.address);
    });
};
