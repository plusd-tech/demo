const {
	attemptUnsuccessfulTransaction,
	getEventsForTransaction,
	normaliseBytes32,
} = require("./utils");

const PlusDConsignments = artifacts.require("./PlusDConsignments.sol");
const Consignment = artifacts.require("./Consignment.sol");

describe("PlusDConsignments", () => {
	const CONSIGNMENT_CREATED = 0x00;
	const CONSIGNEE_ASSIGNED = 0x01;
	const VERIFIER_ASSIGNED = 0x02;
	const REQUIREMENTS_VERIFIED = 0x03;
	const requirements = "explosive goods";

	describe("Given the owner has initialised the contract", () => {
		let plusDConsignments;

		before(async () => {
			plusDConsignments = await PlusDConsignments.deployed();
		});

		contract("Consignment creation", ([owner, consignor, consignee]) => {
			describe("Given a consignor has been registered with company registration number 'HRB 27814'", () => {
				const consignorCompanyRegistrationNumber = "HRB 27814";

				before(async () => {
					await plusDConsignments.registerConsignor(
						consignor,
						consignorCompanyRegistrationNumber,
					);
				});

				describe("When someone other than a consignor creates a consignment", () => {
					let error;

					before(async () => {
						error = await attemptUnsuccessfulTransaction(
							async () =>
								await plusDConsignments.createConsignment(requirements, {
									from: consignee,
								}),
						);
					});

					it("Then the transaction should not be successful", async () => {
						assert.match(error.message, /revert/);
					});
				});

				describe("When the consignor creates a consigment specifying the requirements 'explosive goods'", () => {
					let consignment;
					let eventsBefore;
					let eventsAfter;

					before(async () => {
						[eventsBefore, eventsAfter] = await getEventsForTransaction(
							async () => {
								await plusDConsignments.createConsignment(requirements, {
									from: consignor,
								});
								consignment = new Consignment(
									await plusDConsignments.consignments(consignor, 0),
								);
							},
							plusDConsignments.ConsignmentCreated,
						);
					});

					it("Then the consignment should be in state CONSIGNMENT_CREATED", async () => {
						assert.strictEqual(
							parseInt(await consignment.state(), 10),
							CONSIGNMENT_CREATED,
						);
					});

					it("Then the consignment should specify the consignor", async () => {
						assert.strictEqual(await consignment.consignor(), consignor);
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

		contract(
			"Consignee assignment",
			([owner, consignor, consignee, verifier]) => {
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

						describe('Given the consignor has created a consignment specifying the requirements "explosive goods"', () => {
							let consignment;

							before(async () => {
								await plusDConsignments.createConsignment(requirements, {
									from: consignor,
								});
								consignment = new Consignment(
									await plusDConsignments.consignments(consignor, 0),
								);
							});

							describe("When someone other than the consignor assigns a consignee", () => {
								let error;

								before(async () => {
									error = await attemptUnsuccessfulTransaction(
										async () =>
											await plusDConsignments.assignConsignee(
												consignment.address,
												consignee,
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

							describe("When the consignor assigns someone other than a registered consignee", () => {
								let error;

								before(async () => {
									error = await attemptUnsuccessfulTransaction(
										async () =>
											await plusDConsignments.assignConsignee(
												consignment.address,
												consignor,
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

							describe("When the consignor assigns the consignee", () => {
								before(async () => {
									await plusDConsignments.assignConsignee(
										consignment.address,
										consignee,
										{
											from: consignor,
										},
									);
								});

								it("Then the consignment should be in state CONSIGNEE_ASSIGNED", async () => {
									assert.strictEqual(
										parseInt(await consignment.state(), 10),
										CONSIGNEE_ASSIGNED,
									);
								});

								it("Then the consignment should specify the consignee", async () => {
									assert.strictEqual(await consignment.consignee(), consignee);
								});
							});
						});
					});
				});
			},
		);

		contract(
			"Verifier assignment",
			([owner, consignor, consignee, verifier]) => {
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

						describe("Given a verifier has been registered with company registration number 'HRB 30011'", () => {
							const verifierCompanyRegistrationNumber = "HRB 30011";

							before(async () => {
								await plusDConsignments.registerVerifier(
									verifier,
									verifierCompanyRegistrationNumber,
								);
							});

							describe('Given the consignor has created a consignment specifying the requirements "explosive goods"', () => {
								let consignment;

								before(async () => {
									await plusDConsignments.createConsignment(requirements, {
										from: consignor,
									});
									consignment = new Consignment(
										await plusDConsignments.consignments(consignor, 0),
									);
								});

								describe("Given the consignor has assigned the consignee", () => {
									before(async () => {
										await plusDConsignments.assignConsignee(
											consignment.address,
											consignee,
											{ from: consignor },
										);
									});

									describe("When someone other than the consignee assigns a verifier", () => {
										let error;

										before(async () => {
											error = await attemptUnsuccessfulTransaction(
												async () =>
													await plusDConsignments.assignVerifier(
														consignment.address,
														verifier,
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

									describe("When the consignee assigns someone other than a registered verifier", () => {
										let error;

										before(async () => {
											error = await attemptUnsuccessfulTransaction(
												async () =>
													await plusDConsignments.assignVerifier(
														consignment.address,
														consignee,
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

									describe("When the consignee assigns the verifier", () => {
										before(async () => {
											await plusDConsignments.assignVerifier(
												consignment.address,
												verifier,
												{
													from: consignee,
												},
											);
										});

										it("Then the consignment should be in state VERIFIER_ASSIGNED", async () => {
											assert.strictEqual(
												parseInt(await consignment.state(), 10),
												VERIFIER_ASSIGNED,
											);
										});

										it("Then the consignment should specify the verifier", async () => {
											assert.strictEqual(
												await consignment.verifier(),
												verifier,
											);
										});
									});
								});
							});
						});
					});
				});
			},
		);

		contract(
			"Requirements verification",
			([owner, consignor, consignee, verifier]) => {
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

						describe("Given a verifier has been registered with company registration number 'HRB 30011'", () => {
							const verifierCompanyRegistrationNumber = "HRB 30011";

							before(async () => {
								await plusDConsignments.registerVerifier(
									verifier,
									verifierCompanyRegistrationNumber,
								);
							});

							describe('Given the consignor has created a consignment specifying the requirements "explosive goods"', () => {
								let consignment;

								before(async () => {
									await plusDConsignments.createConsignment(requirements, {
										from: consignor,
									});
									consignment = new Consignment(
										await plusDConsignments.consignments(consignor, 0),
									);
								});

								describe("Given the consignor has assigned the consignee", () => {
									before(async () => {
										await plusDConsignments.assignConsignee(
											consignment.address,
											consignee,
											{ from: consignor },
										);
									});

									describe("Given the consignee has assigned the verifier", () => {
										before(async () => {
											await plusDConsignments.assignVerifier(
												consignment.address,
												verifier,
												{ from: consignee },
											);
										});

										describe("When someone other than the verifier verifies requirements", () => {
											let error;

											before(async () => {
												error = await attemptUnsuccessfulTransaction(
													async () =>
														await plusDConsignments.verifyRequirements(
															consignment.address,
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

										describe("When the verifier verifies requirements", () => {
											before(async () => {
												await plusDConsignments.verifyRequirements(
													consignment.address,
													{
														from: verifier,
													},
												);
											});

											it("Then the consignment should be in state REQUIREMENTS_VERIFIED", async () => {
												assert.strictEqual(
													parseInt(await consignment.state(), 10),
													REQUIREMENTS_VERIFIED,
												);
											});
										});
									});
								});
							});
						});
					});
				});
			},
		);
	});
});
