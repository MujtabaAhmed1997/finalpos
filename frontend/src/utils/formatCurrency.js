export function formatCurrency(amount) {
  const num = parseFloat(amount);
  const value = Number.isNaN(num) ? 0 : num;
  const formatted = value.toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `Rs ${formatted}`;
}
