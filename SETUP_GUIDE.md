# 🇮🇳 SchemeSetu — Setup & Developer Guide

## AI-Powered Indian Government Scheme Finder

---

## 📁 Project Structure

```
SchemeSetu/
├── public/
│   └── images/
│       ├── logo.png            # App logo
│       ├── ai-avatar.png       # AI chat avatar
│       ├── empty-saved.png     # Empty state illustration
│       ├── hero-illustration.png
│       └── splash-bg.png       # Splash background
│
├── src/
│   ├── config/                 # Configuration
│   │   ├── env.ts              # Environment variable loader (OpenRouter)
│   │   └── prompts.ts          # AI system prompt (provider-agnostic)
│   │
│   ├── components/
│   │   ├── ui/                 # Shared UI components
│   │   │   ├── MobileFrame.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── SchemeCard.tsx
│   │   │   └── CategoryCard.tsx
│   │   │
│   │   └── chat/               # AI Chat components
│   │       ├── ChatBubble.tsx       # Message bubble with copy/retry
│   │       ├── TypingIndicator.tsx  # Bouncing dots animation
│   │       └── SuggestedPrompts.tsx # Quick prompt buttons
│   │
│   ├── context/
│   │   └── AppContext.tsx      # Global state
│   │
│   ├── navigation/
│   │   └── AppNavigator.tsx    # Screen router
│   │
│   ├── screens/                # All screen components
│   │   ├── SplashScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ChatScreen.tsx      # Uses OpenRouter AI via openrouterService
│   │   ├── SchemeDetailScreen.tsx
│   │   ├── SavedScreen.tsx
│   │   ├── NotificationsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── CategorySchemesScreen.tsx
│   │
│   ├── services/
│   │   ├── ai/                 # AI provider service
│   │   │   └── openrouterService.ts  # OpenRouter API via OpenAI SDK
│   │   ├── firebase.ts         # Firebase config
│   │   ├── admob.ts            # AdMob config
│   │   └── schemeService.ts    # Scheme CRUD operations
│   │
│   ├── utils/
│   │   ├── cn.ts               # Tailwind merge utility
│   │   └── markdown.tsx        # Markdown renderer for AI responses
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── strings.ts
│   │   ├── dummyData.ts
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env                        # API keys (gitignored)
├── .env.example                # Example env file
├── .gitignore
├── index.html
├── SETUP_GUIDE.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up OpenRouter API Key
1. Go to https://openrouter.ai/keys
2. Sign in with your Google/GitHub account
3. Click **"Create Key"**
4. Copy the key (starts with `sk-or-v1-...`)

### 3. Configure Environment
Create a `.env` file in the project root:
```bash
# .env
EXPO_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### 4. Start the App
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

---

## 🤖 OpenRouter AI Integration Details

### How It Works

The AI assistant uses **OpenRouter** as the API gateway with the **DeepSeek R1 (free)** model via the OpenAI SDK compatibility layer.

### Key Files

| File | Purpose |
|------|---------|
| `src/config/env.ts` | Loads `EXPO_PUBLIC_OPENROUTER_API_KEY` from `.env` with validation |
| `src/config/prompts.ts` | System prompt restricting AI to scheme-only answers |
| `src/services/ai/openrouterService.ts` | OpenRouter API calls via OpenAI SDK, error handling, timeout |
| `src/utils/markdown.tsx` | Renders **bold**, URLs, lists, headings from AI responses |
| `src/components/chat/ChatBubble.tsx` | Message display with copy and retry buttons |
| `src/components/chat/TypingIndicator.tsx` | Bouncing dots animation during AI response |
| `src/screens/ChatScreen.tsx` | Main chat screen with sessionStorage history |

### AI Behavior

- **Scope**: Only answers about Indian government schemes, scholarships, pensions, farmer/student/women/health/business schemes
- **Out-of-scope**: If user asks unrelated questions, AI responds with restriction message
- **Languages**: Supports English, Hindi, and Hinglish
- **Length**: Max 600 tokens — keeps responses short
- **Safety**: Includes disclaimer: *"Verify on official government websites"*

