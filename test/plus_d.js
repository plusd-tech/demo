const util = require("util");

const PlusD = artifacts.require("./PlusD.sol");

const normaliseBytes32 = str =>
	web3.toHex(`${str}${Buffer.alloc(32 - str.length)}`);

describe("PlusD", () => {
	contract("INIT", ([owner]) => {
		describe("Given the owner has initialised the contract", () => {
			let plusD;

			before(async () => {
				plusD = await PlusD.deployed();
			});

			it("Then the owner should be specified", async () => {
				assert.strictEqual(await plusD.owner(), owner);
			});
		});
	});

	contract("Register consignor", ([owner, consignor]) => {
		describe("Given the owner has initialised the contract", () => {
			const companyRegistrationNumber = "HRB 27814";
			let plusD;

			before(async () => {
				plusD = await PlusD.deployed();
			});

			describe("When someone other than the owner registers a consignor", () => {
				let error;

				before(async () => {
					try {
						await plusD.registerConsignor(
							consignor,
							companyRegistrationNumber,
							{
								from: consignor,
							},
						);
					} catch (err) {
						error = err;
					}
				});

				it("Then the transaction should not be successful", async () => {
					assert.match(error.message, /revert/);
				});
			});

			describe("When the owner registers a consignor using its address and company registration number", () => {
				let eventsBefore;
				let eventsAfter;

				before(async () => {
					const event = plusD.ConsignorRegistered();
					const getEvents = util.promisify(event.get.bind(event));

					eventsBefore = await getEvents();
					await plusD.registerConsignor(consignor, companyRegistrationNumber);
					eventsAfter = await getEvents();
				});

				it("Then the consignor should be registered under the company registration number", async () => {
					assert.strictEqual(
						await plusD.consignors(companyRegistrationNumber),
						consignor,
					);
				});

				it("Then a CONSIGNOR_REGISTERED event should be emitted specifying the new consignor address and company registration number", async () => {
					assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
					const {
						consignor: eventConsignor,
						companyRegistrationNumber: eventCompanyRegistrationNumber,
					} = eventsAfter[eventsAfter.length - 1].args;
					assert.strictEqual(eventConsignor, consignor);
					assert.strictEqual(
						eventCompanyRegistrationNumber,
						normaliseBytes32(companyRegistrationNumber),
					);
				});
			});
		});
	});

	contract("Register carrier", ([owner, carrier]) => {
		describe("Given the owner has initialised the contract", () => {
			const companyRegistrationNumber = "HRB 27814";
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

			describe("When the owner registers a carrier using its address and company registration number", () => {
				let eventsBefore;
				let eventsAfter;

				before(async () => {
					const event = plusD.CarrierRegistered();
					const getEvents = util.promisify(event.get.bind(event));

					eventsBefore = await getEvents();
					await plusD.registerCarrier(carrier, companyRegistrationNumber);
					eventsAfter = await getEvents();
				});

				it("Then the carrier should be registered under the company registration number", async () => {
					assert.strictEqual(
						await plusD.carriers(companyRegistrationNumber),
						carrier,
					);
				});

				it("Then a CARRIER_REGISTERED event should be emitted specifying the new carrier address and company registration number", async () => {
					assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
					const {
						carrier: eventCarrier,
						companyRegistrationNumber: eventCompanyRegistrationNumber,
					} = eventsAfter[eventsAfter.length - 1].args;
					assert.strictEqual(eventCarrier, carrier);
					assert.strictEqual(
						eventCompanyRegistrationNumber,
						normaliseBytes32(companyRegistrationNumber),
					);
				});
			});
		});
	});

	contract("Register insurer", ([owner, insurer]) => {
		describe("Given the owner has initialised the contract", () => {
			const companyRegistrationNumber = "HRB 27814";
			let plusD;

			before(async () => {
				plusD = await PlusD.deployed();
			});

			describe("When someone other than the owner registers a insurer", () => {
				let error;

				before(async () => {
					try {
						await plusD.registerInsurer(insurer, companyRegistrationNumber, {
							from: insurer,
						});
					} catch (err) {
						error = err;
					}
				});

				it("Then the transaction should not be successful", async () => {
					assert.match(error.message, /revert/);
				});
			});

			describe("When the owner registers a insurer using its address and company registration number", () => {
				let eventsBefore;
				let eventsAfter;

				before(async () => {
					const event = plusD.InsurerRegistered();
					const getEvents = util.promisify(event.get.bind(event));

					eventsBefore = await getEvents();
					await plusD.registerInsurer(insurer, companyRegistrationNumber);
					eventsAfter = await getEvents();
				});

				it("Then the insurer should be registered under the company registration number", async () => {
					assert.strictEqual(
						await plusD.insurers(companyRegistrationNumber),
						insurer,
					);
				});

				it("Then an INSURER_REGISTERED event should be emitted specifying the new carrier address and company registration number", async () => {
					assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
					const {
						insurer: eventInsurer,
						companyRegistrationNumber: eventCompanyRegistrationNumber,
					} = eventsAfter[eventsAfter.length - 1].args;
					assert.strictEqual(eventInsurer, insurer);
					assert.strictEqual(
						eventCompanyRegistrationNumber,
						normaliseBytes32(companyRegistrationNumber),
					);
				});
			});
		});
	});
});
