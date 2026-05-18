Feature: Invoice Management
  As a logged in user
  I want to manage invoices
  So that I can create, edit and delete invoices

  Background:
    Given I am a logged in user
    And I am on the "/dashboard" page

  Scenario: Create new invoice
    When I click the "New Invoice" button
    And I fill in invoice form
      | invoice number   | INV-2026-001           |
      | client name      | Test Client Ltd.       |
      | client address   | Prague 1, Main Street  |
      | client email     | client@test.com        |
      | amount           | 10000                  |
      | currency         | CZK                    |
    And I click the "Save" button
    Then I should see message "Invoice created"
    And I should see invoice "INV-2026-001" in the list

  Scenario: View invoice detail
    Given invoice "INV-2026-001" exists
    When I click on invoice "INV-2026-001"
    Then I should see invoice detail
    And I should see field "Invoice Number" with value "INV-2026-001"

  Scenario: Edit invoice
    Given invoice "INV-2026-001" exists
    When I click on invoice "INV-2026-001"
    And I click the "Edit" button
    And I change field "amount" to "15000"
    And I click the "Save" button
    Then I should see message "Invoice updated"
    And I should see amount "15000 CZK"

  Scenario: Delete invoice
    Given invoice "INV-2026-001" exists
    When I click on invoice "INV-2026-001"
    And I click the "Delete" button
    And I confirm deletion
    Then I should see message "Invoice deleted"
    And I should not see invoice "INV-2026-001" in the list

  Scenario: Export invoice to PDF
    Given invoice "INV-2026-001" exists
    When I click on invoice "INV-2026-001"
    And I click the "Download PDF" button
    Then a PDF file should be downloaded
