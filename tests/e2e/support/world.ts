import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

export interface CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
}

export class CustomWorldImpl extends World implements CustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init() {
    this.browser = await chromium.launch({
      headless: process.env.HEADLESS !== 'false',
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: process.env.CI ? { dir: 'test-results/videos' } : undefined,
    });
    this.page = await this.context.newPage();
  }

  async cleanup() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }

  getTestIdFromText(text: string): string {
    const mapping: { [key: string]: string } = {
      'Sign In': 'login-submit',
      'Register': 'register-link',
      'New Invoice': 'new-invoice-button',
      'Save': 'invoice-save',
      'Edit': 'invoice-edit',
      'Delete': 'invoice-delete',
      'Download PDF': 'invoice-download-pdf',
      'Settings': 'settings-link',
      'Save Changes': 'settings-save',
    };
    return mapping[text] || text.toLowerCase().replace(/\s+/g, '-');
  }
}

setWorldConstructor(CustomWorldImpl);
