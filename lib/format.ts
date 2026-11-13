const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const currencyWhole = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const formatCurrency = (value: number) => currency.format(value);
export const formatCurrencyWhole = (value: number) => currencyWhole.format(value);
export const formatPercent = (value: number, digits = 2) =>
  `${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: digits })}%`;
