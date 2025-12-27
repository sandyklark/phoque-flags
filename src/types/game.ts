export interface GameActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export interface GameConfig {
  maxAttempts: number;
  animationSpeed: number;
  hardMode: boolean;
  theme: 'light' | 'dark' | 'auto';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>;
}

export type FlagColor = 'red' | 'blue' | 'white' | 'green' | 'yellow' | 'black' | 'orange' | 'purple' | 'pink' | 'brown' | 'gray';
export type FlagPattern = 'stripes' | 'horizontal-stripes' | 'vertical-stripes' | 'cross' | 'circle' | 'stars' | 'symbol' | 'diamond' | 'triangle' | 'complex' | 'solid' | 'diagonal';
export type AttributeState = 'correct' | 'present' | 'absent' | 'empty' | 'filled';

export interface FlagAttribute {
  type: 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern';
  value: FlagColor | FlagPattern | null;
  state: AttributeState;
}

export interface FlagGuess {
  primaryColor: FlagColor | null;
  secondaryColor: FlagColor | null;
  tertiaryColor: FlagColor | null;
  pattern: FlagPattern | null;
  attributes: FlagAttribute[];
  isSubmitted: boolean;
}

export interface Flag {
  id: string;
  name: string;
  primaryColor: FlagColor;
  secondaryColor: FlagColor;
  tertiaryColor: FlagColor | null;
  pattern: FlagPattern;
  continent: string;
  flagEmoji: string;
}

export type GameState = 'playing' | 'won' | 'lost' | 'loading';

export interface HintState {
  hintsUsed: number;
  maxHints: number;
  hintHistory: string[];
  autoHintsTriggered: number[];
  showModal: boolean;
  latestHint: string | null;
}

export interface GameStore {
  // Game state
  gameState: GameState;
  solution: Flag;
  guesses: FlagGuess[];
  currentGuess: Partial<Pick<Flag, 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern'>>;
  currentRow: number;
  
  // Configuration
  config: GameConfig;
  
  // Statistics
  stats: GameStats;
  
  // Input state
  inputState: Record<string, AttributeState>;
  
  // Hint state
  hintState: HintState;
  
  // Actions
  setColor: (position: 'primary' | 'secondary' | 'tertiary', color: FlagColor) => GameActionResult;
  setPattern: (pattern: FlagPattern) => GameActionResult;
  clearAttribute: (attribute: 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern') => GameActionResult;
  submitGuess: () => GameActionResult;
  getHint: () => GameActionResult & { hint?: string };
  autoTriggerHints: (currentRow: number) => void;
  closeHintModal: () => void;
  resetGame: () => void;
  loadConfig: (config: Partial<GameConfig>) => void;
  updateStats: (won: boolean, guessCount: number) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

export interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  solution: Flag;
  guessCount: number;
  stats: GameStats;
  hintState: HintState;
  onNewGame: () => void;
}

export interface ColorPickerProps {
  onColorSelect: (position: 'primary' | 'secondary' | 'tertiary', color: FlagColor) => void;
  currentGuess: Partial<Pick<Flag, 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern'>>;
  disabled: boolean;
}

export interface PatternPickerProps {
  onPatternSelect: (pattern: FlagPattern) => void;
  currentPattern: FlagPattern | null;
  disabled: boolean;
}

export interface GameBoardProps {
  guesses: FlagGuess[];
  currentGuess: Partial<Pick<Flag, 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern'>>;
  maxAttempts: number;
  onColorSelect: (position: 'primary' | 'secondary' | 'tertiary', color: FlagColor) => void;
  onPatternSelect: (pattern: FlagPattern) => void;
  onClearAttribute: (attribute: 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern') => void;
  onSubmitGuess: () => void;
  canSubmit: boolean;
  disabled: boolean;
}

export interface AttributeTileProps {
  attribute: FlagAttribute;
  animationDelay?: number;
  isCurrentGuess?: boolean;
  isFutureRow?: boolean;
}

export interface GuessRowProps {
  guess: FlagGuess;
  isCurrentRow: boolean;
  currentGuess?: Partial<Pick<Flag, 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern'>>;
  onColorSelect?: (position: 'primary' | 'secondary' | 'tertiary', color: FlagColor) => void;
  onPatternSelect?: (pattern: FlagPattern) => void;
  onClearAttribute?: (attribute: 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern') => void;
  isFutureRow?: boolean;
}