### Security

- API key is stored in `.env` (never committed — in `.gitignore`)
- Loaded via `import.meta.env` — never hardcoded in source
- OpenRouter key is prefixed with `sk-or-v1-` and scoped via OpenRouter dashboard

---

## 🧪 Testing the AI Chat

1. Start the dev server: `npm run dev`
2. Navigate to the **AI Chat** tab (💬 icon in bottom nav)
3. Click any **suggested prompt** or type your own question:
   - ✅ Try: "What schemes are available for farmers?"
   - ✅ Try: "मेरे लिए कौन सी योजनाएं उपलब्ध हैं?"
   - ❌ Try: "Who is Ronaldo?" → Should get restriction message

### Expected Behavior

| Scenario | Result |
|----------|--------|
| No API key configured | Yellow warning banner with link to get key |
| Invalid API key | Error message explaining how to fix |
| Valid API key + scheme question | AI answers with schemes, eligibility, benefits |
| Valid API key + off-topic question | AI says it only handles schemes |
| Network error | Retry button appears on the error bubble |
| Click "Copy" button | Response text copied to clipboard |

---

## 📦 Required Packages

### Existing
| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.6 | UI framework |
| react-dom | 19.2.6 | DOM rendering |
| typescript | 5.9.3 | Type safety |
| vite | 7.3.2 | Build tool |
| tailwindcss | 4.1.17 | CSS framework |
| framer-motion | 12.40.0 | Animations |
| lucide-react | 1.16.0 | Icons |
| clsx | 2.1.1 | Class utilities |
| tailwind-merge | 3.4.0 | Class merging |

### AI Package
| Package | Version | Purpose |
|---------|---------|---------|
| openai | latest | OpenAI SDK (OpenRouter-compatible mode) |

---

## 🛠️ Troubleshooting

### "OpenRouter API key is not configured"
- Create `.env` file with `EXPO_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-xxxx`
- Restart the dev server (`Ctrl+C` then `npm run dev`)
- Get a free key at https://openrouter.ai/keys

### "Insufficient credits"
- OpenRouter free tier models (like `deepseek/deepseek-r1:free`) don't require credits
- If you switched to a paid model, add funds at https://openrouter.ai
- Check your usage at https://openrouter.ai/activity

### "Rate limit reached"
- OpenRouter free tier has limits per minute
- Wait 30-60 seconds and try again
- For production, consider adding a small credit balance

### AI responds with restriction message
- You asked something unrelated to Indian government schemes
- Re-phrase your question to be about schemes, benefits, or welfare programs

---

## 🌐 Supported Languages

| Language | Code | Status |
|:---------|:-----|:-------|
| English  | en   | ✅ Full |
| Hindi    | hi   | ✅ Full |
| Hinglish | hi-en| ✅ Auto |

---

## 📊 Screens Overview

| Screen             | Route            | Auth Required |
|:-------------------|:-----------------|:-------------|
| Splash             | splash           | No           |
| Login              | login            | No           |
| Signup             | signup           | No           |
| Home               | home             | No (guest ok)|
| AI Chat            | chat             | Recommended  |
| Scheme Detail      | schemeDetail     | No           |
| Saved Schemes      | saved            | Yes          |
| Notifications      | notifications    | Yes          |
| Profile            | profile          | Yes          |
| Category Schemes   | categorySchemes  | No           |

---

## 🎨 Design System

### Colors
- **Primary**: `#FF6B35` (Saffron Orange)
- **Secondary**: `#1A3A6B` (Deep Navy)
- **Accent**: `#00C896` (Emerald Green)

### Typography
- **Font**: Inter + Noto Sans Devanagari
- **Headings**: 900 weight (Black)
- **Body**: 400–600 weight

---

Made with ❤️ in India 🇮🇳 | SchemeSetu v1.0.0
