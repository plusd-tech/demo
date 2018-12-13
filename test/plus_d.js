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

	contract('Register consignor', ([owner, consignor]) => {
		describe('Given the owner has initialised the contract', () => {
			let plusD;

			before(async () => {
				plusD = await PlusD.deployed();
			});

			describe('When the owner registers a consignor using its address and company registration number', () => {
				const companyRegistrationNumber = '27814';

				before(async () => {
					await plusD.registerConsignor(consignor, companyRegistrationNumber);
				});

				it('Then the consignor should be registered under the company registration number', async () => {
					assert.strictEqual(await plusD.consignors(companyRegistrationNumber), consignor);
				});
			});
		});
	});
});
