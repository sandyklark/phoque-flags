import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameStore, GameConfig, GameStats, Guess, LetterState } from '../types/game';
import type { GameActionResult } from '../utils/gameErrors';
import gameConfig from '../config/game.config.json';
import { getRandomSolution, isValidWord, checkLetterStates } from '../utils/gameHelpers';
import { GAME_ERRORS, createSuccess, createError } from '../utils/gameErrors';

const defaultConfig: GameConfig = {
  wordLength: gameConfig.wordLength,
  maxAttempts: gameConfig.maxAttempts,
  animationSpeed: gameConfig.animationSpeed,
  hardMode: gameConfig.hardMode,
  allowDuplicateLetters: gameConfig.allowDuplicateLetters,
  theme: gameConfig.theme as 'light' | 'dark' | 'auto',
};

const defaultStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: {},
};

const createEmptyGuesses = (maxAttempts: number, wordLength: number): Guess[] => {
  return Array.from({ length: maxAttempts }, () => ({
    letters: Array.from({ length: wordLength }, () => ({ value: '', state: 'empty' as LetterState })),
    word: '',
    isSubmitted: false,
  }));
};

const updateCurrentRowWithGuess = (
  guesses: Guess[],
  currentRow: number,
  newGuess: string,
  wordLength: number
): Guess[] => {
  const newGuesses = [...guesses];

  for (let i = 0; i < wordLength; i++) {
    newGuesses[currentRow].letters[i] = {
      value: newGuess[i] || '',
      state: newGuess[i] ? 'filled' : 'empty',
    };
  }
  newGuesses[currentRow].word = newGuess;

  return newGuesses;
};

export const
  useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      gameState: 'loading',
      solution: '',
      guesses: createEmptyGuesses(defaultConfig.maxAttempts, defaultConfig.wordLength),
      currentGuess: '',
      currentRow: 0,
      config: defaultConfig,
      stats: defaultStats,
      keyboardState: {},

      // Actions
      addLetter: (letter: string): GameActionResult => {
        const { currentGuess, currentRow, config, gameState, guesses } = get();

        if (gameState !== 'playing') {
          return createError(GAME_ERRORS.GAME_NOT_ACTIVE);
        }

        if (currentGuess.length >= config.wordLength) {
          return createError(GAME_ERRORS.WORD_ALREADY_COMPLETE);
        }

        const newGuess = currentGuess + letter.toUpperCase();
        const newGuesses = updateCurrentRowWithGuess(guesses, currentRow, newGuess, config.wordLength);

        set({ currentGuess: newGuess, guesses: newGuesses });
        return createSuccess();
      },

      removeLetter: (): GameActionResult => {
        const { currentGuess, currentRow, config, gameState, guesses } = get();

        if (gameState !== 'playing') {
          return createError(GAME_ERRORS.GAME_NOT_ACTIVE);
        }

        if (currentGuess.length === 0) {
          return createError(GAME_ERRORS.NO_LETTERS_TO_REMOVE);
        }

        const newGuess = currentGuess.slice(0, -1);
        const newGuesses = updateCurrentRowWithGuess(guesses, currentRow, newGuess, config.wordLength);

        set({ currentGuess: newGuess, guesses: newGuesses });
        return createSuccess();
      },

      submitGuess: (): GameActionResult => {
        const { currentGuess, currentRow, config, solution, guesses, keyboardState, gameState } = get();

        if (gameState !== 'playing') {
          return createError(GAME_ERRORS.GAME_NOT_ACTIVE);
        }

        if (currentGuess.length !== config.wordLength) {
          return createError(GAME_ERRORS.WORD_INCOMPLETE(config.wordLength));
        }

        if (!isValidWord(currentGuess)) {
          return createError(GAME_ERRORS.WORD_INVALID);
        }

        // Check if word has already been tried
        const previousGuesses = guesses.slice(0, currentRow).filter(guess => guess.isSubmitted);
        if (previousGuesses.some(guess => guess.word === currentGuess)) {
          return createError(GAME_ERRORS.WORD_ALREADY_TRIED);
        }

        const newGuesses = [...guesses];
        const letterStates = checkLetterStates(currentGuess, solution);

        // Update the current row with letter states
        newGuesses[currentRow].letters = letterStates;
        newGuesses[currentRow].isSubmitted = true;

        // Update keyboard state
        const newKeyboardState = { ...keyboardState };
        letterStates.forEach((letter) => {
          const currentState = newKeyboardState[letter.value];
          // Priority: correct > present > absent
          if (!currentState || currentState === 'empty') {
            newKeyboardState[letter.value] = letter.state;
          } else if (currentState !== 'correct' && letter.state === 'correct') {
            newKeyboardState[letter.value] = letter.state;
          } else if (currentState === 'absent' && letter.state === 'present') {
            newKeyboardState[letter.value] = letter.state;
          }
        });

        // Check win condition
        const isCorrect = currentGuess === solution;
        const isGameOver = isCorrect || currentRow + 1 >= config.maxAttempts;

        set({
          guesses: newGuesses,
          currentGuess: '',
          currentRow: currentRow + 1,
          keyboardState: newKeyboardState,
          gameState: isCorrect ? 'won' : isGameOver ? 'lost' : 'playing',
        });

        // Update stats if game is over
        if (isGameOver) {
          get().updateStats(isCorrect, currentRow + 1);
        }

        return createSuccess(isCorrect ? 'Correct!' : 'Good guess!');
      },

      resetGame: () => {
        const { config } = get();
        const newSolution = getRandomSolution();

        console.log(newSolution);

        set({
          gameState: 'playing',
          solution: newSolution,
          guesses: createEmptyGuesses(config.maxAttempts, config.wordLength),
          currentGuess: '',
          currentRow: 0,
          keyboardState: {},
        });
      },

      loadConfig: (newConfig: Partial<GameConfig>) => {
        const currentConfig = get().config;
        const updatedConfig = { ...currentConfig, ...newConfig };

        set({
          config: updatedConfig,
          guesses: createEmptyGuesses(updatedConfig.maxAttempts, updatedConfig.wordLength),
        });
      },

      updateStats: (won: boolean, guessCount: number) => {
        const { stats } = get();
        const newStats: GameStats = {
          gamesPlayed: stats.gamesPlayed + 1,
          gamesWon: stats.gamesWon + (won ? 1 : 0),
          currentStreak: won ? stats.currentStreak + 1 : 0,
          maxStreak: won ? Math.max(stats.maxStreak, stats.currentStreak + 1) : stats.maxStreak,
          guessDistribution: {
            ...stats.guessDistribution,
            [guessCount]: (stats.guessDistribution[guessCount] || 0) + (won ? 1 : 0),
          },
        };

        set({ stats: newStats });
      },

      setTheme: (theme: 'light' | 'dark' | 'auto') => {
        const { config } = get();
        set({ config: { ...config, theme } });

        // Apply theme to document
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else if (theme === 'light') {
          root.classList.remove('dark');
        } else {
          // Auto mode - check system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      },
    }),
    {
      name: 'flagdle-game-store',
      partialize: (state) => ({
        stats: state.stats,
        config: state.config,
      }),
    }
  )
);

// Initialize game on store creation - ensure fresh game state
const initializeGame = () => {
  useGameStore.getState().resetGame();
  useGameStore.setState({ gameState: 'playing' });
};

initializeGame();
