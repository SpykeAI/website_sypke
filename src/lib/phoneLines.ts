/**
 * Spyke AI Phone Lines Configuration
 * Provides available outbound calling and SMS numbers.
 */

export interface PhoneLine {
  id: string;
  number: string;
  label: string;
  formatted: string;
  flag: string;
  badge: string;
  type: "Voice & SMS" | "Toll-Free" | "Direct Line" | "Support";
  isDefault?: boolean;
}

export const DEFAULT_PHONE_LINES: PhoneLine[] = [
  {
    id: "primary-us",
    number: "+13464770028",
    label: "Primary US Line",
    formatted: "+1 (346) 477-0028",
    flag: "🇺🇸",
    badge: "Live WebRTC & SMS",
    type: "Voice & SMS",
    isDefault: true,
  },
  {
    id: "toll-free-us",
    number: "+18007795324",
    label: "Toll-Free Support",
    formatted: "+1 (800) 779-5324",
    flag: "🇺🇸",
    badge: "Toll-Free (US/CA)",
    type: "Toll-Free",
  },
  {
    id: "sales-ca",
    number: "+14158907821",
    label: "Sales & Demo Line",
    formatted: "+1 (415) 890-7821",
    flag: "🇺🇸",
    badge: "California Direct",
    type: "Direct Line",
  },
  {
    id: "support-in",
    number: "+918045678901",
    label: "India Support Line",
    formatted: "+91 (80) 4567-8901",
    flag: "🇮🇳",
    badge: "Bangalore Office",
    type: "Support",
  },
];

export function getAvailableLines(primaryNumber?: string): PhoneLine[] {
  const primary = (primaryNumber || "+13464770028").replace(/^["']|["']$/g, "").trim();
  const lines = [...DEFAULT_PHONE_LINES];

  const existingIdx = lines.findIndex((l) => l.number === primary);
  if (existingIdx !== -1) {
    lines[existingIdx].isDefault = true;
  } else if (primary) {
    lines.unshift({
      id: "active-telnyx",
      number: primary,
      label: "Active Telnyx Line",
      formatted: primary,
      flag: primary.startsWith("+91") ? "🇮🇳" : "🇺🇸",
      badge: "Connected Line",
      type: "Voice & SMS",
      isDefault: true,
    });
  }

  return lines;
}
