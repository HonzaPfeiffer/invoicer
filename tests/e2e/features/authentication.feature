Feature: User Authentication
  As a user
  I want to log in to the system
  So that I can manage invoices

  Background:
    Given I visit the homepage

  Scenario: Successful login
    When I fill in login credentials
      | email    | test@example.com |
      | password | TestPassword123  |
    And I click the "Sign In" button
    Then I should be redirected to "/dashboard"
    And I should see text "Dashboard"

  Scenario: Failed login with incorrect password
    When I fill in login credentials
      | email    | test@example.com |
      | password | WrongPassword    |
    And I click the "Sign In" button
    Then I should see error message "Invalid credentials"

  Scenario: Register new user
    When I click the "Register" link
    And I fill in registration form
      | name     | Test User        |
      | email    | new@example.com  |
      | password | NewPassword123   |
    And I click the "Register" button
    Then I should be redirected to "/dashboard"
    And I should see text "Welcome"
