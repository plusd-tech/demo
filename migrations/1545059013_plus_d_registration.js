const PlusDRegistration = artifacts.require("./PlusDRegistration");

module.exports = async function(deployer) {
	await deployer.deploy(PlusDRegistration);
};
