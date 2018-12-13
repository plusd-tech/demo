pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract PlusD is Ownable {
	mapping (bytes32 => address) public consignors;
	mapping (bytes32 => address) public carriers;

	function registerConsignor(address _consignor, bytes32 _companyRegistrationNumber) public onlyOwner {
		consignors[_companyRegistrationNumber] = _consignor;
	}

	function registerCarrier(address _carrier, bytes32 _companyRegistrationNumber) public onlyOwner {
		carriers[_companyRegistrationNumber] = _carrier;
	}
}
