pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract PlusD is Ownable {
	mapping (bytes32 => address) public consignors;

	function registerConsignor(address _consignor, bytes32 _companyRegistrationNumber) public {
		consignors[_companyRegistrationNumber] = _consignor;
	}
}
