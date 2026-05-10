export interface Currency {
  code: string;
  name: string;
  symbol: string;
  locale: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'CZK';
