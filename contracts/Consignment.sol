pragma solidity ^0.4.23;

contract Consignment {
	uint8 private UNINITIALISED = 0x00;
	uint8 private CONSIGNEE_ASSIGNED = 0x01;
	uint8 private VERIFIER_ASSIGNED = 0x02;
	uint8 private REQUIREMENTS_VERIFIED = 0x03;
	uint8 public state = UNINITIALISED;

	address public deployer;
	address public consignor;
	address public consignee;
	address public verifier;

	bytes32 public requirements;

	event ConsigneeAssigned(address consignee);
	event VerifierAssigned(address verifier);
	event RequirementsVerified();

	constructor(address _consignor, address _consignee, bytes32 _requirements) public {
		deployer = msg.sender;
		consignor = _consignor;
		requirements = _requirements;
		assignConsignee(_consignee);
	}

	modifier onlyConsignor() {
		if (state == UNINITIALISED) {
			require(msg.sender == deployer);
		} else {
			require(msg.sender == consignor);
		}
		_;
	}

	modifier onlyConsignee() {
		require(msg.sender == consignee);
		_;
	}

	modifier onlyVerifier() {
		require(msg.sender == verifier);
		_;
	}

	function assignConsignee(address _consignee) public onlyConsignor {
		consignee = _consignee;
		verifier = address(0);
		state = CONSIGNEE_ASSIGNED;
		emit ConsigneeAssigned(consignee);
	}

	function assignVerifier(address _verifier) public onlyConsignee {
		verifier = _verifier;
		state = VERIFIER_ASSIGNED;
		emit VerifierAssigned(verifier);
	}

	function verifyRequirements() public onlyVerifier {
		state = REQUIREMENTS_VERIFIED;
		emit RequirementsVerified();
	}
}
