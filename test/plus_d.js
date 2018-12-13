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
			const companyRegistrationNumber = '27814';
			let plusD;

			before(async () => {
				plusD = await PlusD.deployed();
			});

			describe("When someone other than the owner registers a consignor", () => {
				let error;

				before(async () => {
					try {
						await plusD.registerConsignor(consignor, companyRegistrationNumber, {
							from: consignor,
						});
					} catch (err) {
						error = err;
					}
				});

				it("Then the transaction should not be successful", async () => {
					assert.match(error.message, /revert/);
				});
			});

			describe('When the owner registers a consignor using its address and company registration number', () => {
				before(async () => {
					await plusD.registerConsignor(consignor, companyRegistrationNumber);
				});

				it('Then the consignor should be registered under the company registration number', async () => {
					assert.strictEqual(await plusD.consignors(companyRegistrationNumber), consignor);
				});
			});
		});
	});

	contract('Register carrier', ([owner, carrier]) => {
		describe('Given the owner has initialised the contract', () => {
			const companyRegistrationNumber = '27814';
			let plusD;

			before(async () => {
				plusD = await PlusD.deployed();
			});

			describe("When someone other than the owner registers a carrier", () => {
				let error;

				before(async () => {
					try {
						await plusD.registerCarrier(carrier, companyRegistrationNumber, {
							from: carrier,
						});
					} catch (err) {
						error = err;
					}
				});

				it("Then the transaction should not be successful", async () => {
					assert.match(error.message, /revert/);
				});
			});

			describe('When the owner registers a carrier using its address and company registration number', () => {
				before(async () => {
					await plusD.registerCarrier(carrier, companyRegistrationNumber);
				});

				it('Then the carrier should be registered under the company registration number', async () => {
					assert.strictEqual(await plusD.carriers(companyRegistrationNumber), carrier);
				});
			});
		});
	});
});
