import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameStore, GameConfig, GameStats, FlagGuess, Flag, FlagColor, FlagPattern } from '../types/game';
import type { GameActionResult } from '../utils/gameErrors';
import gameConfig from '../config/game.config.json';
import { getRandomFlag, createEmptyFlagGuess, isGuessComplete, checkFlagAttributes, isCorrectGuess, formatGuessForSubmission } from '../utils/flagHelpers';
import { GAME_ERRORS, createSuccess, createError } from '../utils/gameErrors';

const defaultConfig: GameConfig = {
  maxAttempts: gameConfig.maxAttempts,
  animationSpeed: gameConfig.animationSpeed,
  hardMode: gameConfig.hardMode,
  theme: gameConfig.theme as 'light' | 'dark' | 'auto',
  difficulty: gameConfig.difficulty as 'easy' | 'medium' | 'hard',
};

const defaultStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: {},
};

const createEmptyGuesses = (maxAttempts: number): FlagGuess[] => {
  return Array.from({ length: maxAttempts }, () => createEmptyFlagGuess());
};

const updateCurrentRowWithGuess = (
  guesses: FlagGuess[],
  currentRow: number,
  newGuess: Partial<Pick<Flag, 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern'>>
): FlagGuess[] => {
  const newGuesses = [...guesses];
  
  newGuesses[currentRow] = {
    primaryColor: newGuess.primaryColor || null,
    secondaryColor: newGuess.secondaryColor || null,
    tertiaryColor: newGuess.tertiaryColor || null,
    pattern: newGuess.pattern || null,
    attributes: [
      { 
        type: 'primaryColor', 
        value: newGuess.primaryColor || null, 
        state: newGuess.primaryColor ? 'filled' : 'empty' 
      },
      { 
        type: 'secondaryColor', 
        value: newGuess.secondaryColor || null, 
        state: newGuess.secondaryColor ? 'filled' : 'empty' 
      },
      { 
        type: 'tertiaryColor', 
        value: newGuess.tertiaryColor || null, 
        state: newGuess.tertiaryColor ? 'filled' : 'empty' 
      },
      { 
        type: 'pattern', 
        value: newGuess.pattern || null, 
        state: newGuess.pattern ? 'filled' : 'empty' 
      }
    ],
    isSubmitted: false
  };

  return newGuesses;
};

