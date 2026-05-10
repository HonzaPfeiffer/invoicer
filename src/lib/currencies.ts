import currenciesData from '@/config/currencies.json';
import { Currency, CurrencyCode } from '@/types/currency';

export const currencies: Currency[] = currenciesData;

export function getCurrency(code: string): Currency | undefined {
  return currencies.find(c => c.code === code);
}

export function getCurrencyCodes(): CurrencyCode[] {
  return currencies.map(c => c.code as CurrencyCode);
}

export function formatCurrency(amount: number, currencyCode: string, locale?: string): string {
  const currency = getCurrency(currencyCode);
  const useLocale = locale || currency?.locale || 'en-US';
  
  return new Intl.NumberFormat(useLocale, {
    style: 'currency',
    currency: currencyCode
  }).format(amount);
}
