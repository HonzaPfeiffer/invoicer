import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';

BeforeAll(async function () {
  console.log('Starting E2E test suite...');
});

Before(async function (this: CustomWorld) {
  await this.init();
});

After(async function (this: CustomWorld, { result, pickle }) {
  if (result?.status === Status.FAILED) {
    if (this.page) {
      const screenshot = await this.page.screenshot({ fullPage: true });
      await this.attach(screenshot, 'image/png');
      
      const url = this.page.url();
      await this.attach(`Failed at URL: ${url}`, 'text/plain');
    }
  }
  
  await this.cleanup();
});

AfterAll(async function () {
  console.log('E2E test suite completed.');
});
