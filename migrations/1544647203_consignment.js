const Consignment = artifacts.require("./Consignment");

const insuranceRequirements = "explosive goods";

module.exports = async function(deployer, network, [_, consignor]) {
	await deployer.deploy(Consignment, consignor, insuranceRequirements);
};
