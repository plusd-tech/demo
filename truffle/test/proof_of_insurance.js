const ProofOfInsurance = artifacts.require('./ProofOfInsurance.sol');

contract('ProofOfInsurance', function(accounts) {
	const [consignor, carrier, insurer] = accounts;
	let proofOfInsurance;

	describe('Given the consignor has initialised the contract with insurance requirements "explosive goods" and assigned the carrier', () => {
		beforeEach(async () => {
			proofOfInsurance = await ProofOfInsurance.deployed();
		});

		it('Then the contract should be in state "CARRIER_ASSIGNED"', async () => {
			assert.equal(await proofOfInsurance.state(), "CARRIER_ASSIGNED");
		});

		it('Then the consignor should be specified', async () => {
			assert.equal(await proofOfInsurance.consignor(), consignor);
		});

		it('Then the carrier should be specified', async () => {
			assert.equal(await proofOfInsurance.carrier(), carrier);
		});

		it('Then the insurer should not be specified', async () => {
			assert.equal(await proofOfInsurance.insurer(), 0);
		});

		it('Then the insurance requirements should be specified', async () => {
			assert.equal(await proofOfInsurance.requirements(), "explosive goods");
		});

		describe('When the carrier assigns the insurer', () => {
			beforeEach(async () => {
				await proofOfInsurance.assignInsurer(insurer);
			});

			it('Then the contract should be in state "INSURER_ASSIGNED"', async () => {
				assert.equal(await proofOfInsurance.state(), "INSURER_ASSIGNED");
			});

			it('Then the insurer should be specified', async () => {
				assert.equal(await proofOfInsurance.insurer(), insurer);
			});

			describe('When the insurer verifies insurance', () => {
				beforeEach(async () => {
					await proofOfInsurance.verifyInsurance();
				});

				it('Then the contract should be in state "INSURANCE_VERIFIED"', async () => {
					assert.equal(await proofOfInsurance.state(), "INSURANCE_VERIFIED");
				});
			});
		});
	});
});
