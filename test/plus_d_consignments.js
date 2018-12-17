const {
	attemptUnsuccessfulTransaction,
	getEventsForTransaction,
	normaliseBytes32,
} = require("./utils");

const PlusDConsignments = artifacts.require("./PlusDConsignments.sol");
const Consignment = artifacts.require("./Consignment.sol");

describe("PlusDConsignments", () => {
	const CONSIGNEE_ASSIGNED = 0x01;

	contract("Consignment creation", ([owner, consignor, consignee]) => {
		const requirements = "explosive goods";
		let plusDConsignments;

		before(async () => {
			plusDConsignments = await PlusDConsignments.deployed();
		});

		describe("Given a consignor has been registered with company registration number 'HRB 27814'", () => {
			const consignorCompanyRegistrationNumber = "HRB 27814";

			before(async () => {
				await plusDConsignments.registerConsignor(
					consignor,
					consignorCompanyRegistrationNumber,
				);
			});

			describe("Given a consignee has been registered with company registration number 'HRB 28806'", () => {
				const consigneeCompanyRegistrationNumber = "HRB 28806";

				before(async () => {
					await plusDConsignments.registerConsignee(
						consignee,
						consigneeCompanyRegistrationNumber,
					);
				});

				describe("When someone other than a consignor creates a consignment", () => {
					let error;

					before(async () => {
						error = await attemptUnsuccessfulTransaction(
							async () =>
								await plusDConsignments.createConsignment(
									consignee,
									requirements,
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

				describe("When the consignor creates a consignment specifying someone other than a registered consignee", () => {
					let error;

					before(async () => {
						error = await attemptUnsuccessfulTransaction(
							async () =>
								await plusDConsignments.createConsignment(
									consignor,
									requirements,
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

				describe("When the consignor creates a consigment specifying the consignee and requirements 'explosive goods'", () => {
					let consignment;
					let eventsBefore;
					let eventsAfter;

					before(async () => {
						[eventsBefore, eventsAfter] = await getEventsForTransaction(
							async () => {
								await plusDConsignments.createConsignment(
									consignee,
									requirements,
									{
										from: consignor,
									},
								);
								consignment = new Consignment(
									await plusDConsignments.consignments(consignor, 0),
								);
							},
							plusDConsignments.ConsignmentCreated,
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
