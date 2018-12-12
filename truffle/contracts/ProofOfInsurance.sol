pragma solidity ^0.4.22;


contract ProofOfInsurance {
	string private CARRIER_ASSIGNED = "CARRIER_ASSIGNED";
	string private INSURER_ASSIGNED = "INSURER_ASSIGNED";
	string private INSURANCE_VERIFIED = "INSURANCE_VERIFIED";

	string public state;
	address public consignor;
	address public carrier;
	address public insurer;
	string public requirements;

	constructor(address _carrier, string _requirements) public {
		consignor = msg.sender;
		requirements = _requirements;
		assignCarrier(_carrier);
	}

	modifier onlyConsignor() {
		require(msg.sender == consignor);
		_;
	}

	modifier onlyCarrier() {
		require(msg.sender == carrier);
		_;
	}

	modifier onlyInsurer() {
		require(msg.sender == insurer);
		_;
	}

	function assignCarrier(address _carrier) public onlyConsignor {
		carrier = _carrier;
		state = CARRIER_ASSIGNED;
	}

	function assignInsurer(address _insurer) public onlyCarrier {
		insurer = _insurer;
		state = INSURER_ASSIGNED;
	}

	function verifyInsurance() public onlyInsurer {
		state = INSURANCE_VERIFIED;
	}
}
