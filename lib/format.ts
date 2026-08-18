const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(amount: number): string {
  return currencyFormatter.format(amount);
}

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export function formatVnd(amount: number): string {
  return vndFormatter.format(amount);
}
