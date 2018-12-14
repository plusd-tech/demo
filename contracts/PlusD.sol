pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract PlusD is Ownable {
	mapping (bytes32 => address) public consignors;
	mapping (bytes32 => address) public carriers;
	mapping (bytes32 => address) public insurers;

	event ConsignorRegistered(address consignor, bytes32 companyRegistrationNumber);

	function registerConsignor(address _consignor, bytes32 _companyRegistrationNumber) public onlyOwner {
		consignors[_companyRegistrationNumber] = _consignor;
		emit ConsignorRegistered(_consignor, _companyRegistrationNumber);
	}

	function registerCarrier(address _carrier, bytes32 _companyRegistrationNumber) public onlyOwner {
		carriers[_companyRegistrationNumber] = _carrier;
	}

	function registerInsurer(address _insurer, bytes32 _companyRegistrationNumber) public onlyOwner {
		insurers[_companyRegistrationNumber] = _insurer;
	}
}
