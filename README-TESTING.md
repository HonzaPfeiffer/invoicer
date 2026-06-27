# E2E Testing with Playwright and Cucumber

This project uses **Playwright** with **Cucumber (Gherkin)** for end-to-end testing with page object models.

## 🚀 Quick Start

### 1. Installation

Dependencies are already installed. To reinstall:

```bash
npm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install
```

### 3. Run Tests

```bash
# All tests (headless)
npm run test:e2e

# With visible browser
npm run test:e2e:headed

# UI mode (interactive)
npm run test:e2e:ui
```

## 📁 Test Structure

```
tests/
├── e2e/
│   ├── features/               # Gherkin feature files (English)
│   │   ├── authentication.feature
│   │   ├── invoices.feature
│   │   └── company-settings.feature
│   ├── steps/                  # Step definitions
│   │   ├── common.steps.ts
│   │   ├── authentication-new.steps.ts
│   │   ├── invoices-new.steps.ts
│   │   └── settings-new.steps.ts
│   ├── pages/                  # Page Object Models
│   │   ├── LoginPage.ts
│   │   ├── RegisterPage.ts
│   │   ├── DashboardPage.ts
│   │   ├── InvoicePage.ts
│   │   └── SettingsPage.ts
│   └── support/                # Support files
│       ├── world.ts
│       └── hooks.ts
```

## 📝 Test Coverage

### Authentication
- ✅ Successful login
- ✅ Failed login with incorrect password
- ✅ Register new user

### Invoice Management
- ✅ Create new invoice
- ✅ View invoice detail
- ✅ Edit invoice
- ✅ Delete invoice
- ✅ Export invoice to PDF

### Company Settings
- ✅ View company settings
- ✅ Update company information

## 🎯 Page Object Models

Tests use page object models for better maintainability:

```typescript
// Example: Using LoginPage
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login('user@example.com', 'password');
```

All page objects use `data-testid` attributes for element selection. See `docs/TEST_ATTRIBUTES.md` for the complete list.

## 🔧 Configuration

### Cucumber (`cucumber.js`)
- Parallel execution: 2 workers
- Report formats: Progress, HTML, JSON
- Retry: 1x for @flaky tests

### Playwright (`playwright.config.ts`)
- Browsers: Chromium, Firefox, WebKit, Mobile Chrome
- Base URL: `http://localhost:3000`
- Screenshots and videos on failure
- Trace on first retry

## 🤖 GitHub Actions

### Automatic Execution

Tests run automatically on:
- **Push** to `main` or `develop`
- **Pull Request** to `main` or `develop`
- **Scheduled** daily at 2:00 AM (all browsers)
- **Manual** via GitHub Actions UI

### Docker Compose Integration

GitHub Actions now use Docker Compose to:
- Start PostgreSQL database
- Run the application
- Execute tests in isolated environment
- Clean up after tests

### Workflow Files

1. **`.github/workflows/e2e-tests.yml`**
   - Runs on push/PR
   - Tests in Chromium
   - Uses Docker Compose
   - Uploads artifacts on failure

2. **`.github/workflows/scheduled-tests.yml`**
   - Runs scheduled
   - Tests all browsers (Chromium, Firefox, WebKit)
   - Matrix strategy for parallel execution
   - Uses Docker Compose

## 📊 Test Outputs

After running tests:

```
test-results/
├── cucumber-report.html    # HTML report
├── cucumber-report.json    # JSON report
├── screenshots/            # Screenshots on failure
└── videos/                 # Videos on failure
```

## ✍️ Writing New Tests

### 1. Create Feature File

```gherkin
Feature: Client Management
  As a user
  I want to manage clients
  So that I can create invoices

  Scenario: Add new client
    Given I am a logged in user
    When I click the "New Client" button
    And I fill in client form
      | name  | Test Client Ltd. |
      | email | test@client.com  |
    And I click the "Save" button
    Then I should see message "Client created"
```

### 2. Create/Update Page Object

```typescript
// tests/e2e/pages/ClientPage.ts
export class ClientPage {
  constructor(private page: Page) {}

  async fillName(value: string) {
    await this.page.getByTestId('client-name').fill(value);
  }
  
  async clickSave() {
    await this.page.getByTestId('client-save').click();
  }
}
```

### 3. Implement Step Definitions

```typescript
// tests/e2e/steps/client.steps.ts
import { When } from '@cucumber/cucumber';
import { ClientPage } from '../pages/ClientPage';

When('I fill in client form', async function (this: CustomWorld, dataTable) {
  const data = dataTable.rowsHash();
  const clientPage = new ClientPage(this.page!);
  await clientPage.fillName(data.name);
});
```

## 🏗️ Adding Test Attributes to Frontend

Before tests can run, add `data-testid` attributes to frontend components:

```tsx
// Example: Login form
<input 
  data-testid="login-email"
  name="email" 
  type="email" 
/>
<button data-testid="login-submit">Sign In</button>
```

See `docs/TEST_ATTRIBUTES.md` for complete list of required test IDs.

## 🐛 Debugging

### Local Debugging

```bash
# Visible browser
HEADLESS=false npm run test:e2e

# Specific feature
npx cucumber-js tests/e2e/features/authentication.feature

# Specific scenario (line number)
npx cucumber-js tests/e2e/features/authentication.feature:9
```

### Using Tags

```gherkin
@smoke @critical
Scenario: Important test
  ...

@flaky
Scenario: Sometimes fails
  ...
```

Run by tags:
```bash
npx cucumber-js --tags "@smoke"
npx cucumber-js --tags "not @flaky"
npx cucumber-js --tags "@smoke and @critical"
```

## 🔍 Troubleshooting

### Tests Fail Locally

1. ✅ Check database is running: `docker-compose up -d db`
2. ✅ Check `.env` file exists
3. ✅ Run migrations: `npx prisma migrate deploy`
4. ✅ Ensure app runs on `localhost:3000`

### Tests Fail in CI

1. Check GitHub Actions logs
2. Download artifacts (screenshots, videos)
3. Review Docker Compose logs
4. Check environment variables

### TypeScript Errors

Cucumber types load after installation:
```bash
npm install
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

## 🎯 Best Practices

1. **Use Page Objects**: Encapsulate page interactions
2. **Use data-testid**: Stable selectors independent of UI changes
3. **Write Independent Scenarios**: Each scenario should run standalone
4. **Use Background**: For common setup across scenarios
5. **Tag Tests**: @smoke, @regression, @flaky for organization
6. **Keep Steps Reusable**: Generic steps work across features
7. **Add Screenshots on Failure**: Automatically captured

## 🚀 Running with Docker Compose

### Local Development

```bash
# Start all services
docker-compose up -d

# Run tests
npm run test:e2e

# Stop services
docker-compose down
```

### CI/CD

GitHub Actions automatically:
1. Starts services with `docker-compose up -d`
2. Waits for services to be ready
3. Runs migrations
4. Executes tests
5. Cleans up with `docker-compose down -v`

## 📞 Support

For more information, see:
- `tests/README.md` - Detailed test documentation
- `docs/TEST_ATTRIBUTES.md` - Frontend test attribute guide
