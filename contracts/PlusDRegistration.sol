pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract PlusDRegistration is Ownable {
	mapping (address => bytes32) public consignors;
	mapping (address => bytes32) public consignees;
	mapping (address => bytes32) public verifiers;

	event ConsignorRegistered(address consignor, bytes32 companyRegistrationNumber);
	event ConsigneeRegistered(address consignee, bytes32 companyRegistrationNumber);
	event VerifierRegistered(address verifier, bytes32 companyRegistrationNumber);

	modifier onlyConsignor() {
		require(consignors[msg.sender] != 0);
		_;
	}

	modifier onlyConsignee() {
		require(consignees[msg.sender] != 0);
		_;
	}

	modifier onlyVerifier() {
		require(verifiers[msg.sender] != 0);
		_;
	}

	modifier isConsignee(address _consignee) {
		require(consignees[_consignee] != 0);
		_;
	}

	modifier isVerifier(address _verifier) {
		require(verifiers[_verifier] != 0);
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
}
