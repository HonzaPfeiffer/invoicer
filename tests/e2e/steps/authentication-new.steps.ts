import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

When('I fill in login credentials', async function (this: CustomWorld, dataTable) {
  const data = dataTable.rowsHash();
  const loginPage = new LoginPage(this.page!);
  
  if (data.email) {
    await loginPage.fillEmail(data.email);
  }
  if (data.password) {
    await loginPage.fillPassword(data.password);
  }
});

When('I fill in registration form', async function (this: CustomWorld, dataTable) {
  const data = dataTable.rowsHash();
  const registerPage = new RegisterPage(this.page!);
  
  if (data.name) {
    await registerPage.fillName(data.name);
  }
  if (data.email) {
    await registerPage.fillEmail(data.email);
  }
  if (data.password) {
    await registerPage.fillPassword(data.password);
  }
});
