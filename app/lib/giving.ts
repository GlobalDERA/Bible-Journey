// GIVING SERVICE - Ministry donations (NOT App Store subscription)
// Why links, simple: Apple takes 30% of in-app digital purchases,
// but charitable giving/tithes MUST go via external browser (allowed by Apple).
// So Give button opens your Paystack/Flutterwave/Stripe page. $0 code, small fee per gift only.

import { Linking } from 'react-native';

export const GIVE_AMOUNTS = [500, 1000, 5000, 10000];
export const GIVE_CURRENCY = '₦'; // change to $ in .env if US: EXPO_PUBLIC_GIVE_CURRENCY=$

export function getGivingUrl(amount?: number): string | null {
  const base = process.env.EXPO_PUBLIC_GIVING_URL || '';
  if (!base || base.includes('paste-')) return null;
  if (!amount) return base;
  // Paystack/Flutterwave payment links accept ?amount= ; Stripe uses fixed links (ignore amount)
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}amount=${amount * 100}`; // kobo/cents
}

export async function openGiving(amount?: number): Promise<string> {
  const url = getGivingUrl(amount);
  if (!url) {
    return 'Giving link not set yet. Add EXPO_PUBLIC_GIVING_URL in app/.env (see guide), restart with -c.';
  }
  try {
    await Linking.openURL(url);
    return `Opening giving page${amount ? ` for ${GIVE_CURRENCY}${amount}` : ''}...`;
  } catch {
    return `Could not open link. Copy manually: ${url}`;
  }
}
