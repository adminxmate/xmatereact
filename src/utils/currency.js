// utils/currency.js

// Return currency symbol
export const getCurrencySymbol = (currency) => {
  switch (currency?.toUpperCase()) {
    case "USD":
      return "$";
    case "INR":
      return "₹";
    case "EUR":
      return "€";
    default:
      return currency;
  }
};

// Convert price from USD to selected currency
export const convertCurrency = (priceInUSD, currency) => {
  switch (currency?.toUpperCase()) {
    case "INR":
      return priceInUSD * 90; // ✅ USD → INR
    case "EUR":
      return priceInUSD * 0.85; // ✅ USD → EUR
    case "USD":
    default:
      return priceInUSD; // ✅ keep USD as base
  }
};
