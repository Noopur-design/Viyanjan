// Prices are stored as integers in minor units (paise). Helpers keep
// formatting in one place so the UI never does float math.

export function formatPrice(minor: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(minor / 100);
}
