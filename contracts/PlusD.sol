pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Consignment.sol";

contract PlusD is Ownable {
	mapping (address => bytes32) public consignors;
	mapping (address => bytes32) public consignees;
	mapping (address => bytes32) public verifiers;
	mapping (address => address[]) public consignments;

	event ConsignorRegistered(address consignor, bytes32 companyRegistrationNumber);
	event ConsigneeRegistered(address consignee, bytes32 companyRegistrationNumber);
	event VerifierRegistered(address verifier, bytes32 companyRegistrationNumber);
	event ConsignmentCreated(address consignment);

	modifier onlyConsignor() {
		require(consignors[msg.sender] != 0);
		_;
	}

	function registerConsignor(address _consignor, bytes32 _companyRegistrationNumber) public onlyOwner {
		consignors[_consignor] = _companyRegistrationNumber;
		emit ConsignorRegistered(_consignor, _companyRegistrationNumber);
	}

	function registerConsignee(address _consignee, bytes32 _companyRegistrationNumber) public onlyOwner {
		consignees[_consignee] = _companyRegistrationNumber;
		emit ConsigneeRegistered(_consignee, _companyRegistrationNumber);
	}

	function registerVerifier(address _verifier, bytes32 _companyRegistrationNumber) public onlyOwner {
		verifiers[_verifier] = _companyRegistrationNumber;
		emit VerifierRegistered(_verifier, _companyRegistrationNumber);
	}

	function createConsignment(address _consignee, bytes32 _requirements) public onlyConsignor {
		Consignment consignment = new Consignment(msg.sender, _consignee, _requirements);
		consignments[msg.sender].push(consignment);
		emit ConsignmentCreated(consignment);
	}
}
