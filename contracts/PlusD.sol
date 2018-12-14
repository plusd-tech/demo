pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Consignment.sol";

contract PlusD is Ownable {
	mapping (address => bytes32) public consignors;
	mapping (address => bytes32) public carriers;
	mapping (address => bytes32) public insurers;
	mapping (address => address[]) public consignments;

	event ConsignorRegistered(address consignor, bytes32 companyRegistrationNumber);
	event CarrierRegistered(address carrier, bytes32 companyRegistrationNumber);
	event InsurerRegistered(address insurer, bytes32 companyRegistrationNumber);
	event ConsignmentCreated(address consignment);

	modifier onlyConsignor() {
		require(consignors[msg.sender] != 0);
		_;
	}

	function registerConsignor(address _consignor, bytes32 _companyRegistrationNumber) public onlyOwner {
		consignors[_consignor] = _companyRegistrationNumber;
		emit ConsignorRegistered(_consignor, _companyRegistrationNumber);
	}

	function registerCarrier(address _carrier, bytes32 _companyRegistrationNumber) public onlyOwner {
		carriers[_carrier] = _companyRegistrationNumber;
		emit CarrierRegistered(_carrier, _companyRegistrationNumber);
	}

	function registerInsurer(address _insurer, bytes32 _companyRegistrationNumber) public onlyOwner {
		insurers[_insurer] = _companyRegistrationNumber;
		emit InsurerRegistered(_insurer, _companyRegistrationNumber);
	}

	function createConsignment(address _carrier, bytes32 _requirements) public onlyConsignor {
		Consignment consignment = new Consignment(msg.sender, _carrier, _requirements);
		consignments[msg.sender].push(consignment);
		emit ConsignmentCreated(consignment);
	}
}
