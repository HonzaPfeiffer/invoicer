import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async fillEmail(email: string) {
    await this.page.getByTestId('login-email').fill(email);
  }

  async fillPassword(password: string) {
    await this.page.getByTestId('login-password').fill(password);
  }

  async clickSignIn() {
    await this.page.getByTestId('login-submit').click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  async getErrorMessage() {
    return this.page.getByTestId('login-error');
  }
}
