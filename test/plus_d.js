const {
	attemptUnsuccessfulTransaction,
	getEventsForTransaction,
	normaliseBytes32,
} = require("./utils");

const PlusD = artifacts.require("./PlusD.sol");
const Consignment = artifacts.require("./Consignment.sol");

describe("PlusD", () => {
	const CONSIGNEE_ASSIGNED = 0x01;

	contract("Initialise contract", ([owner]) => {
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
					error = await attemptUnsuccessfulTransaction(
						async () =>
							await plusD.registerConsignor(
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
							await plusD.registerConsignor(
								consignor,
								companyRegistrationNumber,
							),
						plusD.ConsignorRegistered,
					);
				});

				it("Then the consignor should be registered with the company registration number", async () => {
					assert.strictEqual(
						await plusD.consignors(consignor),
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
			let plusD;

			before(async () => {
				plusD = await PlusD.deployed();
			});

			describe("When someone other than the owner registers a consignee", () => {
				let error;

				before(async () => {
					error = await attemptUnsuccessfulTransaction(
						async () =>
							await plusD.registerConsignee(
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
							await plusD.registerConsignee(
								consignee,
								companyRegistrationNumber,
							),
						plusD.ConsigneeRegistered,
					);
				});

				it("Then the consignee should be registered with the company registration number", async () => {
					assert.strictEqual(
						await plusD.consignees(consignee),
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
			let plusD;

			before(async () => {
				plusD = await PlusD.deployed();
			});

			describe("When someone other than the owner registers a verifier", () => {
				let error;

				before(async () => {
					error = await attemptUnsuccessfulTransaction(
						async () =>
							await plusD.registerVerifier(
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
							await plusD.registerVerifier(verifier, companyRegistrationNumber),
						plusD.VerifierRegistered,
					);
				});

				it("Then the verifier should be registered with the company registration number", async () => {
					assert.strictEqual(
						await plusD.verifiers(verifier),
						normaliseBytes32(companyRegistrationNumber),
					);
				});

				it("Then an VERIFIER_REGISTERED event should be emitted specifying the new consignee address and company registration number", async () => {
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

	contract("Consignment creation", ([owner, consignor, consignee]) => {
		const requirements = "explosive goods";
		let plusD;

		before(async () => {
			plusD = await PlusD.deployed();
		});

		describe("Given a consignor has been registered with company registration number 'HRB 27814'", () => {
			const consignorCompanyRegistrationNumber = "HRB 27814";

			before(async () => {
				await plusD.registerConsignor(
					consignor,
					consignorCompanyRegistrationNumber,
				);
			});

			describe("Given a consignee has been registered with company registration number 'HRB 28806'", () => {
				const consigneeCompanyRegistrationNumber = "HRB 28806";

				before(async () => {
					await plusD.registerConsignee(
						consignee,
						consigneeCompanyRegistrationNumber,
					);
				});

				describe("When someone other than a consignor creates a consignment", () => {
					let error;

					before(async () => {
						error = await attemptUnsuccessfulTransaction(
							async () =>
								await plusD.createConsignment(consignee, requirements, {
									from: consignee,
								}),
						);
					});

					it("Then the transaction should not be successful", async () => {
						assert.match(error.message, /revert/);
					});
				});

				describe("When the consignor creates a consignment specifying someone other than a registered consignee", () => {
					let error;

					before(async () => {
						error = await attemptUnsuccessfulTransaction(
							async () =>
								await plusD.createConsignment(consignor, requirements, {
									from: consignor,
								}),
						);
					});

					it("Then the transaction should not be successful", async () => {
						assert.match(error.message, /revert/);
					});
				});

				describe("When the consignor creates a consigment specifying the consignee and requirements 'explosive goods'", () => {
					let consignment;
					let eventsBefore;
					let eventsAfter;

					before(async () => {
						[eventsBefore, eventsAfter] = await getEventsForTransaction(
							async () => {
								await plusD.createConsignment(consignee, requirements, {
									from: consignor,
								});
								consignment = new Consignment(
									await plusD.consignments(consignor, 0),
								);
							},
							plusD.ConsignmentCreated,
						);
					});

					it("Then the consignment should be in state CONSIGNEE_ASSIGNED", async () => {
						assert.strictEqual(
							parseInt(await consignment.state(), 10),
							CONSIGNEE_ASSIGNED,
						);
					});

					it("Then the consignment should specify the consignor", async () => {
						assert.strictEqual(await consignment.consignor(), consignor);
					});

					it("Then the consignment should specify the consignee", async () => {
						assert.strictEqual(await consignment.consignee(), consignee);
					});

					it("Then the consignment should specify the requirements", async () => {
						assert.strictEqual(
							await consignment.requirements(),
							normaliseBytes32(requirements),
						);
					});

					it("Then a CONSIGNMENT_CREATED event should be emitted specifying the consignor and ", async () => {
						assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
						const { consignment: eventConsignment } = eventsAfter[
							eventsAfter.length - 1
						].args;
						assert.strictEqual(eventConsignment, consignment.address);
					});
				});
			});
		});
	});
});
