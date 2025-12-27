export const GAME_ERRORS = {
  GUESS_INCOMPLETE: 'Please select primary color, secondary color, and pattern',
  GUESS_ALREADY_TRIED: 'This combination has already been tried',
  GAME_NOT_ACTIVE: 'Game is not active',
  GAME_ALREADY_WON: 'Game is already won',
  GAME_ALREADY_LOST: 'Game is already lost',
  INVALID_COLOR: 'Invalid color selection',
  INVALID_PATTERN: 'Invalid pattern selection',
  ATTRIBUTE_ALREADY_SET: 'This attribute is already set',
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