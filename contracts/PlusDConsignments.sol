pragma solidity ^0.4.23;

import "./PlusDRegistration.sol";
import "./Consignment.sol";

contract PlusDConsignments is PlusDRegistration {
	mapping (address => address[]) public consignments;

	event ConsignmentCreated(address consignment);

	function createConsignment(address _consignee, bytes32 _requirements) public onlyConsignor isConsignee(_consignee) {
		Consignment consignment = new Consignment(msg.sender, _consignee, _requirements);
		consignments[msg.sender].push(consignment);
		emit ConsignmentCreated(consignment);
	}

	function assignVerifier(address _consignment, address _verifier) public onlyConsignee isVerifier(_verifier) {
		Consignment consignment = Consignment(_consignment);
		consignment.assignVerifier(_verifier);
	}
}
