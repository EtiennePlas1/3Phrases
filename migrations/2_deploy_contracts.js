const TroisPhrases = artifacts.require("TroisPhrases");
const Sents = artifacts.require("Sents");

module.exports = function(deployer) {
  deployer.deploy(TroisPhrases);
  deployer.deploy(Sents);
};
