import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

Given('I visit the homepage', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.goto();
});

Given('I am a logged in user', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.goto();
  await loginPage.login('test@example.com', 'TestPassword123');
  await this.page!.waitForURL('**/dashboard');
});

Given('I am on the {string} page', async function (this: CustomWorld, path: string) {
  await this.page!.goto(path);
});

When('I click the {string} button', async function (this: CustomWorld, buttonText: string) {
  await this.page!.getByTestId(this.getTestIdFromText(buttonText)).click();
});

When('I click the {string} link', async function (this: CustomWorld, linkText: string) {
  await this.page!.getByTestId(this.getTestIdFromText(linkText)).click();
});

Then('I should be redirected to {string}', async function (this: CustomWorld, path: string) {
  await this.page!.waitForURL(`**${path}`, { timeout: 10000 });
  expect(this.page!.url()).toContain(path);
});

Then('I should see text {string}', async function (this: CustomWorld, text: string) {
  await expect(this.page!.locator(`text=${text}`)).toBeVisible();
});

Then('I should see message {string}', async function (this: CustomWorld, message: string) {
  await expect(this.page!.getByTestId('message')).toContainText(message);
});

Then('I should see error message {string}', async function (this: CustomWorld, message: string) {
  await expect(this.page!.getByTestId('login-error')).toContainText(message);
});
