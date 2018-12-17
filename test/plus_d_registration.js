const {
	attemptUnsuccessfulTransaction,
	getEventsForTransaction,
	normaliseBytes32,
} = require("./utils");

const PlusDRegistration = artifacts.require("./PlusDRegistration.sol");

describe("PlusDRegistration", () => {
	contract("Initialise contract", ([owner]) => {
		describe("Given the owner has initialised the contract", () => {
			let plusDRegistration;

			before(async () => {
				plusDRegistration = await PlusDRegistration.deployed();
			});

			it("Then the owner should be specified", async () => {
				assert.strictEqual(await plusDRegistration.owner(), owner);
			});
		});
	});

	contract("Register consignor", ([owner, consignor]) => {
		describe("Given the owner has initialised the contract", () => {
			const companyRegistrationNumber = "HRB 27814";
			let plusDRegistration;

			before(async () => {
				plusDRegistration = await PlusDRegistration.deployed();
			});

			describe("When someone other than the owner registers a consignor", () => {
				let error;

				before(async () => {
					error = await attemptUnsuccessfulTransaction(
						async () =>
							await plusDRegistration.registerConsignor(
								consignor,
								companyRegistrationNumber,
								{
									from: consignor,
								},
							),
					);
				});

				it("Then the transaction should not be successful", async () => {
					assert.match(error.message, /revert/);
				});
			});

			describe("When the owner registers a consignor using its address and company registration number", () => {
				let eventsBefore;
				let eventsAfter;

				before(async () => {
					[eventsBefore, eventsAfter] = await getEventsForTransaction(
						async () =>
							await plusDRegistration.registerConsignor(
								consignor,
								companyRegistrationNumber,
							),
						plusDRegistration.ConsignorRegistered,
					);
				});

				it("Then the consignor should be registered with the company registration number", async () => {
					assert.strictEqual(
						await plusDRegistration.consignors(consignor),
						normaliseBytes32(companyRegistrationNumber),
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

	contract("Register consignee", ([owner, consignee]) => {
		describe("Given the owner has initialised the contract", () => {
			const companyRegistrationNumber = "HRB 27814";
			let plusDRegistration;

			before(async () => {
				plusDRegistration = await PlusDRegistration.deployed();
			});

			describe("When someone other than the owner registers a consignee", () => {
				let error;

				before(async () => {
					error = await attemptUnsuccessfulTransaction(
						async () =>
							await plusDRegistration.registerConsignee(
								consignee,
								companyRegistrationNumber,
								{
									from: consignee,
								},
							),
					);
				});

				it("Then the transaction should not be successful", async () => {
					assert.match(error.message, /revert/);
				});
			});

			describe("When the owner registers a consignee using its address and company registration number", () => {
				let eventsBefore;
				let eventsAfter;

				before(async () => {
					[eventsBefore, eventsAfter] = await getEventsForTransaction(
						async () =>
							await plusDRegistration.registerConsignee(
								consignee,
								companyRegistrationNumber,
							),
						plusDRegistration.ConsigneeRegistered,
					);
				});

				it("Then the consignee should be registered with the company registration number", async () => {
					assert.strictEqual(
						await plusDRegistration.consignees(consignee),
						normaliseBytes32(companyRegistrationNumber),
					);
				});

				it("Then a CONSIGNEE_REGISTERED event should be emitted specifying the new consignee address and company registration number", async () => {
					assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
					const {
						consignee: eventConsignee,
						companyRegistrationNumber: eventCompanyRegistrationNumber,
					} = eventsAfter[eventsAfter.length - 1].args;
					assert.strictEqual(eventConsignee, consignee);
					assert.strictEqual(
						eventCompanyRegistrationNumber,
						normaliseBytes32(companyRegistrationNumber),
					);
				});
			});
		});
	});

	contract("Register verifier", ([owner, verifier]) => {
		describe("Given the owner has initialised the contract", () => {
			const companyRegistrationNumber = "HRB 27814";
			let plusDRegistration;

			before(async () => {
				plusDRegistration = await PlusDRegistration.deployed();
			});

			describe("When someone other than the owner registers a verifier", () => {
				let error;

				before(async () => {
					error = await attemptUnsuccessfulTransaction(
						async () =>
							await plusDRegistration.registerVerifier(
								verifier,
								companyRegistrationNumber,
								{
									from: verifier,
								},
							),
					);
				});

				it("Then the transaction should not be successful", async () => {
					assert.match(error.message, /revert/);
				});
			});

			describe("When the owner registers a verifier using its address and company registration number", () => {
				let eventsBefore;
				let eventsAfter;

				before(async () => {
					[eventsBefore, eventsAfter] = await getEventsForTransaction(
						async () =>
							await plusDRegistration.registerVerifier(
								verifier,
								companyRegistrationNumber,
							),
						plusDRegistration.VerifierRegistered,
					);
				});

				it("Then the verifier should be registered with the company registration number", async () => {
					assert.strictEqual(
						await plusDRegistration.verifiers(verifier),
						normaliseBytes32(companyRegistrationNumber),
					);
				});

				it("Then a VERIFIER_REGISTERED event should be emitted specifying the new consignee address and company registration number", async () => {
					assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
					const {
						verifier: eventVerifier,
						companyRegistrationNumber: eventCompanyRegistrationNumber,
					} = eventsAfter[eventsAfter.length - 1].args;
					assert.strictEqual(eventVerifier, verifier);
					assert.strictEqual(
						eventCompanyRegistrationNumber,
						normaliseBytes32(companyRegistrationNumber),
					);
				});
			});
		});
	});
});
