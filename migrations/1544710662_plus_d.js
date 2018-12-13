const PlusD = artifacts.require("./PlusD");

module.exports = async function(deployer) {
	await deployer.deploy(PlusD);
};
