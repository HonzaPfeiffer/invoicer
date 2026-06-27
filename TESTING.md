# Testování Invoicer aplikace

## Přehled

Projekt používá **Playwright** s **Cucumber (Gherkin)** pro end-to-end testování. Testy jsou napsané v češtině pomocí Gherkin syntaxe.

## 🚀 Rychlý start

### 1. Instalace

Závislosti jsou již nainstalovány. Pokud potřebujete reinstalovat:

```bash
npm install
```

### 2. Instalace Playwright prohlížečů

```bash
npx playwright install
```

### 3. Spuštění testů

```bash
# Všechny testy (headless)
npm run test:e2e

# S viditelným prohlížečem
npm run test:e2e:headed

# UI mód (interaktivní)
npm run test:e2e:ui
```

## 📁 Struktura testů

```
tests/
├── README.md                    # Detailní dokumentace
├── e2e/
│   ├── features/               # Gherkin feature soubory
│   │   ├── authentication.feature
│   │   ├── invoices.feature
│   │   ├── company-settings.feature
│   │   └── .feature-template   # Šablona pro nové testy
│   ├── steps/                  # Step definitions (implementace kroků)
│   │   ├── authentication.steps.ts
│   │   ├── invoices.steps.ts
│   │   └── company-settings.steps.ts
│   └── support/                # Pomocné soubory
│       ├── world.ts            # Playwright integrace
│       └── hooks.ts            # Before/After hooks
```

## 📝 Existující testy

### 1. Autentizace (`authentication.feature`)
- ✅ Úspěšné přihlášení
- ✅ Neúspěšné přihlášení s nesprávným heslem
- ✅ Registrace nového uživatele

### 2. Správa faktur (`invoices.feature`)
- ✅ Vytvoření nové faktury
- ✅ Zobrazení detailu faktury
- ✅ Úprava faktury
- ✅ Smazání faktury
- ✅ Export faktury do PDF

### 3. Nastavení společnosti (`company-settings.feature`)
- ✅ Zobrazení nastavení společnosti
- ✅ Aktualizace informací o společnosti

## 🔧 Konfigurace

### Cucumber (`cucumber.js`)
- Paralelní běh: 2 workery
- Formáty reportů: Progress, HTML, JSON
- Retry: 1x pro @flaky testy

### Playwright (`playwright.config.ts`)
- Prohlížeče: Chromium, Firefox, WebKit, Mobile Chrome
- Base URL: `http://localhost:3000`
- Screenshots a videa při selhání
- Trace při prvním retry

## 🤖 GitHub Actions

### Automatické spouštění

Testy se spouštějí automaticky při:
- **Push** na `main` nebo `develop`
- **Pull Request** na `main` nebo `develop`
- **Naplánovaně** každý den ve 2:00 (všechny prohlížeče)
- **Manuálně** přes GitHub Actions UI

### Workflow soubory

1. **`.github/workflows/e2e-tests.yml`**
   - Spouští se při push/PR
   - Testuje v Chromium
   - Nahrává artefakty při selhání

2. **`.github/workflows/scheduled-tests.yml`**
   - Spouští se naplánovaně
   - Testuje ve všech prohlížečích (Chromium, Firefox, WebKit)
   - Matrix strategie pro paralelní běh

### Artefakty v CI

Po běhu testů jsou dostupné:
- HTML report (Cucumber)
- JSON report
- Screenshots (při selhání)
- Videa (při selhání)

## 📊 Výstupy testů

Po spuštění najdete:

```
test-results/
├── cucumber-report.html    # HTML report
├── cucumber-report.json    # JSON report
├── screenshots/            # Screenshots při selhání
└── videos/                 # Videa při selhání
```

## ✍️ Psaní nových testů

### 1. Vytvořit feature soubor

Použijte šablonu v `tests/e2e/features/.feature-template`:

```gherkin
# language: cs
Vlastnost: Správa klientů
  Jako uživatel
  Chci spravovat klienty
  Abych mohl vytvářet faktury

  Scénář: Přidání nového klienta
    Pokud jsem přihlášený uživatel
    A kliknu na tlačítko "Noví klient"
    A vyplním formulář klienta
      | jméno  | Test Client s.r.o. |
      | email  | test@client.com    |
    A kliknu na tlačítko "Uložit"
    Pak by měl vidět zprávu "Klient byl vytvořen"
```

### 2. Implementovat step definitions

Vytvořte soubor v `tests/e2e/steps/`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When('vyplním formulář klienta', async function (this: CustomWorld, dataTable) {
  const data = dataTable.rowsHash();
  await this.page!.fill('input[name="name"]', data.jméno);
  await this.page!.fill('input[name="email"]', data.email);
});
```

## 🐛 Debugging

### Lokální debugging

```bash
# Viditelný prohlížeč
HEADLESS=false npm run test:e2e

# Konkrétní feature
npx cucumber-js tests/e2e/features/authentication.feature

# Konkrétní scénář (číslo řádku)
npx cucumber-js tests/e2e/features/authentication.feature:10
```

### Použití tagů

```gherkin
@smoke @critical
Scénář: Důležitý test
  ...

@flaky
Scénář: Občas padající test
  ...
```

Spuštění:
```bash
npx cucumber-js --tags "@smoke"
npx cucumber-js --tags "not @flaky"
npx cucumber-js --tags "@smoke and @critical"
```

## 🔍 Troubleshooting

### Testy padají lokálně

1. ✅ Zkontrolujte běžící databázi
2. ✅ Zkontrolujte `.env` soubor
3. ✅ Spusťte `npx prisma migrate deploy`
4. ✅ Ujistěte se, že aplikace běží na `localhost:3000`

### TypeScript chyby

Cucumber types se načtou po instalaci:
```bash
npm install
```

### CI selhává

1. Zkontrolujte GitHub Actions logy
2. Stáhněte artefakty (screenshots, videos)
3. Zkontrolujte environment variables

## 📚 Další zdroje

- [Playwright dokumentace](https://playwright.dev/)
- [Cucumber dokumentace](https://cucumber.io/docs/cucumber/)
- [Gherkin reference](https://cucumber.io/docs/gherkin/reference/)

## 🎯 Best Practices

1. **Používejte Gherkin v češtině** - testy jsou čitelnější pro celý tým
2. **Pište nezávislé scénáře** - každý scénář by měl být spustitelný samostatně
3. **Používejte Pozadí** pro společný setup
4. **Tagujte testy** (@smoke, @regression, @flaky)
5. **Udržujte step definitions znovupoužitelné**
6. **Přidávejte screenshots při selhání** (automaticky)

## 📞 Podpora

Pro více informací viz `tests/README.md` nebo kontaktujte tým.
