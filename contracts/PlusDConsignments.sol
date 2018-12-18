pragma solidity ^0.4.23;

import "./PlusDRegistration.sol";
import "./Consignment.sol";

contract PlusDConsignments is PlusDRegistration {
	mapping (address => address[]) public consignments;

	event ConsignmentCreated(address consignment);

	function createConsignment(bytes32 _requirements) public onlyConsignor {
		Consignment consignment = new Consignment(msg.sender, _requirements);
		consignments[msg.sender].push(consignment);
		emit ConsignmentCreated(consignment);
	}

	function assignConsignee(address _consignment, address _consignee) public onlyConsignor isConsignee(_consignee) {
		Consignment consignment = Consignment(_consignment);
		consignment.assignConsignee(_consignee);
	}

	function assignVerifier(address _consignment, address _verifier) public onlyConsignee isVerifier(_verifier) {
		Consignment consignment = Consignment(_consignment);
		consignment.assignVerifier(_verifier);
	}

	function verifyRequirements(address _consignment) public onlyVerifier {
		Consignment consignment = Consignment(_consignment);
		consignment.verifyRequirements();
	}
}
