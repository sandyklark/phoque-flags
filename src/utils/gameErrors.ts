export const GAME_ERRORS = {
  WORD_TOO_SHORT: (required: number, actual: number) => 
    `Word must be ${required} letters (got ${actual})`,
  WORD_TOO_LONG: (required: number, actual: number) => 
    `Word must be ${required} letters (got ${actual})`,
  WORD_INVALID: 'Not a valid word',
  WORD_ALREADY_TRIED: 'Word already tried',
  WORD_INCOMPLETE: (required: number) => 
    `Word must be ${required} letters`,
  GAME_NOT_ACTIVE: 'Game is not active',
  GAME_ALREADY_WON: 'Game is already won',
  GAME_ALREADY_LOST: 'Game is already lost',
  WORD_ALREADY_COMPLETE: 'Word is already complete',
  NO_LETTERS_TO_REMOVE: 'No letters to remove',
  INVALID_KEY: 'Invalid key pressed',
} as const;

export type GameErrorKey = keyof typeof GAME_ERRORS;

export interface GameActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export const createSuccess = (message?: string): GameActionResult => ({
  success: true,
  message,
});

export const createError = (error: string): GameActionResult => ({
  success: false,
  error,
});