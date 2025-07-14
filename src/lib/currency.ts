// lib/currency.ts
export const CURRENCY_RATES = {
  USD: 1,
  INR: 85,
  EUR: 0.92,
  GBP: 0.78,
} as const;

export type CurrencyCode = keyof typeof CURRENCY_RATES;


export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
};

export const convert = (usd: number, code: CurrencyCode) =>
  usd * (CURRENCY_RATES[code] ?? 1);

export const format = (amount: number, code: CurrencyCode) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 4,
  }).format(amount);
