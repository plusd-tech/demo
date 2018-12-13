const PlusD = artifacts.require("./PlusD.sol");

describe("PlusD", () => {
	contract("INIT", () => {
		it("should assert true", async () => {
			await PlusD.deployed();
			assert.isTrue(true);
		});
	});
});
