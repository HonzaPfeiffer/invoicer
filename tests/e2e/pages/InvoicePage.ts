import { Page } from '@playwright/test';

export class InvoicePage {
  constructor(private page: Page) {}

  async fillInvoiceNumber(value: string) {
    await this.page.getByTestId('invoice-number').fill(value);
  }

  async fillClientName(value: string) {
    await this.page.getByTestId('client-name').fill(value);
  }

  async fillClientAddress(value: string) {
    await this.page.getByTestId('client-address').fill(value);
  }

  async fillClientEmail(value: string) {
    await this.page.getByTestId('client-email').fill(value);
  }

  async fillAmount(value: string) {
    await this.page.getByTestId('invoice-amount').fill(value);
  }

  async selectCurrency(currency: string) {
    await this.page.getByTestId('invoice-currency').selectOption(currency);
  }

  async clickSave() {
    await this.page.getByTestId('invoice-save').click();
  }

  async clickEdit() {
    await this.page.getByTestId('invoice-edit').click();
  }

  async clickDelete() {
    await this.page.getByTestId('invoice-delete').click();
  }

  async clickDownloadPDF() {
    await this.page.getByTestId('invoice-download-pdf').click();
  }

  async confirmDeletion() {
    await this.page.getByTestId('confirm-delete').click();
  }

  async getMessage() {
    return this.page.getByTestId('message');
  }

  async getFieldValue(fieldName: string) {
    return this.page.getByTestId(fieldName);
  }

  async fillInvoiceForm(data: {
    invoiceNumber?: string;
    clientName?: string;
    clientAddress?: string;
    clientEmail?: string;
    amount?: string;
    currency?: string;
  }) {
    if (data.invoiceNumber) await this.fillInvoiceNumber(data.invoiceNumber);
    if (data.clientName) await this.fillClientName(data.clientName);
    if (data.clientAddress) await this.fillClientAddress(data.clientAddress);
    if (data.clientEmail) await this.fillClientEmail(data.clientEmail);
    if (data.amount) await this.fillAmount(data.amount);
    if (data.currency) await this.selectCurrency(data.currency);
  }
}
