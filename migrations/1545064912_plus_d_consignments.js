const PlusDConsignments = artifacts.require("./PlusDConsignments");

module.exports = async function(deployer) {
	await deployer.deploy(PlusDConsignments);
};
