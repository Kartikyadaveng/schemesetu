// ============================================================
// SchemeSetu - Login Screen
// Clean auth screen with email/password and social login
// ============================================================

import { useState } from 'react';
import { Mail, Lock, ArrowRight, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion } from 'framer-motion';

export function LoginScreen() {
  const { login, loginAsGuest, loginWithGoogle, setScreen, isLoading, isDark } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Minimum 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: isDark ? '#0D1117' : '#F8F9FF' }}
    >
      {/* Top gradient header */}
      <div
        className="relative pt-12 pb-10 px-6 flex flex-col items-center"
        style={{
          background: isDark
            ? 'linear-gradient(160deg, #0D1F4E, #1A3A6B)'
            : 'linear-gradient(160deg, #1A3A6B, #2E5BA8)',
          borderBottomLeftRadius: '40px',
          borderBottomRightRadius: '40px',
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'linear-gradient(135deg, #FF6B35, #E55A25)' }}
        >
          <span className="text-white font-black text-2xl">स</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white font-black text-2xl"
        >
          Welcome Back! 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-white/60 text-sm mt-1"
        >
          Sign in to access your schemes
        </motion.p>
      </div>

      {/* Form area */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex-1 px-5 pt-8 pb-6 flex flex-col gap-5"
      >
        {/* Google Sign-in button */}
        <button
          onClick={loginWithGoogle}
          className={`
            w-full flex items-center justify-center gap-3
            py-3.5 px-4 rounded-2xl border-2
            transition-all duration-200 active:scale-[0.98]
            font-semibold text-sm
            ${isDark
              ? 'bg-gray-800 border-gray-700 text-white hover:border-gray-600'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 shadow-sm'
            }
          `}
        >
          {/* Google G icon */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            or login with email
          </span>
          <div className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        </div>

        {/* Email input */}
        <Input
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={errors.email}
          leftIcon={<Mail size={18} />}
        />

        {/* Password input */}
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={errors.password}
          leftIcon={<Lock size={18} />}
        />

        {/* Forgot password */}
        <div className="text-right -mt-2">
          <button className="text-sm font-semibold" style={{ color: '#FF6B35' }}>
            Forgot Password?
          </button>
        </div>

        {/* Login button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          onClick={handleLogin}
          rightIcon={<ArrowRight size={18} />}
        >
          Login to SchemeSetu
        </Button>

        {/* Guest option */}
        <button
          onClick={loginAsGuest}
          className={`
            w-full py-3 rounded-2xl border-2 border-dashed
            flex items-center justify-center gap-2
            text-sm font-semibold transition-all duration-200 active:scale-[0.98]
            ${isDark
              ? 'border-gray-700 text-gray-400 hover:border-gray-600'
              : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }
          `}
        >
          Continue as Guest
          <ChevronRight size={16} />
        </button>

        {/* Sign up link */}
        <p className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Don't have an account?{' '}
          <button
            onClick={() => setScreen('signup')}
            className="font-bold"
            style={{ color: '#FF6B35' }}
          >
            Sign up here
          </button>
        </p>
      </motion.div>

      {/* Bottom info */}
      <p className={`text-center text-xs pb-6 px-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
        By continuing, you agree to our{' '}
        <span style={{ color: '#FF6B35' }}>Terms of Service</span> &{' '}
        <span style={{ color: '#FF6B35' }}>Privacy Policy</span>
      </p>
    </div>
  );
}
