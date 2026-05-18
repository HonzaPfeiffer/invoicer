import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('jsem na stránce {string}', async function (this: CustomWorld, path: string) {
  await this.page!.goto(path);
});

Given('existuje faktura {string}', async function (this: CustomWorld, invoiceNumber: string) {
  await this.page!.goto('/dashboard');
  const invoiceExists = await this.page!.locator(`text=${invoiceNumber}`).isVisible().catch(() => false);
  
  if (!invoiceExists) {
    await this.page!.click('button:has-text("Nová faktura")');
    await this.page!.fill('input[name="invoiceNumber"]', invoiceNumber);
    await this.page!.fill('input[name="clientName"]', 'Test Client');
    await this.page!.fill('input[name="clientAddress"]', 'Test Address');
    await this.page!.fill('input[name="clientEmail"]', 'test@client.com');
    await this.page!.fill('input[name="totalAmount"]', '10000');
    await this.page!.click('button:has-text("Uložit")');
    await this.page!.waitForTimeout(1000);
    await this.page!.goto('/dashboard');
  }
});

When('vyplním formulář faktury', async function (this: CustomWorld, dataTable) {
  const data = dataTable.rowsHash();
  
  if (data['číslo faktury']) {
    await this.page!.fill('input[name="invoiceNumber"]', data['číslo faktury']);
  }
  if (data['jméno klienta']) {
    await this.page!.fill('input[name="clientName"]', data['jméno klienta']);
  }
  if (data['adresa klienta']) {
    await this.page!.fill('input[name="clientAddress"]', data['adresa klienta']);
  }
  if (data['email klienta']) {
    await this.page!.fill('input[name="clientEmail"]', data['email klienta']);
  }
  if (data['částka']) {
    await this.page!.fill('input[name="totalAmount"]', data['částka']);
  }
  if (data['měna']) {
    await this.page!.selectOption('select[name="currency"]', data['měna']);
  }
});

When('kliknu na fakturu {string}', async function (this: CustomWorld, invoiceNumber: string) {
  await this.page!.click(`text=${invoiceNumber}`);
});

When('změním pole {string} na {string}', async function (this: CustomWorld, fieldName: string, value: string) {
  const fieldMap: { [key: string]: string } = {
    'částka': 'totalAmount',
    'jméno klienta': 'clientName',
    'adresa klienta': 'clientAddress',
    'email klienta': 'clientEmail',
  };
  
  const inputName = fieldMap[fieldName] || fieldName;
  await this.page!.fill(`input[name="${inputName}"]`, value);
});

When('potvrdím smazání', async function (this: CustomWorld) {
  await this.page!.click('button:has-text("Potvrdit")');
});

Then('by měl vidět zprávu {string}', async function (this: CustomWorld, message: string) {
  await expect(this.page!.locator(`text=${message}`)).toBeVisible({ timeout: 5000 });
});

Then('měl bych vidět fakturu {string} v seznamu', async function (this: CustomWorld, invoiceNumber: string) {
  await this.page!.goto('/dashboard');
  await expect(this.page!.locator(`text=${invoiceNumber}`)).toBeVisible();
});

Then('neměl bych vidět fakturu {string} v seznamu', async function (this: CustomWorld, invoiceNumber: string) {
  await this.page!.goto('/dashboard');
  await expect(this.page!.locator(`text=${invoiceNumber}`)).not.toBeVisible();
});

Then('by měl vidět detail faktury', async function (this: CustomWorld) {
  await expect(this.page!.locator('text=Detail faktury')).toBeVisible();
});

Then('měl bych vidět pole {string} s hodnotou {string}', async function (this: CustomWorld, fieldLabel: string, value: string) {
  await expect(this.page!.locator(`text=${value}`)).toBeVisible();
});

Then('měl bych vidět částku {string}', async function (this: CustomWorld, amount: string) {
  await expect(this.page!.locator(`text=${amount}`)).toBeVisible();
});

Then('by měl být stažen soubor PDF', async function (this: CustomWorld) {
  const downloadPromise = this.page!.waitForEvent('download');
  await this.page!.click('button:has-text("Stáhnout PDF")');
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('.pdf');
});
