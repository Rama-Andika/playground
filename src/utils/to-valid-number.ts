export function toValidNumber(value: any, fallback = 0): any {
  if (typeof value === "string") {
    // Hapus semua spasi
    value = value.trim();
    // Ganti format US (10,000.20) -> 10000.20
    value = value.replace(/,/g, "");

    if (value.includes(".")) return value;
  }

  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}
