const {
	attemptUnsuccessfulTransaction,
	getEventsForTransaction,
	normaliseBytes32,
} = require("./utils");

const PlusD = artifacts.require("./PlusD.sol");

describe("PlusD", () => {
	contract("Consignment creation", ([owner, consignor, consignee]) => {
		const requirements = "explosive goods";
		let plusD;

		before(async () => {
			plusD = await PlusD.deployed();
		});

		it("Then the contract should be deployed", async () => {
			assert.ok(plusD);
		});
	});
});
