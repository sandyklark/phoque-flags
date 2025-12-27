# 🦭 Phoque Flags

A daily flag guessing game inspired by Wordle. Guess the country flag by its colors and patterns with our adorable seal companion!

## 🎮 How to Play

- **Daily Mode**: Everyone gets the same flag each day
- **Practice Mode**: Play with random flags anytime
- Guess the flag by selecting:
  - Primary color
  - Secondary color (optional) 
  - Tertiary color (optional)
  - Pattern type
- You have 5 attempts to guess correctly
- Hints unlock automatically after wrong guesses
- Colors and patterns will show if they're correct (green), present but wrong position (yellow), or not in the flag (gray)

## 🌟 Features

- 🌍 96 flags from around the world
- 🎯 Daily puzzle mode with consistent numbering
- 💡 Progressive hint system (continent, region, first letter)
- 📊 Statistics tracking and streak counting
- 🌓 Dark/light theme support
- 📱 Mobile responsive design
- 🦭 Cute animated seal companion
- 💬 Humorous feedback messages

## 🛠️ Development

### Prerequisites

- [Bun](https://bun.sh) runtime
- Node.js 18+ (optional, if not using Bun)

### Installation

```bash
bun install
```

### Development Server

```bash
bun run dev
```

### Build for Production

```bash
bun run build
```

### Type Checking

```bash
bun run typecheck
```

## 🏗️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Flags**: FlagCDN API
- **Deployment**: Vercel

## 🎯 Game Logic

The game uses a sophisticated hint system:

1. **Continent hint** - After 2 wrong guesses
2. **Region hint** - After 4 wrong guesses  
3. **First letter** - After 5 wrong guesses

Colors and patterns are validated against a comprehensive database of 96 world flags with accurate geographic classification using the UN M49 geoscheme.

## 📱 Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

The project is configured for Vercel deployment:

1. Push to your repository
2. Connect to Vercel
3. Deploy automatically

The `vercel.json` configuration handles routing for the SPA.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

---

Made with 🦭 by the Phoque Flags team
