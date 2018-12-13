const Consignment = artifacts.require("./Consignment");

const insuranceRequirements = "explosive goods";

module.exports = async function(deployer, _, [consignor, carrier]) {
	await deployer.deploy(Consignment, carrier, insuranceRequirements);
};
