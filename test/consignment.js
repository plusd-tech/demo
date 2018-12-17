const {
	attemptUnsuccessfulTransaction,
	getEventsForTransaction,
	normaliseBytes32,
} = require("./utils");

const Consignment = artifacts.require("./Consignment.sol");

describe("Consignment", () => {
	const UNINITIALISED = 0x00;
	const CONSIGNEE_ASSIGNED = 0x01;
	const VERIFIER_ASSIGNED = 0x02;
	const INSURANCE_VERIFIED = 0x03;
	const REQUIREMENTS_LENGTH = 32;
	const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

	contract(
		"UNINITIALISED => CONSIGNEE_ASSIGNED",
		([_, consignor, consignee]) => {
			describe('Given the contract has been initialised with the consignor, the consignee and insurance requirements "explosive goods"', () => {
				const requirements = "explosive goods";
				const normalisedRequirements = normaliseBytes32(requirements);
				let consignment;

				before(async () => {
					consignment = await Consignment.deployed();
				});

				it("Then the contract should be in state CONSIGNEE_ASSIGNED", async () => {
					assert.strictEqual(
						parseInt(await consignment.state(), 10),
						CONSIGNEE_ASSIGNED,
					);
				});

				it("Then the consignor should be specified", async () => {
					assert.strictEqual(await consignment.consignor(), consignor);
				});

				it("Then the consignee should be specified", async () => {
					assert.strictEqual(await consignment.consignee(), consignee);
				});

				it("Then the verifier should not be specified", async () => {
					assert.strictEqual(await consignment.verifier(), ZERO_ADDRESS);
				});

				it("Then the insurance requirements should be specified", async () => {
					assert.strictEqual(
						await consignment.requirements(),
						web3.toHex(normalisedRequirements),
					);
				});
			});
		},
	);

	contract(
		"CONSIGNEE_ASSIGNED => CONSIGNEE_ASSIGNED",
		([_, consignor, consignee, verifier, consigneeAlternative]) => {
			describe('Given the consignor has initialised the contract with insurance requirements "explosive goods" and assigned the consignee', () => {
				let consignment;

				before(async () => {
					consignment = await Consignment.deployed();
				});

				describe("When someone other than the consignor assigns a new consignee", () => {
					let error;

					before(async () => {
						error = await attemptUnsuccessfulTransaction(
							async () =>
								await consignment.assignConsignee(consigneeAlternative, {
									from: consigneeAlternative,
								}),
						);
					});

					it("Then the transaction should not be successful", async () => {
						assert.match(error.message, /revert/);
					});
				});

				describe("When the consignor assigns a new consignee", () => {
					let eventsBefore;
					let eventsAfter;

					before(async () => {
						[eventsBefore, eventsAfter] = await getEventsForTransaction(
							async () =>
								await consignment.assignConsignee(consigneeAlternative, {
									from: consignor,
								}),
							consignment.ConsigneeAssigned,
						);
					});

					it("Then the contract should be in state CONSIGNEE_ASSIGNED", async () => {
						assert.strictEqual(
							parseInt(await consignment.state(), 10),
							CONSIGNEE_ASSIGNED,
						);
					});

					it("Then the consignee should be updated", async () => {
						assert.strictEqual(
							await consignment.consignee(),
							consigneeAlternative,
						);
					});

					it("Then a CONSIGNEE_ASSIGNED event should be emitted specifying the new consignee", async () => {
						assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
						const eventConsignee =
							eventsAfter[eventsAfter.length - 1].args.consignee;
						assert.strictEqual(eventConsignee, consigneeAlternative);
					});
				});
			});
		},
	);

	contract(
		"CONSIGNEE_ASSIGNED => VERIFIER_ASSIGNED",
		([_, consignor, consignee, verifier, consigneeAlternative]) => {
			describe('Given the consignor has initialised the contract with insurance requirements "explosive goods" and assigned the consignee', () => {
				let consignment;

				before(async () => {
					consignment = await Consignment.deployed();
				});

				describe("When someone other than the consignee assigns an verifier", () => {
					let error;

					before(async () => {
						error = await attemptUnsuccessfulTransaction(
							async () =>
								await consignment.assignVerifier(verifier, {
									from: verifier,
								}),
						);
					});

					it("Then the transaction should not be successful", async () => {
						assert.match(error.message, /revert/);
					});
				});

				describe("When the consignee assigns the verifier", () => {
					let eventsBefore;
					let eventsAfter;

					before(async () => {
						[eventsBefore, eventsAfter] = await getEventsForTransaction(
							async () =>
								await consignment.assignVerifier(verifier, { from: consignee }),
							consignment.VerifierAssigned,
						);
					});

					it("Then the contract should be in state VERIFIER_ASSIGNED", async () => {
						assert.strictEqual(
							parseInt(await consignment.state(), 10),
							VERIFIER_ASSIGNED,
						);
					});

					it("Then the verifier should be specified", async () => {
						assert.strictEqual(await consignment.verifier(), verifier);
					});

					it("Then an VERIFIER_ASSIGNED event should be emitted specifying the verifier", async () => {
						assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
						const eventVerifier =
							eventsAfter[eventsAfter.length - 1].args.verifier;
						assert.strictEqual(eventVerifier, verifier);
					});
				});
			});
		},
	);

	contract(
		"VERIFIER_ASSIGNED => CONSIGNEE_ASSIGNED",
		([_, consignor, consignee, verifier, consigneeAlternative]) => {
			describe('Given the consignor has initialised the contract with insurance requirements "explosive goods" and assigned the consignee', () => {
				let consignment;

				before(async () => {
					consignment = await Consignment.deployed();
				});

				describe("Given the consignee has assigned the verifier", () => {
					before(async () => {
						await consignment.assignVerifier(verifier, {
							from: consignee,
						});
					});

					describe("When someone other than the consignor assigns a new consignee", () => {
						let error;

						before(async () => {
							error = await attemptUnsuccessfulTransaction(
								async () =>
									await consignment.assignConsignee(consigneeAlternative, {
										from: consigneeAlternative,
									}),
							);
						});

						it("Then the transaction should not be successful", async () => {
							assert.match(error.message, /revert/);
						});
					});

					describe("When the consignor assigns a new consignee", () => {
						let eventsBefore;
						let eventsAfter;

						before(async () => {
							[eventsBefore, eventsAfter] = await getEventsForTransaction(
								async () =>
									await consignment.assignConsignee(consigneeAlternative, {
										from: consignor,
									}),
								consignment.ConsigneeAssigned,
							);
						});

						it("Then the contract should be in state CONSIGNEE_ASSIGNED", async () => {
							assert.strictEqual(
								parseInt(await consignment.state(), 10),
								CONSIGNEE_ASSIGNED,
							);
						});

						it("Then the consignee should be updated", async () => {
							assert.strictEqual(
								await consignment.consignee(),
								consigneeAlternative,
							);
						});

						it("Then a CONSIGNEE_ASSIGNED event should be emitted specifying the new consignee", async () => {
							assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
							const eventConsignee =
								eventsAfter[eventsAfter.length - 1].args.consignee;
							assert.strictEqual(eventConsignee, consigneeAlternative);
						});
					});
				});
			});
		},
	);

	contract(
		"VERIFIER_ASSIGNED => VERIFIER_ASSIGNED",
		([
			_,
			consignor,
			consignee,
			verifier,
			consigneeAlternative,
			verifierAlternative,
		]) => {
			describe('Given the consignor has initialised the contract with insurance requirements "explosive goods" and assigned the consignee', () => {
				let consignment;

				before(async () => {
					consignment = await Consignment.deployed();
				});

				describe("Given the consignee has assigned the verifier", () => {
					before(async () => {
						await consignment.assignVerifier(verifier, {
							from: consignee,
						});
					});

					describe("When someone other than the consignee assigns a new verifier", () => {
						let error;

						before(async () => {
							error = await attemptUnsuccessfulTransaction(
								async () =>
									await consignment.assignVerifier(verifierAlternative, {
										from: verifier,
									}),
							);
						});

						it("Then the transaction should not be successful", async () => {
							assert.match(error.message, /revert/);
						});
					});

					describe("When the consignee assigns a new verifier", () => {
						let eventsBefore;
						let eventsAfter;

						before(async () => {
							[eventsBefore, eventsAfter] = await getEventsForTransaction(
								async () =>
									await consignment.assignVerifier(verifierAlternative, {
										from: consignee,
									}),
								consignment.VerifierAssigned,
							);
						});

						it("Then the contract should be in state VERIFIER_ASSIGNED", async () => {
							assert.strictEqual(
								parseInt(await consignment.state(), 10),
								VERIFIER_ASSIGNED,
							);
						});

						it("Then the verifier should be reassigned", async () => {
							assert.strictEqual(
								await consignment.verifier(),
								verifierAlternative,
							);
						});

						it("Then an VERIFIER_ASSIGNED event should be emitted specifying the new verifier", async () => {
							assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
							const eventVerifier =
								eventsAfter[eventsAfter.length - 1].args.verifier;
							assert.strictEqual(eventVerifier, verifierAlternative);
						});
					});
				});
			});
		},
	);

	contract(
		"VERIFIER_ASSIGNED => INSURANCE_VERIFIED",
		([_, consignor, consignee, verifier]) => {
			describe('Given the consignor has initialised the contract with insurance requirements "explosive goods" and assigned the consignee', () => {
				let consignment;

				before(async () => {
					consignment = await Consignment.deployed();
				});

				describe("Given the consignee has assigned the verifier", () => {
					before(async () => {
						await consignment.assignVerifier(verifier, {
							from: consignee,
						});
					});

					describe("When someone other than the verifier verifies the insurance", () => {
						let error;

						before(async () => {
							error = await attemptUnsuccessfulTransaction(
								async () =>
									await consignment.verifyInsurance({
										from: consignee,
									}),
							);
						});

						it("Then the transaction should not be successful", async () => {
							assert.match(error.message, /revert/);
						});
					});

					describe("When the verifier verifies insurance", () => {
						let eventsBefore;
						let eventsAfter;

						before(async () => {
							[eventsBefore, eventsAfter] = await getEventsForTransaction(
								async () =>
									await consignment.verifyInsurance({
										from: verifier,
									}),
								consignment.InsuranceVerified,
							);
						});

						it("Then the contract should be in state INSURANCE_VERIFIED", async () => {
							assert.strictEqual(
								parseInt(await consignment.state(), 10),
								INSURANCE_VERIFIED,
							);
						});

						it("Then an INSURANCE_VERIFIED event should be emitted", async () => {
							assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
						});
					});
				});
			});
		},
	);

	contract(
		"INSURANCE_VERIFIED => CONSIGNEE_ASSIGNED",
		([_, consignor, consignee, verifier, consigneeAlternative]) => {
			describe('Given the consignor has initialised the contract with insurance requirements "explosive goods" and assigned the consignee', () => {
				let consignment;

				before(async () => {
					consignment = await Consignment.deployed();
				});

				describe("Given the consignee has assigned the verifier", () => {
					before(async () => {
						await consignment.assignVerifier(verifier, {
							from: consignee,
						});
					});

					describe("Given the verifier has verified the insurance", () => {
						before(async () => {
							await consignment.verifyInsurance({
								from: verifier,
							});
						});

						describe("When someone other than the consignor assigns a new consignee", () => {
							let error;

							before(async () => {
								error = await attemptUnsuccessfulTransaction(
									async () =>
										await consignment.assignConsignee(consigneeAlternative, {
											from: consigneeAlternative,
										}),
								);
							});

							it("Then the transaction should not be successful", async () => {
								assert.match(error.message, /revert/);
							});
						});

						describe("When the consignor assigns a new consignee", () => {
							let eventsBefore;
							let eventsAfter;

							before(async () => {
								[eventsBefore, eventsAfter] = await getEventsForTransaction(
									async () =>
										await consignment.assignConsignee(consigneeAlternative, {
											from: consignor,
										}),
									consignment.ConsigneeAssigned,
								);
							});

							it("Then the contract should be in state CONSIGNEE_ASSIGNED", async () => {
								assert.strictEqual(
									parseInt(await consignment.state(), 10),
									CONSIGNEE_ASSIGNED,
								);
							});

							it("Then the consignee should be updated", async () => {
								assert.strictEqual(
									await consignment.consignee(),
									consigneeAlternative,
								);
							});

							it("Then the verifier should be unassigned", async () => {
								assert.strictEqual(await consignment.verifier(), ZERO_ADDRESS);
							});

							it("Then a CONSIGNEE_ASSIGNED event should be emitted specifying the new consignee", async () => {
								assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
								const eventConsignee =
									eventsAfter[eventsAfter.length - 1].args.consignee;
								assert.strictEqual(eventConsignee, consigneeAlternative);
							});
						});
					});
				});
			});
		},
	);

	contract(
		"INSURANCE_VERIFIED => VERIFIER_ASSIGNED",
		([
			_,
			consignor,
			consignee,
			verifier,
			consigneeAlternative,
			verifierAlternative,
		]) => {
			describe('Given the consignor has initialised the contract with insurance requirements "explosive goods" and assigned the consignee', () => {
				let consignment;

				before(async () => {
					consignment = await Consignment.deployed();
				});

				describe("Given the consignee has assigned the verifier", () => {
					before(async () => {
						await consignment.assignVerifier(verifier, {
							from: consignee,
						});
					});

					describe("Given the verifier has verified the insurance", () => {
						before(async () => {
							await consignment.verifyInsurance({
								from: verifier,
							});
						});

						describe("When someone other than the consignee assigns a new verifier", () => {
							let error;

							before(async () => {
								error = await attemptUnsuccessfulTransaction(
									async () =>
										await consignment.assignVerifier(verifierAlternative, {
											from: verifier,
										}),
								);
							});

							it("Then the transaction should not be successful", async () => {
								assert.match(error.message, /revert/);
							});
						});

						describe("When the consignee assigns a new verifier", () => {
							let eventsBefore;
							let eventsAfter;

							before(async () => {
								[eventsBefore, eventsAfter] = await getEventsForTransaction(
									async () =>
										await consignment.assignVerifier(verifierAlternative, {
											from: consignee,
										}),
									consignment.VerifierAssigned,
								);
							});

							it("Then the contract should be in state VERIFIER_ASSIGNED", async () => {
								assert.strictEqual(
									parseInt(await consignment.state(), 10),
									VERIFIER_ASSIGNED,
								);
							});

							it("Then the verifier should be reassigned", async () => {
								assert.strictEqual(
									await consignment.verifier(),
									verifierAlternative,
								);
							});

							it("Then an VERIFIER_ASSIGNED event should be emitted specifying the new verifier", async () => {
								assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
								const eventVerifier =
									eventsAfter[eventsAfter.length - 1].args.verifier;
								assert.strictEqual(eventVerifier, verifierAlternative);
							});
						});
					});
				});
			});
		},
	);
});
