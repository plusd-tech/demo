pragma solidity ^0.4.22;


contract ProofOfInsurance {
	uint8 private CARRIER_ASSIGNED = 0x00;
	uint8 private INSURER_ASSIGNED = 0x01;
	uint8 private INSURANCE_VERIFIED = 0x02;

	uint8 public state;
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
		insurer = address(0);
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
