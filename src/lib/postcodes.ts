/** Normalise UK postcode for lookup (e.g. "LU6 3BS" → "LU63BS") */
export function normalisePostcode(input: string): string {
  return input.toUpperCase().replace(/\s+/g, "");
}

/** Format for display (outward + inward) */
export function formatPostcode(normalised: string): string {
  if (normalised.length <= 3) return normalised;
  return `${normalised.slice(0, -3)} ${normalised.slice(-3)}`;
}

export function isValidUkPostcodeFormat(input: string): boolean {
  const n = normalisePostcode(input);
  return /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/.test(n);
}
