Feature: Consignment
	As a consignor
	Acme Freight Forwarding wants to verify that Peak Logistics meets the requirements for a consignment
	So that Acme Freight Forwarding can contract Peak Logistics to deliver the consignment

	Scenario: Requirements met
		Given Acme Freight Forwarding is registered as a consignor
		And Peak Logistics is registered as a consignee
		And Alpha Insurance Co is registered as an insurance verifier

		When Acme Freight Forwarding creates a consignment requiring explosive goods insurance
		And Acme Freight Forwarding assigns Peak Logistics as the consignee
		And Peak Logistics assigns Alpha Insurance Co as the insurance verifier
		And Alpha Insurance Co confirms Peak Logistics has explosive goods insurance

		Then Acme Freight Forwarding should see that the requirements for the consignment have been met
