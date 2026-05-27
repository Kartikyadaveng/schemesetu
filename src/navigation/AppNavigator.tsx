// ============================================================
// SchemeSetu - App Navigator
// Client-side navigation controller — renders the active screen
// ============================================================

import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

// Screen imports
import { SplashScreen }           from '../screens/SplashScreen';
import { LoginScreen }            from '../screens/LoginScreen';
import { SignupScreen }           from '../screens/SignupScreen';
import { OnboardingScreen }       from '../screens/OnboardingScreen';
import { HomeScreen }             from '../screens/HomeScreen';
import { ChatScreen }             from '../screens/ChatScreen';
import { SchemeDetailScreen }     from '../screens/SchemeDetailScreen';
import { SavedScreen }            from '../screens/SavedScreen';
import { NotificationsScreen }    from '../screens/NotificationsScreen';
import { ProfileScreen }          from '../screens/ProfileScreen';
import { EditProfileScreen }      from '../screens/EditProfileScreen';
import { CategorySchemesScreen }  from '../screens/CategorySchemesScreen';
import { AllSchemesScreen }       from '../screens/AllSchemesScreen';

// Screen animation variants
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -20 },
};

const splashVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0, scale: 1.1 },
};

export function AppNavigator() {
  const { currentScreen, isAuthLoading } = useApp();

  // ── HARD AUTH GATE ───────────────────────────────────────────────
  // While Firebase is resolving the session, ALWAYS render the splash
  // screen. NEVER render any other screen (especially the login screen)
  // during this phase.
  // ──────────────────────────────────────────────────────────────────
  if (isAuthLoading) {
    return <SplashScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':           return <SplashScreen />;
      case 'login':            return <LoginScreen />;
      case 'signup':           return <SignupScreen />;
      case 'onboarding':       return <OnboardingScreen />;
      case 'home':             return <HomeScreen />;
      case 'chat':             return <ChatScreen />;
      case 'schemeDetail':     return <SchemeDetailScreen />;
      case 'saved':            return <SavedScreen />;
      case 'notifications':    return <NotificationsScreen />;
      case 'profile':          return <ProfileScreen />;
      case 'editProfile':      return <EditProfileScreen />;
      case 'categorySchemes':  return <CategorySchemesScreen />;
      case 'allSchemes':       return <AllSchemesScreen />;
      default:                 return <LoginScreen />;
    }
  };

  const isSplash = currentScreen === 'splash';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentScreen}
        variants={isSplash ? splashVariants : pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="w-full h-full"
      >
        {renderScreen()}
      </motion.div>
    </AnimatePresence>
  );
}
