import { Page } from '@playwright/test';

export class SettingsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/settings');
  }

  async fillCompanyName(value: string) {
    await this.page.getByTestId('company-name').fill(value);
  }

  async fillAddress(value: string) {
    await this.page.getByTestId('company-address').fill(value);
  }

  async fillTaxId(value: string) {
    await this.page.getByTestId('company-tax-id').fill(value);
  }

  async clickSaveChanges() {
    await this.page.getByTestId('settings-save').click();
  }

  async getCompanyNameValue() {
    return this.page.getByTestId('company-name').inputValue();
  }

  async getMessage() {
    return this.page.getByTestId('message');
  }

  async isFormVisible() {
    return this.page.getByTestId('settings-form').isVisible();
  }

  async isFieldVisible(fieldLabel: string) {
    const fieldMap: { [key: string]: string } = {
      'Company Name': 'company-name',
      'Address': 'company-address',
      'Tax ID': 'company-tax-id',
    };
    const testId = fieldMap[fieldLabel] || fieldLabel;
    return this.page.getByTestId(testId).isVisible();
  }
}
