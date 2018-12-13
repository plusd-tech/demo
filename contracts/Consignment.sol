pragma solidity ^0.4.23;

contract Consignment {
	uint8 private CARRIER_ASSIGNED = 0x00;
	uint8 private INSURER_ASSIGNED = 0x01;
	uint8 private INSURANCE_VERIFIED = 0x02;

	uint8 public state;
	address public consignor;
	address public carrier;
	address public insurer;
	bytes32 public requirements;

	event CarrierAssigned(address carrier);
	event InsurerAssigned(address insurer);
	event InsuranceVerified();

	constructor(address _carrier, bytes32 _requirements) public {
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
		emit CarrierAssigned(carrier);
	}

	function assignInsurer(address _insurer) public onlyCarrier {
		insurer = _insurer;
		state = INSURER_ASSIGNED;
		emit InsurerAssigned(insurer);
	}

	function verifyInsurance() public onlyInsurer {
		state = INSURANCE_VERIFIED;
		emit InsuranceVerified();
	}
}
