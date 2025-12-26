export interface GameActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export interface GameConfig {
  wordLength: number;
  maxAttempts: number;
  animationSpeed: number;
  hardMode: boolean;
  allowDuplicateLetters: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>;
}

export type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'filled';

export interface Letter {
  value: string;
  state: LetterState;
}

export interface Guess {
  letters: Letter[];
  word: string;
  isSubmitted: boolean;
}

export type GameState = 'playing' | 'won' | 'lost' | 'loading';

export interface GameStore {
  // Game state
  gameState: GameState;
  solution: string;
  guesses: Guess[];
  currentGuess: string;
  currentRow: number;
  
  // Configuration
  config: GameConfig;
  
  // Statistics
  stats: GameStats;
  
  // Keyboard state
  keyboardState: Record<string, LetterState>;
  
  // Actions
  addLetter: (letter: string) => GameActionResult;
  removeLetter: () => GameActionResult;
  submitGuess: () => GameActionResult;
  resetGame: () => void;
  loadConfig: (config: Partial<GameConfig>) => void;
  updateStats: (won: boolean, guessCount: number) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

export interface WordList {
  solutions: string[];
  valid: string[];
}

export interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  solution: string;
  guessCount: number;
  stats: GameStats;
  onNewGame: () => void;
}

export interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardState: Record<string, LetterState>;
  disabled: boolean;
}

export interface GameBoardProps {
  guesses: Guess[];
  currentGuess: string;
  maxAttempts: number;
  wordLength: number;
}

export interface LetterTileProps {
  letter: Letter;
  animationDelay?: number;
  isCurrentGuess?: boolean;
}