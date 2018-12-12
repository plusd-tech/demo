const ProofOfInsurance = artifacts.require('./ProofOfInsurance');

const insuranceRequirements = "explosive goods";

module.exports = async function(deployer, _, accounts) {
	await deployer.deploy(ProofOfInsurance, accounts[1], insuranceRequirements);
};
