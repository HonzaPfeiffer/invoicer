import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When('vyplním pole {string} hodnotou {string}', async function (this: CustomWorld, fieldLabel: string, value: string) {
  const fieldMap: { [key: string]: string } = {
    'Název společnosti': 'companyName',
    'Adresa': 'companyAddress',
    'IČO': 'companyIco',
  };
  
  const inputName = fieldMap[fieldLabel] || fieldLabel;
  await this.page!.fill(`input[name="${inputName}"]`, value);
});

Then('by měl vidět formulář nastavení společnosti', async function (this: CustomWorld) {
  await expect(this.page!.locator('form')).toBeVisible();
});

Then('měl bych vidět pole {string}', async function (this: CustomWorld, fieldLabel: string) {
  await expect(this.page!.locator(`label:has-text("${fieldLabel}")`)).toBeVisible();
});

Then('pole {string} by mělo obsahovat {string}', async function (this: CustomWorld, fieldLabel: string, value: string) {
  const fieldMap: { [key: string]: string } = {
    'Název společnosti': 'companyName',
    'Adresa': 'companyAddress',
    'IČO': 'companyIco',
  };
  
  const inputName = fieldMap[fieldLabel] || fieldLabel;
  const inputValue = await this.page!.inputValue(`input[name="${inputName}"]`);
  expect(inputValue).toBe(value);
});
