// ============================================================
// SchemeSetu - Splash Screen
// App intro screen with logo, tagline, and animations
// ============================================================

import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

export function SplashScreen() {
  const { setScreen } = useApp();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    // Navigate to login after 2.5s
    const timer = setTimeout(() => {
      setScreen('login');
    }, 2600);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [setScreen]);

  return (
    <div
      className="relative flex flex-col items-center justify-between min-h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0D1F4E 0%, #1A3A6B 35%, #2E5BA8 65%, #FF6B35 100%)',
      }}
    >
      {/* Background decorative circles */}
      <div
        className="absolute top-0 right-0 opacity-10"
        style={{
          width: '350px', height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #FF6B35 0%, transparent 70%)',
          transform: 'translate(30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 opacity-10"
        style={{
          width: '300px', height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #FF6B35 0%, transparent 70%)',
          transform: 'translate(-30%, 30%)',
        }}
      />

      {/* Ashoka Chakra decorative watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="opacity-5 text-white"
          style={{ fontSize: '60vw', lineHeight: 1 }}
        >
          ☸
        </div>
      </div>

      {/* Top area — Govt badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="pt-14 flex flex-col items-center"
      >
        <div
          className="px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <p className="text-white/70 text-xs font-medium tracking-widest uppercase">
            🇮🇳 Government of India Initiative
          </p>
        </div>
      </motion.div>

      {/* Center — Logo and tagline */}
      <div className="flex flex-col items-center gap-6 px-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7, type: 'spring', bounce: 0.4 }}
          className="relative"
        >
          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-3xl blur-2xl"
            style={{ background: 'rgba(255,107,53,0.4)', transform: 'scale(1.2)' }}
          />
          {/* Logo container */}
          <div
            className="relative w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #E55A25)' }}
          >
            <img
              src="/images/logo.png"
              alt="SchemeSetu Logo"
              className="w-20 h-20 object-contain"
              onError={e => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* Fallback text logo */}
            <span className="absolute text-white font-black text-3xl">स</span>
          </div>
        </motion.div>

        {/* App name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col items-center gap-2"
        >
          <h1 className="text-white font-black text-4xl tracking-tight">
            Scheme<span style={{ color: '#FF8C5A' }}>Setu</span>
          </h1>
          <div className="flex items-center gap-1">
            <div className="h-px w-8 bg-white/30" />
            <p className="text-white/50 text-[10px] font-semibold tracking-widest uppercase">
              AI Powered
            </p>
            <div className="h-px w-8 bg-white/30" />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-white/90 text-lg font-semibold leading-snug">
            Find Government Schemes
          </p>
          <p className="text-white/70 text-base">
            You Qualify For
          </p>
          <p className="mt-2 text-white/40 text-sm font-medium">
            अपनी योग्यता के अनुसार योजनाएं खोजें
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {['🎓 Scholarships', '🌾 Farmers', '👩 Women', '🏥 Health'].map(tag => (
            <span
              key={tag}
              className="text-xs font-medium px-3 py-1.5 rounded-full border border-white/15 text-white/60"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom — Loading bar and info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="w-full px-10 pb-14 flex flex-col items-center gap-4"
      >
        {/* Progress bar */}
        <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #FF6B35, #FF8C5A)',
            }}
          />
        </div>

        <p className="text-white/30 text-xs text-center">
          Version 1.0.0 • Made in India 🇮🇳
        </p>
      </motion.div>
    </div>
  );
}
