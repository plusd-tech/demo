const PlusD = artifacts.require("./PlusD.sol");

describe("PlusD", () => {
	contract("INIT", ([owner]) => {
		describe('Given the owner has initialised the contract', () => {
			let plusD;

			before(async () => {
				plusD = await PlusD.deployed();
			});

			it('Then the owner should be specified', async () => {
				assert.strictEqual(await plusD.owner(), owner);
			})
		});
	});
});
