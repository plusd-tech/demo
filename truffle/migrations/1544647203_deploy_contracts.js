const ProofOfInsurance = artifacts.require('./ProofOfInsurance');

const insuranceRequirements = "explosive goods";

module.exports = async function(deployer, _, [consignor, carrier]) {
	await deployer.deploy(ProofOfInsurance, carrier, insuranceRequirements);
};
