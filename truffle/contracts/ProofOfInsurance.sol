pragma solidity ^0.4.22;


contract ProofOfInsurance {
	string private CARRIER_ASSIGNED = "CARRIER_ASSIGNED";

	address public consignor;
	address public carrier;
	string public state;
	string public requirements;

	constructor(address _carrier, string _requirements) public {
		consignor = msg.sender;
		carrier = _carrier;
		state = CARRIER_ASSIGNED;
		requirements = _requirements;
	}
}
