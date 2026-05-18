import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { DashboardPage } from '../pages/DashboardPage';
import { InvoicePage } from '../pages/InvoicePage';

Given('invoice {string} exists', async function (this: CustomWorld, invoiceNumber: string) {
  const dashboardPage = new DashboardPage(this.page!);
  await dashboardPage.goto();
  
  const invoiceExists = await dashboardPage.isInvoiceVisible(invoiceNumber).catch(() => false);
  
  if (!invoiceExists) {
    const invoicePage = new InvoicePage(this.page!);
    await dashboardPage.clickNewInvoice();
    await invoicePage.fillInvoiceForm({
      invoiceNumber,
      clientName: 'Test Client',
      clientAddress: 'Test Address',
      clientEmail: 'test@client.com',
      amount: '10000',
      currency: 'CZK'
    });
    await invoicePage.clickSave();
    await this.page!.waitForTimeout(1000);
    await dashboardPage.goto();
  }
});

When('I fill in invoice form', async function (this: CustomWorld, dataTable) {
  const data = dataTable.rowsHash();
  const invoicePage = new InvoicePage(this.page!);
  
  const formData: any = {};
  if (data['invoice number']) formData.invoiceNumber = data['invoice number'];
  if (data['client name']) formData.clientName = data['client name'];
  if (data['client address']) formData.clientAddress = data['client address'];
  if (data['client email']) formData.clientEmail = data['client email'];
  if (data['amount']) formData.amount = data['amount'];
  if (data['currency']) formData.currency = data['currency'];
  
  await invoicePage.fillInvoiceForm(formData);
});

When('I click on invoice {string}', async function (this: CustomWorld, invoiceNumber: string) {
  const dashboardPage = new DashboardPage(this.page!);
  await dashboardPage.clickInvoice(invoiceNumber);
});

When('I change field {string} to {string}', async function (this: CustomWorld, fieldName: string, value: string) {
  const invoicePage = new InvoicePage(this.page!);
  
  if (fieldName === 'amount') {
    await invoicePage.fillAmount(value);
  }
});

When('I confirm deletion', async function (this: CustomWorld) {
  const invoicePage = new InvoicePage(this.page!);
  await invoicePage.confirmDeletion();
});

Then('I should see invoice {string} in the list', async function (this: CustomWorld, invoiceNumber: string) {
  const dashboardPage = new DashboardPage(this.page!);
  await dashboardPage.goto();
  await expect(dashboardPage.getInvoiceByNumber(invoiceNumber)).toBeVisible();
});

Then('I should not see invoice {string} in the list', async function (this: CustomWorld, invoiceNumber: string) {
  const dashboardPage = new DashboardPage(this.page!);
  await dashboardPage.goto();
  await expect(dashboardPage.getInvoiceByNumber(invoiceNumber)).not.toBeVisible();
});

Then('I should see invoice detail', async function (this: CustomWorld) {
  await expect(this.page!.getByTestId('invoice-detail')).toBeVisible();
});

Then('I should see field {string} with value {string}', async function (this: CustomWorld, fieldLabel: string, value: string) {
  await expect(this.page!.locator(`text=${value}`)).toBeVisible();
});

Then('I should see amount {string}', async function (this: CustomWorld, amount: string) {
  await expect(this.page!.locator(`text=${amount}`)).toBeVisible();
});

Then('a PDF file should be downloaded', async function (this: CustomWorld) {
  const downloadPromise = this.page!.waitForEvent('download');
  const invoicePage = new InvoicePage(this.page!);
  await invoicePage.clickDownloadPDF();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('.pdf');
});
