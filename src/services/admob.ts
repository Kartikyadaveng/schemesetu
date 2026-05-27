// ============================================================
// SchemeSetu - AdMob Service (Setup Placeholder)
// Integration guide for Google AdMob
// ============================================================

/**
 * ADMOB SETUP GUIDE (React Native / Expo)
 * ══════════════════════════════════════════════════════════
 *
 * For React Native/Expo (the actual mobile app):
 *
 * Step 1: Install
 *   npx expo install react-native-google-mobile-ads
 *
 * Step 2: Configure app.json / app.config.js
 *   {
 *     "expo": {
 *       "plugins": [
 *         [
 *           "react-native-google-mobile-ads",
 *           {
 *             "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
 *             "iosAppId":     "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
 *           }
 *         ]
 *       ]
 *     }
 *   }
 *
 * Step 3: Get your Ad Unit IDs from AdMob console
 *   https://admob.google.com
 *
 * Step 4: Use TEST IDs during development:
 * ══════════════════════════════════════════════════════════
 */

export const ADMOB_CONFIG = {
  // Replace with real IDs from AdMob console
  // Use test IDs during development!
  android: {
    appId:        'ca-app-pub-3940256099942544~3347511713',   // TEST App ID
    bannerAdUnit: 'ca-app-pub-3940256099942544/6300978111',   // TEST Banner
    interstitial: 'ca-app-pub-3940256099942544/1033173712',   // TEST Interstitial
    rewarded:     'ca-app-pub-3940256099942544/5224354917',   // TEST Rewarded
  },
  ios: {
    appId:        'ca-app-pub-3940256099942544~1458002511',   // TEST App ID
    bannerAdUnit: 'ca-app-pub-3940256099942544/2934735716',   // TEST Banner
    interstitial: 'ca-app-pub-3940256099942544/4411468910',   // TEST Interstitial
    rewarded:     'ca-app-pub-3940256099942544/1712485313',   // TEST Rewarded
  },
};

/**
 * AD PLACEMENT STRATEGY:
 * ══════════════════════════════════════════════════════
 *
 * 1. Banner Ad    → Bottom of Home screen (320x50)
 * 2. Banner Ad    → Notifications screen (320x50)
 * 3. Interstitial → After 3rd scheme view (full-screen)
 * 4. Rewarded Ad  → "Unlock AI features for free" (30s video)
 *
 * PLACEMENT RULES (Google Policy):
 *   ✓ Do not place ads on auth screens
 *   ✓ Do not place ads near action buttons (Apply Now)
 *   ✓ Always show "Advertisement" label
 *   ✓ Do not auto-trigger interstitials on first app open
 */

/**
 * REACT NATIVE CODE EXAMPLE:
 * ══════════════════════════════════════════════════════
 *
 * import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
 *
 * // Banner Ad Component
 * export function SchemeBannerAd() {
 *   return (
 *     <BannerAd
 *       unitId={TestIds.BANNER}  // Replace with real ID in production
 *       size={BannerAdSize.BANNER}
 *       requestOptions={{ requestNonPersonalizedAdsOnly: true }}
 *     />
 *   );
 * }
 */

// Web preview placeholder component (returns null in web build)
export function AdBannerPlaceholder({ label: _label = 'Advertisement • 320×50' }: { label?: string }) {
  return null; // Replaced by actual AdMob in native build
}
