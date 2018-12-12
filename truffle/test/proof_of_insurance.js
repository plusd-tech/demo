const ProofOfInsurance = artifacts.require('./ProofOfInsurance.sol');

contract('ProofOfInsurance', function(accounts) {
	it('should assert true', function(done) {
		var proof_of_insurance = ProofOfInsurance.deployed();
		assert.isTrue(true);
		done();
	});
});
