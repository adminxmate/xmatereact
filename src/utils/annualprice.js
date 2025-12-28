export const convertPrice = (basePrice, billingCycle) => {
  if (billingCycle.toLowerCase() === "yearly") {
    const yearlyPrice = basePrice * 12;
    const discountedPrice = yearlyPrice * 0.9; // ✅ apply 10% discount
    return discountedPrice;
  }
  return basePrice; // monthly = base price
};
