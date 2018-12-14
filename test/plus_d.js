const util = require("util");

const PlusD = artifacts.require("./PlusD.sol");
const Consignment = artifacts.require("./Consignment.sol");

const normaliseBytes32 = str =>
	web3.toHex(`${str}${Buffer.alloc(32 - str.length)}`);

describe("PlusD", () => {
	const CARRIER_ASSIGNED = 0x01;

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

	contract("Consignment creation", ([owner, consignor, carrier]) => {
		const consignorCompanyRegistrationNumber = "HRB 27814";
		const carrierCompanyRegistrationNumber = "HRB 28806";
		const requirements = "explosive goods";
		let plusD;

		before(async () => {
			plusD = await PlusD.deployed();
		});

		describe("Given a consignor has been registered with company registration number 'HRB 27814'", () => {
			before(async () => {
				await plusD.registerConsignor(
					consignor,
					consignorCompanyRegistrationNumber,
				);
			});

			describe("Given a carrier has been registered with company registration number 'HRB 28806'", () => {
				before(async () => {
					await plusD.registerCarrier(
						carrier,
						carrierCompanyRegistrationNumber,
					);
				});

				describe("When the consignor creates a consigment specifying the carrier and requirements 'explosive goods'", () => {
					let consignment;

					before(async () => {
						await plusD.createConsignment(carrier, requirements, {
							from: consignor,
						});
						consignment = new Consignment(
							await plusD.consignments(consignor, 0),
						);
					});

					it("Then the consignment should be in state CARRIER_ASSIGNED", async () => {
						assert.strictEqual(
							parseInt(await consignment.state(), 10),
							CARRIER_ASSIGNED,
						);
					});

					it("Then the consignment should specify the consignor", async () => {
						assert.strictEqual(await consignment.consignor(), consignor);
					});

					it("Then the consignment should specify the carrier", async () => {
						assert.strictEqual(await consignment.carrier(), carrier);
					});

					it("Then the consignment should specify the requirements", async () => {
						assert.strictEqual(
							await consignment.requirements(),
							normaliseBytes32(requirements),
						);
					});
				});
			});
		});
	});
});
