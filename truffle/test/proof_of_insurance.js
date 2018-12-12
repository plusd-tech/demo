const ProofOfInsurance = artifacts.require('./ProofOfInsurance.sol');

contract('ProofOfInsurance', function(accounts) {
	let proofOfInsurance;

	describe('Given the contract has been initialised', () => {
		beforeEach(async () => {
			proofOfInsurance = await ProofOfInsurance.deployed();
		});

		it('Then the consignor should be attached', async () => {
			assert.equal(await proofOfInsurance.consignor.call(), accounts[0]);
		});

		it('Then the carrier should be attached', async () => {
			assert.equal(await proofOfInsurance.carrier.call(), accounts[1]);
		});

		it('Then the contract should be in state "CARRIER_ASSIGNED"', async () => {
			assert.equal(await proofOfInsurance.state.call(), "CARRIER_ASSIGNED");
		});

		it('Then the insurance requirements should be specified', async () => {
			assert.equal(await proofOfInsurance.requirements.call(), "explosive goods");
		});
	});
});
