Feature: Company Settings
  As a logged in user
  I want to edit my company information
  So that I have correct details on invoices

  Background:
    Given I am a logged in user
    And I am on the "/dashboard" page

  Scenario: View company settings
    When I click the "Settings" link
    Then I should see company settings form
    And I should see field "Company Name"
    And I should see field "Address"
    And I should see field "Tax ID"

  Scenario: Update company information
    When I click the "Settings" link
    And I fill in field "Company Name" with "My Company Ltd."
    And I fill in field "Address" with "Prague 2, Main Street 10"
    And I fill in field "Tax ID" with "12345678"
    And I click the "Save Changes" button
    Then I should see message "Settings saved"
    And field "Company Name" should contain "My Company Ltd."
