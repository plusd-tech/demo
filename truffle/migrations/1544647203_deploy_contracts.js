const ProofOfInsurance = artifacts.require('./ProofOfInsurance');

module.exports = async function(deployer) {
	await deployer.deploy(ProofOfInsurance);
};
