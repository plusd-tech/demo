const { getEventsForTransaction, normaliseBytes32 } = require("./utils");

const Consignment = artifacts.require("./Consignment.sol");

describe("Consignment", () => {
	const CONSIGNMENT_CREATED = 0x00;
	const CONSIGNEE_ASSIGNED = 0x01;
	const VERIFIER_ASSIGNED = 0x02;
	const REQUIREMENTS_VERIFIED = 0x03;
	const REQUIREMENTS_LENGTH = 32;
	const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

	describe('Given the contract has been initialised with the consignor and requirements "explosive goods"', () => {
		const requirements = "explosive goods";
		const normalisedRequirements = normaliseBytes32(requirements);
		let consignment;

		before(async () => {
			consignment = await Consignment.deployed();
		});

		contract("CONSIGNMENT_CREATED", ([owner, consignor, consignee]) => {
			it("Then the contract should be in state CONSIGNMENT_CREATED", async () => {
				assert.strictEqual(
					parseInt(await consignment.state(), 10),
					CONSIGNMENT_CREATED,
				);
			});

			it("Then the consignor should be specified", async () => {
				assert.strictEqual(await consignment.consignor(), consignor);
			});

			it("Then the consignee should not be specified", async () => {
				assert.strictEqual(await consignment.consignee(), ZERO_ADDRESS);
			});

			it("Then the verifier should not be specified", async () => {
				assert.strictEqual(await consignment.verifier(), ZERO_ADDRESS);
			});

			it("Then the requirements should be specified", async () => {
				assert.strictEqual(
					await consignment.requirements(),
					web3.toHex(normalisedRequirements),
				);
			});
		});

		contract(
			"CONSIGNMENT_CREATED => CONSIGNEE_ASSIGNED",
			([owner, consignor, consignee, verifier]) => {
				describe("When the owner assigns a consignee", () => {
					let eventsBefore;
					let eventsAfter;

					before(async () => {
						[eventsBefore, eventsAfter] = await getEventsForTransaction(
							async () =>
								await consignment.assignConsignee(consignee, {
									from: owner,
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

					it("Then the consignee should be specified", async () => {
						assert.strictEqual(await consignment.consignee(), consignee);
					});

					it("Then a CONSIGNEE_ASSIGNED event should be emitted specifying the consignee", async () => {
						assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
						const eventConsignee =
							eventsAfter[eventsAfter.length - 1].args.consignee;
						assert.strictEqual(eventConsignee, consignee);
					});
				});
			},
		);

		contract(
			"CONSIGNEE_ASSIGNED => CONSIGNEE_ASSIGNED",
			([owner, consignor, consignee, verifier, consigneeAlternative]) => {
				describe("Given the owner has assigned a consignee", () => {
					before(async () => {
						await consignment.assignConsignee(consigneeAlternative, {
							from: owner,
						});
					});

					describe("When the owner assigns a new consignee", () => {
						let eventsBefore;
						let eventsAfter;

						before(async () => {
							[eventsBefore, eventsAfter] = await getEventsForTransaction(
								async () =>
									await consignment.assignConsignee(consigneeAlternative, {
										from: owner,
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
			([owner, consignor, consignee, verifier, consigneeAlternative]) => {
				describe("When the owner assigns the verifier", () => {
					let eventsBefore;
					let eventsAfter;

					before(async () => {
						[eventsBefore, eventsAfter] = await getEventsForTransaction(
							async () =>
								await consignment.assignVerifier(verifier, { from: owner }),
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

					it("Then a VERIFIER_ASSIGNED event should be emitted specifying the verifier", async () => {
						assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
						const eventVerifier =
							eventsAfter[eventsAfter.length - 1].args.verifier;
						assert.strictEqual(eventVerifier, verifier);
					});
				});
			},
		);

		contract(
			"VERIFIER_ASSIGNED => CONSIGNEE_ASSIGNED",
			([owner, consignor, consignee, verifier, consigneeAlternative]) => {
				describe("Given the owner has assigned the verifier", () => {
					before(async () => {
						await consignment.assignVerifier(verifier, {
							from: owner,
						});
					});

					describe("When the owner assigns a new consignee", () => {
						let eventsBefore;
						let eventsAfter;

						before(async () => {
							[eventsBefore, eventsAfter] = await getEventsForTransaction(
								async () =>
									await consignment.assignConsignee(consigneeAlternative, {
										from: owner,
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
			"VERIFIER_ASSIGNED => VERIFIER_ASSIGNED",
			([
				owner,
				consignor,
				consignee,
				verifier,
				consigneeAlternative,
				verifierAlternative,
			]) => {
				describe("Given the owner has assigned the verifier", () => {
					before(async () => {
						await consignment.assignVerifier(verifier, {
							from: owner,
						});
					});

					describe("When the owner assigns a new verifier", () => {
						let eventsBefore;
						let eventsAfter;

						before(async () => {
							[eventsBefore, eventsAfter] = await getEventsForTransaction(
								async () =>
									await consignment.assignVerifier(verifierAlternative, {
										from: owner,
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

						it("Then a VERIFIER_ASSIGNED event should be emitted specifying the new verifier", async () => {
							assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
							const eventVerifier =
								eventsAfter[eventsAfter.length - 1].args.verifier;
							assert.strictEqual(eventVerifier, verifierAlternative);
						});
					});
				});
			},
		);

		contract(
			"VERIFIER_ASSIGNED => REQUIREMENTS_VERIFIED",
			([owner, consignor, consignee, verifier]) => {
				describe("Given the owner has assigned the verifier", () => {
					before(async () => {
						await consignment.assignVerifier(verifier, {
							from: owner,
						});
					});

					describe("When the owner verifies the requirements", () => {
						let eventsBefore;
						let eventsAfter;

						before(async () => {
							[eventsBefore, eventsAfter] = await getEventsForTransaction(
								async () =>
									await consignment.verifyRequirements({
										from: owner,
									}),
								consignment.RequirementsVerified,
							);
						});

						it("Then the contract should be in state REQUIREMENTS_VERIFIED", async () => {
							assert.strictEqual(
								parseInt(await consignment.state(), 10),
								REQUIREMENTS_VERIFIED,
							);
						});

						it("Then an REQUIREMENTS_VERIFIED event should be emitted", async () => {
							assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
						});
					});
				});
			},
		);

		contract(
			"REQUIREMENTS_VERIFIED => CONSIGNEE_ASSIGNED",
			([owner, consignor, consignee, verifier, consigneeAlternative]) => {
				describe("Given the owner has assigned the verifier", () => {
					before(async () => {
						await consignment.assignVerifier(verifier, {
							from: owner,
						});
					});

					describe("Given the owner has verified the requirements", () => {
						before(async () => {
							await consignment.verifyRequirements({
								from: owner,
							});
						});

						describe("When the owner assigns a new consignee", () => {
							let eventsBefore;
							let eventsAfter;

							before(async () => {
								[eventsBefore, eventsAfter] = await getEventsForTransaction(
									async () =>
										await consignment.assignConsignee(consigneeAlternative, {
											from: owner,
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
			},
		);

		contract(
			"REQUIREMENTS_VERIFIED => VERIFIER_ASSIGNED",
			([
				owner,
				consignor,
				consignee,
				verifier,
				consigneeAlternative,
				verifierAlternative,
			]) => {
				describe("Given the owner has assigned the verifier", () => {
					before(async () => {
						await consignment.assignVerifier(verifier, {
							from: owner,
						});
					});

					describe("Given the owner has verified the requirements", () => {
						before(async () => {
							await consignment.verifyRequirements({
								from: owner,
							});
						});

						describe("When the owner assigns a new verifier", () => {
							let eventsBefore;
							let eventsAfter;

							before(async () => {
								[eventsBefore, eventsAfter] = await getEventsForTransaction(
									async () =>
										await consignment.assignVerifier(verifierAlternative, {
											from: owner,
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

							it("Then a VERIFIER_ASSIGNED event should be emitted specifying the new verifier", async () => {
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
	});
});
