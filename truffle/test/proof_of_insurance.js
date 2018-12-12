const ProofOfInsurance = artifacts.require('./ProofOfInsurance.sol');

contract('ProofOfInsurance', function(accounts) {
	const [consignor, carrier, insurer, carrierAlternative] = accounts;
	let contract;

	describe('Given the consignor has initialised the contract with insurance requirements "explosive goods" and assigned the carrier', () => {
		beforeEach(async () => {
			contract = await ProofOfInsurance.deployed();
		});

		it('Then the contract should be in state "CARRIER_ASSIGNED"', async () => {
			assert.equal(await contract.state(), "CARRIER_ASSIGNED");
		});

		it('Then the consignor should be specified', async () => {
			assert.equal(await contract.consignor(), consignor);
		});

		it('Then the carrier should be specified', async () => {
			assert.equal(await contract.carrier(), carrier);
		});

		it('Then the insurer should not be specified', async () => {
			assert.equal(await contract.insurer(), 0);
		});

		it('Then the insurance requirements should be specified', async () => {
			assert.equal(await contract.requirements(), "explosive goods");
		});

		describe('When someone other than the consignor assigns a new carrier', () => {
			let result;

			beforeEach(async () => {
				result = contract.assignCarrier(carrierAlternative, {
					from: carrierAlternative,
				});
			});

			it('Then the carrier should not be reassigned', async () => {
				try {
					await result;
					assert.fail();
				} catch (error) {
					assert.match(error.message, /revert/);
					assert.equal(await contract.carrier(), carrier);
				}
			});
		});

		describe('When the consignor assigns a new carrier', () => {
			beforeEach(async () => {
				await contract.assignCarrier(carrierAlternative);
			});

			it('Then the contract should be in state "CARRIER_ASSIGNED"', async () => {
				assert.equal(await contract.state(), "CARRIER_ASSIGNED");
			});

			it('Then the carrier should be updated', async () => {
				assert.equal(await contract.carrier(), carrierAlternative);
			});
		});

		describe('When the carrier assigns the insurer', () => {
			beforeEach(async () => {
				await contract.assignInsurer(insurer);
			});

			it('Then the contract should be in state "INSURER_ASSIGNED"', async () => {
				assert.equal(await contract.state(), "INSURER_ASSIGNED");
			});

			it('Then the insurer should be specified', async () => {
				assert.equal(await contract.insurer(), insurer);
			});

			describe('When the consignor assigns a new carrier', () => {
				beforeEach(async () => {
					await contract.assignCarrier(carrierAlternative);
				});

				it('Then the contract should be in state "CARRIER_ASSIGNED"', async () => {
					assert.equal(await contract.state(), "CARRIER_ASSIGNED");
				});

				it('Then the carrier should be updated', async () => {
					assert.equal(await contract.carrier(), carrierAlternative);
				});
			});

			describe('When the insurer verifies insurance', () => {
				beforeEach(async () => {
					await contract.verifyInsurance();
				});

				it('Then the contract should be in state "INSURANCE_VERIFIED"', async () => {
					assert.equal(await contract.state(), "INSURANCE_VERIFIED");
				});
			});
		});
	});
});
