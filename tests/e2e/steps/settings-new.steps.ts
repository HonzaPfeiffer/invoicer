import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { SettingsPage } from '../pages/SettingsPage';

When('I fill in field {string} with {string}', async function (this: CustomWorld, fieldLabel: string, value: string) {
  const settingsPage = new SettingsPage(this.page!);
  
  if (fieldLabel === 'Company Name') {
    await settingsPage.fillCompanyName(value);
  } else if (fieldLabel === 'Address') {
    await settingsPage.fillAddress(value);
  } else if (fieldLabel === 'Tax ID') {
    await settingsPage.fillTaxId(value);
  }
});

Then('I should see company settings form', async function (this: CustomWorld) {
  const settingsPage = new SettingsPage(this.page!);
  expect(await settingsPage.isFormVisible()).toBe(true);
});

Then('I should see field {string}', async function (this: CustomWorld, fieldLabel: string) {
  const settingsPage = new SettingsPage(this.page!);
  expect(await settingsPage.isFieldVisible(fieldLabel)).toBe(true);
});

Then('field {string} should contain {string}', async function (this: CustomWorld, fieldLabel: string, value: string) {
  const settingsPage = new SettingsPage(this.page!);
  
  if (fieldLabel === 'Company Name') {
    const actualValue = await settingsPage.getCompanyNameValue();
    expect(actualValue).toBe(value);
  }
});