const getRegionHint = (flag: Flag): string | null => {
  const regions: Record<string, Record<string, string[]>> = {
    'Europe': {
      'Northern Europe': ['United Kingdom', 'Ireland', 'Norway', 'Sweden', 'Denmark', 'Finland'],
      'Western Europe': ['France', 'Germany', 'Netherlands', 'Belgium', 'Switzerland'],
      'Southern Europe': ['Spain', 'Italy', 'Greece', 'Portugal'],
      'Eastern Europe': ['Russia', 'Poland', 'Ukraine']
    },
    'Asia': {
      'East Asia': ['China', 'Japan', 'South Korea'],
      'Southeast Asia': ['Thailand', 'Vietnam', 'Indonesia', 'Philippines'],
      'South Asia': ['India', 'Pakistan', 'Bangladesh'],
      'Western Asia': ['Turkey', 'Iran', 'Israel']
    },
    'Africa': {
      'North Africa': ['Egypt', 'Morocco', 'Algeria', 'Tunisia'],
      'West Africa': ['Nigeria', 'Ghana', 'Senegal'],
      'East Africa': ['Kenya', 'Ethiopia', 'Tanzania'],
      'Southern Africa': ['South Africa', 'Zimbabwe']
    },
    'North America': {
      'North America': ['United States', 'Canada', 'Mexico']
    },
    'South America': {
      'South America': ['Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia']
    },
    'Oceania': {
      'Oceania': ['Australia', 'New Zealand']
    }
  };

  const continent = regions[flag.continent];
  if (!continent) return null;

  for (const [region, countries] of Object.entries(continent)) {
    if (countries.includes(flag.name)) {
      return `This flag is from ${region}`;
    }
  }
  
  return null;
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      gameState: 'loading',
      solution: {} as Flag,
      guesses: createEmptyGuesses(defaultConfig.maxAttempts),
      currentGuess: {},
      currentRow: 0,
      config: defaultConfig,
      stats: defaultStats,
      inputState: {},
      hintState: {
        hintsUsed: 0,
        maxHints: 3,
        hintHistory: [],
        autoHintsTriggered: [],
        showModal: false,
        latestHint: null
      },

      // Actions
      setColor: (position: 'primary' | 'secondary' | 'tertiary', color: FlagColor): GameActionResult => {
        const { currentGuess, currentRow, gameState, guesses } = get();

        if (gameState !== 'playing') {
          return createError(GAME_ERRORS.GAME_NOT_ACTIVE);
        }

        const attributeKey = position === 'primary' ? 'primaryColor' : 
                           position === 'secondary' ? 'secondaryColor' : 'tertiaryColor';
        
        const newGuess = { ...currentGuess, [attributeKey]: color };
        const newGuesses = updateCurrentRowWithGuess(guesses, currentRow, newGuess);

        set({ currentGuess: newGuess, guesses: newGuesses });
        return createSuccess();
      },

      setPattern: (pattern: FlagPattern): GameActionResult => {
        const { currentGuess, currentRow, gameState, guesses } = get();

        if (gameState !== 'playing') {
          return createError(GAME_ERRORS.GAME_NOT_ACTIVE);
        }

        const newGuess = { ...currentGuess, pattern };
        const newGuesses = updateCurrentRowWithGuess(guesses, currentRow, newGuess);

        set({ currentGuess: newGuess, guesses: newGuesses });
        return createSuccess();
      },

      clearAttribute: (attribute: 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern'): GameActionResult => {
        const { currentGuess, currentRow, gameState, guesses } = get();

        if (gameState !== 'playing') {
          return createError(GAME_ERRORS.GAME_NOT_ACTIVE);
        }

        const newGuess = { ...currentGuess };
        delete newGuess[attribute];
        
        const newGuesses = updateCurrentRowWithGuess(guesses, currentRow, newGuess);

        set({ currentGuess: newGuess, guesses: newGuesses });
        return createSuccess();
      },

      submitGuess: (): GameActionResult => {
        const { currentGuess, currentRow, config, solution, guesses, inputState, gameState } = get();

        if (gameState !== 'playing') {
          return createError(GAME_ERRORS.GAME_NOT_ACTIVE);
        }

        if (!isGuessComplete(currentGuess)) {
          return createError(GAME_ERRORS.GUESS_INCOMPLETE);
        }

        // Check if guess has already been tried
        const formattedGuess = formatGuessForSubmission(currentGuess);
        const previousGuesses = guesses.slice(0, currentRow).filter(guess => guess.isSubmitted);
        const alreadyTried = previousGuesses.some(guess => 
          guess.primaryColor === formattedGuess.primaryColor &&
          guess.secondaryColor === formattedGuess.secondaryColor &&
          guess.tertiaryColor === formattedGuess.tertiaryColor &&
          guess.pattern === formattedGuess.pattern
        );

        if (alreadyTried) {
          return createError(GAME_ERRORS.GUESS_ALREADY_TRIED);
        }

        const newGuesses = [...guesses];
        const flagAttributes = checkFlagAttributes(formattedGuess, solution);

        // Update the current row with flag attributes
        newGuesses[currentRow] = {
          ...formattedGuess,
          attributes: flagAttributes,
          isSubmitted: true
        };

        // Update input state for UI feedback
        const newInputState = { ...inputState };
        flagAttributes.forEach((attr) => {
          if (attr.value) {
            const currentState = newInputState[attr.value];
            // Priority: correct > present > absent
            if (!currentState || currentState === 'empty') {
              newInputState[attr.value] = attr.state;
            } else if (currentState !== 'correct' && attr.state === 'correct') {
              newInputState[attr.value] = attr.state;
            } else if (currentState === 'absent' && attr.state === 'present') {
              newInputState[attr.value] = attr.state;
            }
          }
        });

        // Check win condition
        const isCorrect = isCorrectGuess(formattedGuess, solution);
        const isGameOver = isCorrect || currentRow + 1 >= config.maxAttempts;

        set({
          guesses: newGuesses,
          currentGuess: {},
          currentRow: currentRow + 1,
          inputState: newInputState,
          gameState: isCorrect ? 'won' : isGameOver ? 'lost' : 'playing',
        });

        // Update stats if game is over
        if (isGameOver) {
          get().updateStats(isCorrect, currentRow + 1);
        }

        // Auto-trigger hints based on current row if game is still playing
        if (!isCorrect && !isGameOver) {
          get().autoTriggerHints(currentRow + 1);
        }

        return createSuccess(isCorrect ? 'Correct! You found the flag!' : 'Good guess!');
      },

      getHint: (): GameActionResult & { hint?: string } => {
        const { gameState, hintState, solution } = get();
        
        if (gameState !== 'playing') {
          return createError(GAME_ERRORS.GAME_NOT_ACTIVE);
        }
        
        if (hintState.hintsUsed >= hintState.maxHints) {
          return createError('No more hints available');
        }
        
        const nextHintIndex = hintState.hintsUsed;
        let hint = '';
        
        switch (nextHintIndex) {
          case 0:
            hint = `This flag is from ${solution.continent}`;
            break;
          case 1:
            // Add region hints based on continent
            const regionHint = getRegionHint(solution);
            hint = regionHint || `This flag is from ${solution.continent}`;
            break;
          case 2:
            hint = `The country name starts with "${solution.name.charAt(0)}"`;
            break;
          default:
            return createError('No more hints available');
        }
        
        set({
          hintState: {
            ...hintState,
            hintsUsed: hintState.hintsUsed + 1,
            hintHistory: [...hintState.hintHistory, hint],
            showModal: true,
            latestHint: hint
          }
        });
        
        return { success: true, hint };
      },

      autoTriggerHints: (currentRow: number) => {
        const { hintState, solution } = get();
        
        // Define thresholds: after 2nd, 4th, and 5th failed guesses
        const thresholds = [2, 4, 5];
        const currentThreshold = currentRow;
        
        // Check if we should trigger a hint at this threshold
        for (let i = 0; i < thresholds.length; i++) {
          const threshold = thresholds[i];
          if (currentThreshold >= threshold && !hintState.autoHintsTriggered.includes(threshold)) {
            // Trigger hint if we haven't already triggered it and we haven't exceeded max hints
            if (hintState.hintsUsed < hintState.maxHints) {
              let hint = '';
              const hintIndex = hintState.hintsUsed;
              
              switch (hintIndex) {
                case 0:
                  hint = `This flag is from ${solution.continent}`;
                  break;
                case 1:
                  const regionHint = getRegionHint(solution);
                  hint = regionHint || `This flag is from ${solution.continent}`;
                  break;
                case 2:
                  hint = `The country name starts with "${solution.name.charAt(0)}"`;
                  break;
              }
              
              if (hint) {
                set({
                  hintState: {
                    ...hintState,
                    hintsUsed: hintState.hintsUsed + 1,
                    hintHistory: [...hintState.hintHistory, hint],
                    autoHintsTriggered: [...hintState.autoHintsTriggered, threshold],
                    showModal: true,
                    latestHint: hint
                  }
                });
              }
            }
          }
        }
      },

      closeHintModal: () => {
        const { hintState } = get();
        set({
          hintState: {
            ...hintState,
            showModal: false,
            latestHint: null
          }
        });
      },

      resetGame: () => {
        const { config } = get();
        const newSolution = getRandomFlag();

        console.log('New flag solution:', newSolution.name, newSolution.flagEmoji);

        set({
          gameState: 'playing',
          solution: newSolution,
          guesses: createEmptyGuesses(config.maxAttempts),
          currentGuess: {},
          currentRow: 0,
          inputState: {},
          hintState: {
            hintsUsed: 0,
            maxHints: 3,
            hintHistory: [],
            autoHintsTriggered: [],
            showModal: false,
            latestHint: null
          },
        });
      },

      loadConfig: (newConfig: Partial<GameConfig>) => {
        const currentConfig = get().config;
        const updatedConfig = { ...currentConfig, ...newConfig };

        set({
          config: updatedConfig,
          guesses: createEmptyGuesses(updatedConfig.maxAttempts),
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