// ============================================================
// SchemeSetu — AI-Powered Indian Government Scheme Finder
// Main App entry point
// ============================================================

import { AppProvider } from './context/AppContext';
import { AppNavigator } from './navigation/AppNavigator';
import { MobileFrame } from './components/ui/MobileFrame';

/**
 * Root Application Component
 *
 * Architecture:
 * AppProvider   → Global state (auth, theme, bookmarks, navigation)
 * MobileFrame   → Phone-frame wrapper (desktop preview mode)
 * AppNavigator  → Screen router
 */
export default function App() {
  return (
    <AppProvider>
      <MobileFrame>
        <AppNavigator />
      </MobileFrame>
    </AppProvider>
  );
}
