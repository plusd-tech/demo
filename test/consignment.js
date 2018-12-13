const Consignment = artifacts.require("./Consignment.sol");

describe("Consignment", () => {
	const CARRIER_ASSIGNED = 0x00;
	const INSURER_ASSIGNED = 0x01;
	const INSURANCE_VERIFIED = 0x02;
	const REQUIREMENTS_LENGTH = 32;

	contract("INIT => CARRIER_ASSIGNED", ([consignor, carrier]) => {
		describe('Given the consignor has initialised the contract with insurance requirements "explosive goods" and assigned the carrier', () => {
			const requirements = "explosive goods";
			const normalisedRequirements = `${requirements}${Buffer.alloc(
				REQUIREMENTS_LENGTH - requirements.length,
			)}`;
			let consignment;

			before(async () => {
				consignment = await Consignment.deployed();
			});

			it("Then the contract should be in state CARRIER_ASSIGNED", async () => {
				assert.equal(await consignment.state(), CARRIER_ASSIGNED);
			});

			it("Then the consignor should be specified", async () => {
				assert.equal(await consignment.consignor(), consignor);
			});

			it("Then the carrier should be specified", async () => {
				assert.equal(await consignment.carrier(), carrier);
			});

			it("Then the insurer should not be specified", async () => {
				assert.equal(await consignment.insurer(), 0);
			});

			it("Then the insurance requirements should be specified", async () => {
				assert.equal(
					await consignment.requirements(),
					web3.toHex(normalisedRequirements),
				);
			});
		});
	});

	contract(
		"CARRIER_ASSIGNED => CARRIER_ASSIGNED",
		([consignor, carrier, insurer, carrierAlternative]) => {
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
					before(async () => {
						await consignment.assignCarrier(carrierAlternative);
					});

					it("Then the contract should be in state CARRIER_ASSIGNED", async () => {
						assert.equal(await consignment.state(), CARRIER_ASSIGNED);
					});

					it("Then the carrier should be updated", async () => {
						assert.equal(await consignment.carrier(), carrierAlternative);
					});
				});
			});
		},
	);

	contract(
		"CARRIER_ASSIGNED => INSURER_ASSIGNED",
		([consignor, carrier, insurer, carrierAlternative]) => {
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
					before(async () => {
						await consignment.assignInsurer(insurer, {
							from: carrier,
						});
					});

					it("Then the contract should be in state INSURER_ASSIGNED", async () => {
						assert.equal(await consignment.state(), INSURER_ASSIGNED);
					});

					it("Then the insurer should be specified", async () => {
						assert.equal(await consignment.insurer(), insurer);
					});
				});
			});
		},
	);

	contract(
		"INSURER_ASSIGNED => CARRIER_ASSIGNED",
		([consignor, carrier, insurer, carrierAlternative]) => {
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
						before(async () => {
							await consignment.assignCarrier(carrierAlternative);
						});

						it("Then the contract should be in state CARRIER_ASSIGNED", async () => {
							assert.equal(await consignment.state(), CARRIER_ASSIGNED);
						});

						it("Then the carrier should be updated", async () => {
							assert.equal(await consignment.carrier(), carrierAlternative);
						});
					});
				});
			});
		},
	);

	contract(
		"INSURER_ASSIGNED => INSURER_ASSIGNED",
		([consignor, carrier, insurer, carrierAlternative, insurerAlternative]) => {
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
						before(async () => {
							await consignment.assignInsurer(insurerAlternative, {
								from: carrier,
							});
						});

						it("Then the contract should be in state INSURER_ASSIGNED", async () => {
							assert.equal(await consignment.state(), INSURER_ASSIGNED);
						});

						it("Then the insurer should be reassigned", async () => {
							assert.equal(await consignment.insurer(), insurerAlternative);
						});
					});
				});
			});
		},
	);

	contract(
		"INSURER_ASSIGNED => INSURANCE_VERIFIED",
		([consignor, carrier, insurer]) => {
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
						before(async () => {
							await consignment.verifyInsurance({
								from: insurer,
							});
						});

						it("Then the contract should be in state INSURANCE_VERIFIED", async () => {
							assert.equal(await consignment.state(), INSURANCE_VERIFIED);
						});
					});
				});
			});
		},
	);

	contract(
		"INSURANCE_VERIFIED => CARRIER_ASSIGNED",
		([consignor, carrier, insurer, carrierAlternative]) => {
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
							before(async () => {
								await consignment.assignCarrier(carrierAlternative);
							});

							it("Then the contract should be in state CARRIER_ASSIGNED", async () => {
								assert.equal(await consignment.state(), CARRIER_ASSIGNED);
							});

							it("Then the carrier should be updated", async () => {
								assert.equal(await consignment.carrier(), carrierAlternative);
							});

							it("Then the insurer should be unassigned", async () => {
								assert.equal(await consignment.insurer(), 0);
							});
						});
					});
				});
			});
		},
	);

	contract(
		"INSURANCE_VERIFIED => INSURER_ASSIGNED",
		([consignor, carrier, insurer, carrierAlternative, insurerAlternative]) => {
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
							before(async () => {
								await consignment.assignInsurer(insurerAlternative, {
									from: carrier,
								});
							});

							it("Then the contract should be in state INSURER_ASSIGNED", async () => {
								assert.equal(await consignment.state(), INSURER_ASSIGNED);
							});

							it("Then the insurer should be reassigned", async () => {
								assert.equal(await consignment.insurer(), insurerAlternative);
							});
						});
					});
				});
			});
		},
	);
});
