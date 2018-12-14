const util = require("util");

const Consignment = artifacts.require("./Consignment.sol");

describe("Consignment", () => {
	const UNINITIALISED = 0x00;
	const CARRIER_ASSIGNED = 0x01;
	const INSURER_ASSIGNED = 0x02;
	const INSURANCE_VERIFIED = 0x03;
	const REQUIREMENTS_LENGTH = 32;
	const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

	contract("UNINITIALISED => CARRIER_ASSIGNED", ([_, consignor, carrier]) => {
		describe('Given the contract has been initialised with the consignor, the carrier and insurance requirements "explosive goods"', () => {
			const requirements = "explosive goods";
			const normalisedRequirements = `${requirements}${Buffer.alloc(
				REQUIREMENTS_LENGTH - requirements.length,
			)}`;
			let consignment;

			before(async () => {
				consignment = await Consignment.deployed();
			});

			it("Then the contract should be in state CARRIER_ASSIGNED", async () => {
				assert.strictEqual(
					parseInt(await consignment.state(), 10),
					CARRIER_ASSIGNED,
				);
			});

			it("Then the consignor should be specified", async () => {
				assert.strictEqual(await consignment.consignor(), consignor);
			});

			it("Then the carrier should be specified", async () => {
				assert.strictEqual(await consignment.carrier(), carrier);
			});

			it("Then the insurer should not be specified", async () => {
				assert.strictEqual(await consignment.insurer(), ZERO_ADDRESS);
			});

			it("Then the insurance requirements should be specified", async () => {
				assert.strictEqual(
					await consignment.requirements(),
					web3.toHex(normalisedRequirements),
				);
			});
		});
	});

	contract(
		"CARRIER_ASSIGNED => CARRIER_ASSIGNED",
		([_, consignor, carrier, insurer, carrierAlternative]) => {
			describe('Given the consignor has initialised the contract with insurance requirements "explosive goods" and assigned the carrier', () => {
				let consignment;

				before(async () => {
					consignment = await Consignment.deployed();
				});

				describe("When someone other than the consignor assigns a new carrier", () => {
					let error;

					before(async () => {
						try {
							await consignment.assignCarrier(carrierAlternative, {
								from: carrierAlternative,
							});
						} catch (err) {
							error = err;
						}
					});

					it("Then the transaction should not be successful", async () => {
						assert.match(error.message, /revert/);
					});
				});

				describe("When the consignor assigns a new carrier", () => {
					let eventsBefore;
					let eventsAfter;

					before(async () => {
						const event = consignment.CarrierAssigned();
						const getEvents = util.promisify(event.get.bind(event));

						eventsBefore = await getEvents();
						await consignment.assignCarrier(carrierAlternative, {
							from: consignor,
						});
						eventsAfter = await getEvents();
					});

					it("Then the contract should be in state CARRIER_ASSIGNED", async () => {
						assert.strictEqual(
							parseInt(await consignment.state(), 10),
							CARRIER_ASSIGNED,
						);
					});

					it("Then the carrier should be updated", async () => {
						assert.strictEqual(await consignment.carrier(), carrierAlternative);
					});

					it("Then a CARRIER_ASSIGNED event should be emitted specifying the new carrier", async () => {
						assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
						const eventCarrier =
							eventsAfter[eventsAfter.length - 1].args.carrier;
						assert.strictEqual(eventCarrier, carrierAlternative);
					});
				});
			});
		},
	);

	contract(
		"CARRIER_ASSIGNED => INSURER_ASSIGNED",
		([_, consignor, carrier, insurer, carrierAlternative]) => {
			describe('Given the consignor has initialised the contract with insurance requirements "explosive goods" and assigned the carrier', () => {
				let consignment;

				before(async () => {
					consignment = await Consignment.deployed();
				});

				describe("When someone other than the carrier assigns an insurer", () => {
					let error;

					before(async () => {
						try {
							await consignment.assignInsurer(insurer, {
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

				describe("When the carrier assigns the insurer", () => {
					let eventsBefore;
					let eventsAfter;

					before(async () => {
						const event = consignment.InsurerAssigned();
						const getEvents = util.promisify(event.get.bind(event));

						eventsBefore = await getEvents();
						await consignment.assignInsurer(insurer, { from: carrier });
						eventsAfter = await getEvents();
					});

					it("Then the contract should be in state INSURER_ASSIGNED", async () => {
						assert.strictEqual(
							parseInt(await consignment.state(), 10),
							INSURER_ASSIGNED,
						);
					});

					it("Then the insurer should be specified", async () => {
						assert.strictEqual(await consignment.insurer(), insurer);
					});

					it("Then an INSURER_ASSIGNED event should be emitted specifying the insurer", async () => {
						assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
						const eventInsurer =
							eventsAfter[eventsAfter.length - 1].args.insurer;
						assert.strictEqual(eventInsurer, insurer);
					});
				});
			});
		},
	);

	contract(
		"INSURER_ASSIGNED => CARRIER_ASSIGNED",
		([_, consignor, carrier, insurer, carrierAlternative]) => {
			describe('Given the consignor has initialised the contract with insurance requirements "explosive goods" and assigned the carrier', () => {
				let consignment;

				before(async () => {
					consignment = await Consignment.deployed();
				});

				describe("Given the carrier has assigned the insurer", () => {
					before(async () => {
						await consignment.assignInsurer(insurer, {
							from: carrier,
						});
					});

					describe("When someone other than the consignor assigns a new carrier", () => {
						let error;

						before(async () => {
							try {
								await consignment.assignCarrier(carrierAlternative, {
									from: carrierAlternative,
								});
							} catch (err) {
								error = err;
							}
						});

						it("Then the transaction should not be successful", async () => {
							assert.match(error.message, /revert/);
						});
					});

					describe("When the consignor assigns a new carrier", () => {
						let eventsBefore;
						let eventsAfter;

						before(async () => {
							const event = consignment.CarrierAssigned();
							const getEvents = util.promisify(event.get.bind(event));

							eventsBefore = await getEvents();
							await consignment.assignCarrier(carrierAlternative, {
								from: consignor,
							});
							eventsAfter = await getEvents();
						});

						it("Then the contract should be in state CARRIER_ASSIGNED", async () => {
							assert.strictEqual(
								parseInt(await consignment.state(), 10),
								CARRIER_ASSIGNED,
							);
						});

						it("Then the carrier should be updated", async () => {
							assert.strictEqual(
								await consignment.carrier(),
								carrierAlternative,
							);
						});

						it("Then a CARRIER_ASSIGNED event should be emitted specifying the new carrier", async () => {
							assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
							const eventCarrier =
								eventsAfter[eventsAfter.length - 1].args.carrier;
							assert.strictEqual(eventCarrier, carrierAlternative);
						});
					});
				});
			});
		},
	);

	contract(
		"INSURER_ASSIGNED => INSURER_ASSIGNED",
		([
			_,
			consignor,
			carrier,
			insurer,
			carrierAlternative,
			insurerAlternative,
		]) => {
			describe('Given the consignor has initialised the contract with insurance requirements "explosive goods" and assigned the carrier', () => {
				let consignment;

				before(async () => {
					consignment = await Consignment.deployed();
				});

				describe("Given the carrier has assigned the insurer", () => {
					before(async () => {
						await consignment.assignInsurer(insurer, {
							from: carrier,
						});
					});

					describe("When someone other than the carrier assigns a new insurer", () => {
						let error;

						before(async () => {
							try {
								await consignment.assignInsurer(insurerAlternative, {
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

					describe("When the carrier assigns a new insurer", () => {
						let eventsBefore;
						let eventsAfter;

						before(async () => {
							const event = consignment.InsurerAssigned();
							const getEvents = util.promisify(event.get.bind(event));

							eventsBefore = await getEvents();
							await consignment.assignInsurer(insurerAlternative, {
								from: carrier,
							});
							eventsAfter = await getEvents();
						});

						it("Then the contract should be in state INSURER_ASSIGNED", async () => {
							assert.strictEqual(
								parseInt(await consignment.state(), 10),
								INSURER_ASSIGNED,
							);
						});

						it("Then the insurer should be reassigned", async () => {
							assert.strictEqual(
								await consignment.insurer(),
								insurerAlternative,
							);
						});

						it("Then an INSURER_ASSIGNED event should be emitted specifying the new insurer", async () => {
							assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
							const eventInsurer =
								eventsAfter[eventsAfter.length - 1].args.insurer;
							assert.strictEqual(eventInsurer, insurerAlternative);
						});
					});
				});
			});
		},
	);

	contract(
		"INSURER_ASSIGNED => INSURANCE_VERIFIED",
		([_, consignor, carrier, insurer]) => {
			describe('Given the consignor has initialised the contract with insurance requirements "explosive goods" and assigned the carrier', () => {
				let consignment;

				before(async () => {
					consignment = await Consignment.deployed();
				});

				describe("Given the carrier has assigned the insurer", () => {
					before(async () => {
						await consignment.assignInsurer(insurer, {
							from: carrier,
						});
					});

					describe("When someone other than the insurer verifies the insurance", () => {
						let error;

						before(async () => {
							try {
								await consignment.verifyInsurance({
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

					describe("When the insurer verifies insurance", () => {
						let eventsBefore;
						let eventsAfter;

						before(async () => {
							const event = consignment.InsuranceVerified();
							const getEvents = util.promisify(event.get.bind(event));

							eventsBefore = await getEvents();
							await consignment.verifyInsurance({
								from: insurer,
							});
							eventsAfter = await getEvents();
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
		"INSURANCE_VERIFIED => CARRIER_ASSIGNED",
		([_, consignor, carrier, insurer, carrierAlternative]) => {
			describe('Given the consignor has initialised the contract with insurance requirements "explosive goods" and assigned the carrier', () => {
				let consignment;

				before(async () => {
					consignment = await Consignment.deployed();
				});

				describe("Given the carrier has assigned the insurer", () => {
					before(async () => {
						await consignment.assignInsurer(insurer, {
							from: carrier,
						});
					});

					describe("Given the insurer has verified the insurance", () => {
						before(async () => {
							await consignment.verifyInsurance({
								from: insurer,
							});
						});

						describe("When someone other than the consignor assigns a new carrier", () => {
							let error;

							before(async () => {
								try {
									await consignment.assignCarrier(carrierAlternative, {
										from: carrierAlternative,
									});
								} catch (err) {
									error = err;
								}
							});

							it("Then the transaction should not be successful", async () => {
								assert.match(error.message, /revert/);
							});
						});

						describe("When the consignor assigns a new carrier", () => {
							let eventsBefore;
							let eventsAfter;

							before(async () => {
								const event = consignment.CarrierAssigned();
								const getEvents = util.promisify(event.get.bind(event));

								eventsBefore = await getEvents();
								await consignment.assignCarrier(carrierAlternative, {
									from: consignor,
								});
								eventsAfter = await getEvents();
							});

							it("Then the contract should be in state CARRIER_ASSIGNED", async () => {
								assert.strictEqual(
									parseInt(await consignment.state(), 10),
									CARRIER_ASSIGNED,
								);
							});

							it("Then the carrier should be updated", async () => {
								assert.strictEqual(
									await consignment.carrier(),
									carrierAlternative,
								);
							});

							it("Then the insurer should be unassigned", async () => {
								assert.strictEqual(await consignment.insurer(), ZERO_ADDRESS);
							});

							it("Then a CARRIER_ASSIGNED event should be emitted specifying the new carrier", async () => {
								assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
								const eventCarrier =
									eventsAfter[eventsAfter.length - 1].args.carrier;
								assert.strictEqual(eventCarrier, carrierAlternative);
							});
						});
					});
				});
			});
		},
	);

	contract(
		"INSURANCE_VERIFIED => INSURER_ASSIGNED",
		([
			_,
			consignor,
			carrier,
			insurer,
			carrierAlternative,
			insurerAlternative,
		]) => {
			describe('Given the consignor has initialised the contract with insurance requirements "explosive goods" and assigned the carrier', () => {
				let consignment;

				before(async () => {
					consignment = await Consignment.deployed();
				});

				describe("Given the carrier has assigned the insurer", () => {
					before(async () => {
						await consignment.assignInsurer(insurer, {
							from: carrier,
						});
					});

					describe("Given the insurer has verified the insurance", () => {
						before(async () => {
							await consignment.verifyInsurance({
								from: insurer,
							});
						});

						describe("When someone other than the carrier assigns a new insurer", () => {
							let error;

							before(async () => {
								try {
									await consignment.assignInsurer(insurerAlternative, {
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

						describe("When the carrier assigns a new insurer", () => {
							let eventsBefore;
							let eventsAfter;

							before(async () => {
								const event = consignment.InsurerAssigned();
								const getEvents = util.promisify(event.get.bind(event));

								eventsBefore = await getEvents();
								await consignment.assignInsurer(insurerAlternative, {
									from: carrier,
								});
								eventsAfter = await getEvents();
							});

							it("Then the contract should be in state INSURER_ASSIGNED", async () => {
								assert.strictEqual(
									parseInt(await consignment.state(), 10),
									INSURER_ASSIGNED,
								);
							});

							it("Then the insurer should be reassigned", async () => {
								assert.strictEqual(
									await consignment.insurer(),
									insurerAlternative,
								);
							});

							it("Then an INSURER_ASSIGNED event should be emitted specifying the new insurer", async () => {
								assert.strictEqual(eventsAfter.length, eventsBefore.length + 1);
								const eventInsurer =
									eventsAfter[eventsAfter.length - 1].args.insurer;
								assert.strictEqual(eventInsurer, insurerAlternative);
							});
						});
					});
				});
			});
		},
	);
});
