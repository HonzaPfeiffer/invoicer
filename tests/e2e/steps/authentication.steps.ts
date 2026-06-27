import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('navštívím domovskou stránku', async function (this: CustomWorld) {
  await this.page!.goto('/');
});

Given('jsem přihlášený uživatel', async function (this: CustomWorld) {
  await this.page!.goto('/');
  await this.page!.fill('input[name="email"]', 'test@example.com');
  await this.page!.fill('input[name="password"]', 'TestPassword123');
  await this.page!.click('button[type="submit"]');
  await this.page!.waitForURL('**/dashboard');
});

When('vyplním přihlašovací údaje', async function (this: CustomWorld, dataTable) {
  const data = dataTable.rowsHash();
  if (data.email) {
    await this.page!.fill('input[name="email"]', data.email);
  }
  if (data.heslo) {
    await this.page!.fill('input[name="password"]', data.heslo);
  }
});

When('vyplním registrační formulář', async function (this: CustomWorld, dataTable) {
  const data = dataTable.rowsHash();
  if (data.jméno) {
    await this.page!.fill('input[name="name"]', data.jméno);
  }
  if (data.email) {
    await this.page!.fill('input[name="email"]', data.email);
  }
  if (data.heslo) {
    await this.page!.fill('input[name="password"]', data.heslo);
  }
});

When('kliknu na tlačítko {string}', async function (this: CustomWorld, buttonText: string) {
  await this.page!.click(`button:has-text("${buttonText}")`);
});

When('kliknu na odkaz {string}', async function (this: CustomWorld, linkText: string) {
  await this.page!.click(`a:has-text("${linkText}")`);
});

Then('by měl být přesměrován na {string}', async function (this: CustomWorld, path: string) {
  await this.page!.waitForURL(`**${path}`, { timeout: 10000 });
  expect(this.page!.url()).toContain(path);
});

Then('měl bych vidět text {string}', async function (this: CustomWorld, text: string) {
  await expect(this.page!.locator(`text=${text}`)).toBeVisible();
});

Then('by měl vidět chybovou zprávu {string}', async function (this: CustomWorld, message: string) {
  await expect(this.page!.locator(`text=${message}`)).toBeVisible();
});
