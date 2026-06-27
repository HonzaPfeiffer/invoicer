import { Page } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/dashboard');
  }

  async clickNewInvoice() {
    await this.page.getByTestId('new-invoice-button').click();
  }

  async clickSettingsLink() {
    await this.page.getByTestId('settings-link').click();
  }

  async getInvoiceByNumber(invoiceNumber: string) {
    return this.page.getByTestId(`invoice-${invoiceNumber}`);
  }

  async clickInvoice(invoiceNumber: string) {
    await this.page.getByTestId(`invoice-${invoiceNumber}`).click();
  }

  async isInvoiceVisible(invoiceNumber: string) {
    return this.page.getByTestId(`invoice-${invoiceNumber}`).isVisible();
  }
}
