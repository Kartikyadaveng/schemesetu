// ============================================================
// SchemeSetu - MobileFrame Component
// Wraps the app in a mobile device frame for desktop viewing
// ============================================================

import { ReactNode } from 'react';
import { useApp } from '../../context/AppContext';

interface MobileFrameProps {
  children: ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  const { isDark } = useApp();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #0D1117 0%, #1A2840 50%, #0D1117 100%)'
          : 'linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #fff0e8 100%)',
      }}
    >
      {/* Desktop: Show in phone frame */}
      <div className="hidden md:flex flex-col items-center gap-4">
        {/* App name above frame */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #E55A25)' }}
          >
            S
          </div>
          <span className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
            SchemeSetu
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: '#FF6B35', color: 'white' }}
          >
            Preview
          </span>
        </div>

        {/* Phone frame */}
        <div
          className="relative rounded-[3rem] overflow-hidden shadow-2xl"
          style={{
            width: '393px',
            height: '852px',
            border: isDark ? '10px solid #2D3748' : '10px solid #1A202C',
            boxShadow: '0 50px 100px rgba(0,0,0,0.4), inset 0 0 0 2px rgba(255,255,255,0.1)',
          }}
        >
          {/* Notch */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50 rounded-b-2xl"
            style={{
              width: '126px',
              height: '37px',
              background: isDark ? '#2D3748' : '#1A202C',
            }}
          />
          {/* Screen content */}
          <div className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
            {children}
          </div>
        </div>

        {/* Info below */}
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Mobile preview — scroll inside the device
        </p>
      </div>

      {/* Mobile: Full screen */}
      <div className="md:hidden w-full min-h-screen overflow-hidden">
        {children}
      </div>
    </div>
  );
}
