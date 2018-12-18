pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Consignment is Ownable {
	uint8 private CONSIGNMENT_CREATED = 0x00;
	uint8 private CONSIGNEE_ASSIGNED = 0x01;
	uint8 private VERIFIER_ASSIGNED = 0x02;
	uint8 private REQUIREMENTS_VERIFIED = 0x03;
	uint8 public state = CONSIGNMENT_CREATED;

	address public consignor;
	address public consignee;
	address public verifier;

	bytes32 public requirements;

	event ConsigneeAssigned(address consignee);
	event VerifierAssigned(address verifier);
	event RequirementsVerified();

	constructor(address _consignor, bytes32 _requirements) public {
		consignor = _consignor;
		requirements = _requirements;
	}

	function assignConsignee(address _consignee) public onlyOwner {
		consignee = _consignee;
		verifier = address(0);
		state = CONSIGNEE_ASSIGNED;
		emit ConsigneeAssigned(consignee);
	}

	function assignVerifier(address _verifier) public onlyOwner {
		verifier = _verifier;
		state = VERIFIER_ASSIGNED;
		emit VerifierAssigned(verifier);
	}

	function verifyRequirements() public onlyOwner {
		state = REQUIREMENTS_VERIFIED;
		emit RequirementsVerified();
	}
}
