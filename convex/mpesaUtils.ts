// MPESA Utility Functions

/**
 * Generate timestamp in format YYYYMMDDHHmmss
 * Uses Africa/Nairobi timezone
 */
export function getTimeStamp(): string {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      map[part.type] = part.value;
    }
  }

  return `${map.year}${map.month}${map.day}${map.hour}${map.minute}${map.second}`;
}

/**
 * Generate MPESA STK Push password
 * Password is Base64 encoded string of BusinessShortCode + PassKey + Timestamp
 */
export function generatePassword(
  businessShortCode: string,
  passKey: string,
  timestamp: string
): string {
  const passwordString = `${businessShortCode.trim()}${passKey.trim()}${timestamp.trim()}`;
  return typeof Buffer !== "undefined"
    ? Buffer.from(passwordString).toString("base64")
    : btoa(passwordString);
}

/**
 * Format phone number to MPESA format (254...)
 * Handles 07..., 01..., +254..., 254..., 7...
 */
export function formatPhoneNumber(phoneNumber: string): string {
  let cleaned = phoneNumber.replace(/[\s\-+]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "254" + cleaned.slice(1);
  } else if (cleaned.startsWith("7") || cleaned.startsWith("1")) {
    cleaned = "254" + cleaned;
  }
  return cleaned;
}

/**
 * Get MPESA API base URL based on environment
 */
export function getMpesaBaseUrl(environment: "sandbox" | "production"): string {
  if (environment === "production") {
    return "https://api.safaricom.co.ke";
  }
  return "https://sandbox.safaricom.co.ke";
}
