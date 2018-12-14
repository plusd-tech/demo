pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Consignment.sol";

contract PlusD is Ownable {
	mapping (bytes32 => address) public consignors;
	mapping (bytes32 => address) public carriers;
	mapping (bytes32 => address) public insurers;
	mapping (address => address[]) public consignments;

	event ConsignorRegistered(address consignor, bytes32 companyRegistrationNumber);
	event CarrierRegistered(address carrier, bytes32 companyRegistrationNumber);
	event InsurerRegistered(address insurer, bytes32 companyRegistrationNumber);

	function registerConsignor(address _consignor, bytes32 _companyRegistrationNumber) public onlyOwner {
		consignors[_companyRegistrationNumber] = _consignor;
		emit ConsignorRegistered(_consignor, _companyRegistrationNumber);
	}

	function registerCarrier(address _carrier, bytes32 _companyRegistrationNumber) public onlyOwner {
		carriers[_companyRegistrationNumber] = _carrier;
		emit CarrierRegistered(_carrier, _companyRegistrationNumber);
	}

	function registerInsurer(address _insurer, bytes32 _companyRegistrationNumber) public onlyOwner {
		insurers[_companyRegistrationNumber] = _insurer;
		emit InsurerRegistered(_insurer, _companyRegistrationNumber);
	}

	function createConsignment(address _carrier, bytes32 _requirements) public {
		Consignment consignment = new Consignment(msg.sender, _carrier, _requirements);
		consignments[msg.sender].push(consignment);
	}
}
