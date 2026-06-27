# E2E Testy s Playwright a Cucumber

Tento projekt obsahuje end-to-end testy napsané v Gherkin syntaxi s využitím Playwright a Cucumber.

## Struktura testů

```
tests/
├── e2e/
│   ├── features/           # Gherkin feature soubory
│   │   ├── authentication.feature
│   │   ├── invoices.feature
│   │   └── company-settings.feature
│   ├── steps/              # Step definitions
│   │   ├── authentication.steps.ts
│   │   ├── invoices.steps.ts
│   │   └── company-settings.steps.ts
│   └── support/            # Pomocné soubory
│       ├── world.ts        # Custom World s Playwright integrací
│       └── hooks.ts        # Before/After hooks
```

## Instalace

```bash
npm install
```

## Spuštění testů

### Lokálně

```bash
# Spustit všechny testy (headless mode)
npm run test:e2e

# Spustit testy s viditelným prohlížečem
npm run test:e2e:headed

# Spustit testy v UI módu
npm run test:e2e:ui
```

### Před spuštěním testů

Ujistěte se, že:
1. Databáze je spuštěná a dostupná
2. Máte nastavené environment variables v `.env` souboru
3. Aplikace je buildnutá nebo běží dev server

## GitHub Actions

Testy se automaticky spouštějí:
- **Push/Pull Request** na `main` nebo `develop` větev
- **Naplánovaně** každý den ve 2:00 (všechny prohlížeče)
- **Manuálně** přes GitHub Actions UI

### Workflow soubory

- `.github/workflows/e2e-tests.yml` - Základní E2E testy (Chromium)
- `.github/workflows/scheduled-tests.yml` - Naplánované testy (všechny prohlížeče)

## Psaní nových testů

### 1. Vytvořit Feature soubor

```gherkin
# language: cs
Vlastnost: Název funkcionality
  Jako uživatel
  Chci něco udělat
  Abych dosáhl nějakého cíle

  Scénář: Název scénáře
    Pokud udělám akci A
    A udělám akci B
    Pak by měl nastat výsledek C
```

### 2. Implementovat Step Definitions

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('udělám akci A', async function (this: CustomWorld) {
  await this.page!.goto('/some-page');
});

When('udělám akci B', async function (this: CustomWorld) {
  await this.page!.click('button');
});

Then('by měl nastat výsledek C', async function (this: CustomWorld) {
  await expect(this.page!.locator('text=Success')).toBeVisible();
});
```

## Konfigurace

### Cucumber (`cucumber.js`)

- **Formát reportů**: Progress, HTML, JSON
- **Paralelní běh**: 2 workery
- **Retry**: 1x pro @flaky testy

### Playwright (`playwright.config.ts`)

- **Prohlížeče**: Chromium, Firefox, WebKit, Mobile Chrome
- **Base URL**: `http://localhost:3000`
- **Screenshots**: Pouze při selhání
- **Video**: Pouze při selhání
- **Trace**: Při prvním retry

## Výstupy testů

Po spuštění testů najdete:

- `test-results/cucumber-report.html` - HTML report
- `test-results/cucumber-report.json` - JSON report
- `test-results/screenshots/` - Screenshots při selhání
- `test-results/videos/` - Videa při selhání

## Tipy

### Debugging

```bash
# Spustit s viditelným prohlížečem
HEADLESS=false npm run test:e2e

# Spustit konkrétní feature
npx cucumber-js tests/e2e/features/authentication.feature

# Spustit konkrétní scénář
npx cucumber-js tests/e2e/features/authentication.feature:10
```

### Tagy

Můžete používat tagy pro organizaci testů:

```gherkin
@smoke @authentication
Scénář: Přihlášení uživatele
  ...

@flaky
Scénář: Občas padající test
  ...
```

Spuštění podle tagů:
```bash
npx cucumber-js --tags "@smoke"
npx cucumber-js --tags "not @flaky"
```

## CI/CD

V GitHub Actions jsou testy spouštěny s:
- PostgreSQL databází (service container)
- Node.js 20
- Chromium prohlížečem (nebo všechny v scheduled workflow)
- Automatickým uploadem artefaktů při selhání

## Troubleshooting

### Testy padají lokálně

1. Zkontrolujte, že běží databáze
2. Zkontrolujte `.env` soubor
3. Spusťte `npx prisma migrate deploy`
4. Ujistěte se, že aplikace běží na `localhost:3000`

### Testy padají v CI

1. Zkontrolujte GitHub Actions logy
2. Stáhněte si artefakty (screenshots, videos)
3. Zkontrolujte environment variables v workflow

### TypeScript chyby

Po instalaci nových závislostí spusťte:
```bash
npm install
```

Cucumber types by měly být automaticky rozpoznány po instalaci `@cucumber/cucumber`.
