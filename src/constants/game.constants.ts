// Game content constants
export const GAME_TITLE = 'Where the Phoque?';
export const SUCCESS_MESSAGE = 'Correct! You found the flag!';

// Button configurations
export const BUTTON_CONFIGS = {
  stats: {
    icon: '📊',
    label: 'Stats',
    title: 'View game statistics',
    ariaLabel: 'View game statistics',
  },
  help: {
    icon: '❓',
    label: 'Help',
    title: 'How to play',
    ariaLabel: 'How to play instructions',
  },
  newGame: {
    icon: '🎮',
  },
  theme: {
    icons: {
      light: '🌙',
      dark: '☀️',
    },
    title: 'Toggle dark/light theme',
  },
} as const;

// Game mode labels
export const GAME_MODE_LABELS = {
  daily: 'Daily Flag Puzzle',
  practice: 'Practice Mode',
  subtitle: 'Guess the flag by its colors and patterns',
} as const;

// New game button text
export const NEW_GAME_TEXT = {
  daily: 'Practice',
  practice: 'New Game',
} as const;

// New game aria labels
export const NEW_GAME_ARIA_LABELS = {
  daily: 'Start practice mode with random flag',
  practice: 'Start new practice game',
} as const;

// New game titles
export const NEW_GAME_TITLES = {
  daily: 'Start practice mode',
  practice: 'New practice game',
} as const;

// Timing constants
export const TIMING = {
  NOTIFICATION_DURATION: 3000,
  SNARK_MESSAGE_DURATION: 10000,
} as const;

// CSS class constants
export const CSS_CLASSES = {
  buttonHover: 'hover:bg-gray-100 dark:hover:bg-gray-700',
  buttonBase: 'rounded-lg transition-colors',
  buttonMobile: 'p-2 text-sm',
  buttonDesktop: 'px-3 py-2',
} as const;

// Media query for dark mode detection
export const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)';