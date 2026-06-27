import { Page } from '@playwright/test';

export class RegisterPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/register');
  }

  async clickRegisterLink() {
    await this.page.getByTestId('register-link').click();
  }

  async fillName(name: string) {
    await this.page.getByTestId('register-name').fill(name);
  }

  async fillEmail(email: string) {
    await this.page.getByTestId('register-email').fill(email);
  }

  async fillPassword(password: string) {
    await this.page.getByTestId('register-password').fill(password);
  }

  async clickRegisterButton() {
    await this.page.getByTestId('register-submit').click();
  }

  async register(name: string, email: string, password: string) {
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickRegisterButton();
  }
}
