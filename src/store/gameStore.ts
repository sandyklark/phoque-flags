import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameStore, GameConfig, GameStats, FlagGuess, Flag, FlagColor, FlagPattern, DailyGameState } from '../types/game';
import type { GameActionResult } from '../utils/gameErrors';
import gameConfig from '../config/game.config.json';
import { getRandomFlag, createEmptyFlagGuess, isGuessComplete, checkFlagAttributes, isCorrectGuess, formatGuessForSubmission, getTodaysFlag, getPuzzleNumber, getTodaysDateString } from '../utils/flagHelpers';
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
  // Updated to use UN M49 geoscheme subregions for accuracy
  const regions: Record<string, Record<string, string[]>> = {
    'Europe': {
      'Northern Europe': ['United Kingdom', 'Ireland', 'Norway', 'Sweden', 'Denmark', 'Finland', 'Iceland', 'Estonia', 'Latvia', 'Lithuania'],
      'Western Europe': ['France', 'Germany', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Luxembourg'],
      'Southern Europe': ['Spain', 'Italy', 'Greece', 'Portugal', 'Malta', 'Cyprus', 'Croatia', 'Slovenia', 'Bosnia and Herzegovina', 'Montenegro', 'Serbia', 'North Macedonia', 'Albania'],
      'Eastern Europe': ['Russia', 'Poland', 'Ukraine', 'Belarus', 'Czech Republic', 'Slovakia', 'Hungary', 'Romania', 'Bulgaria', 'Moldova']
    },
    'Asia': {
      'East Asia': ['China', 'Japan', 'South Korea', 'North Korea', 'Mongolia'],
      'Southeast Asia': ['Thailand', 'Vietnam', 'Indonesia', 'Philippines', 'Malaysia', 'Singapore', 'Myanmar', 'Cambodia', 'Laos', 'Brunei', 'East Timor'],
      'South Asia': ['India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan', 'Afghanistan', 'Maldives'],
      'Western Asia': ['Turkey', 'Iran', 'Iraq', 'Saudi Arabia', 'Israel', 'Jordan', 'Lebanon', 'Syria', 'Yemen', 'Oman', 'UAE', 'Qatar', 'Bahrain', 'Kuwait', 'Georgia', 'Armenia', 'Azerbaijan'],
      'Central Asia': ['Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan']
    },
    'Africa': {
      'Northern Africa': ['Egypt', 'Libya', 'Tunisia', 'Algeria', 'Morocco', 'Sudan'],
      'Western Africa': ['Nigeria', 'Ghana', 'Senegal', 'Mali', 'Burkina Faso', 'Niger', 'Guinea', 'Sierra Leone', 'Liberia', 'Ivory Coast', 'Togo', 'Benin', 'Mauritania', 'Gambia', 'Guinea-Bissau', 'Cape Verde'],
      'Eastern Africa': ['Kenya', 'Ethiopia', 'Tanzania', 'Uganda', 'Rwanda', 'Burundi', 'Somalia', 'Eritrea', 'Djibouti', 'Madagascar', 'Comoros', 'Mauritius', 'Seychelles'],
      'Middle Africa': ['Democratic Republic of Congo', 'Cameroon', 'Central African Republic', 'Chad', 'Republic of Congo', 'Equatorial Guinea', 'Gabon', 'São Tomé and Príncipe'],
      'Southern Africa': ['South Africa', 'Zimbabwe', 'Botswana', 'Namibia', 'Zambia', 'Malawi', 'Mozambique', 'Angola', 'Lesotho', 'Swaziland']
    },
    'North America': {
      'Northern America': ['United States', 'Canada'],
      'Central America': ['Mexico', 'Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama'],
      'Caribbean': ['Cuba', 'Jamaica', 'Haiti', 'Dominican Republic', 'Trinidad and Tobago', 'Bahamas', 'Barbados', 'Saint Lucia', 'Grenada', 'Saint Vincent and the Grenadines', 'Antigua and Barbuda', 'Dominica', 'Saint Kitts and Nevis']
    },
    'South America': {
      'South America': ['Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay', 'Guyana', 'Suriname']
    },
    'Oceania': {
      'Australia and New Zealand': ['Australia', 'New Zealand'],
      'Melanesia': ['Papua New Guinea', 'Fiji', 'Solomon Islands', 'Vanuatu', 'New Caledonia'],
      'Micronesia': ['Palau', 'Marshall Islands', 'Federated States of Micronesia', 'Nauru', 'Kiribati'],
      'Polynesia': ['Samoa', 'Tonga', 'Tuvalu', 'French Polynesia', 'American Samoa', 'Cook Islands']
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

      // Daily game state
      isDailyMode: true,
      puzzleNumber: getPuzzleNumber(),

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

        // Save daily progress after each guess
        if (get().isDailyMode) {
          get().saveDailyProgress();
        }

        // Return appropriate message with snark for wrong guesses
        if (isCorrect) {
          return createSuccess('Correct! You found the flag!');
        } else {
          const snarkMessages = [
            "Mmm... Slightly disappointing.",
            "Wow.. Are you even trying?",
            "What are you doing? This is embarrassing...",
            "You have seen a map before right?",
          ];

          const wrongCount = currentRow; // 0-based, so first wrong = 0
          const snarkMessage = wrongCount < snarkMessages.length
            ? snarkMessages[wrongCount]
            : "Well, this is embarrassing...";

          return createSuccess(snarkMessage);
        }
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

        // Only log in development mode
        if (process.env.NODE_ENV === 'development') {
          console.log('New flag solution:', newSolution.name, newSolution.flagEmoji);
        }

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

      reloadConfigFromFile: () => {
        // Force reload config from the JSON file
        const freshConfig = {
          maxAttempts: gameConfig.maxAttempts,
          animationSpeed: gameConfig.animationSpeed,
          hardMode: gameConfig.hardMode,
          theme: gameConfig.theme as 'light' | 'dark' | 'auto',
          difficulty: gameConfig.difficulty as 'easy' | 'medium' | 'hard',
        };

        set({
          config: freshConfig,
          guesses: createEmptyGuesses(freshConfig.maxAttempts),
        });

        // Also reset the game to apply the new config
        get().resetGame();
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

      // Daily game actions
      loadDailyGame: () => {
        const todayString = getTodaysDateString();
        const storedDaily = localStorage.getItem('where-the-phoque-daily-game');

        if (storedDaily) {
          try {
            const dailyState: DailyGameState = JSON.parse(storedDaily);

            // Check if it's the same day
            if (dailyState.date === todayString) {
              // Restore today's progress
              set({
                isDailyMode: true,
                puzzleNumber: dailyState.puzzleNumber,
                solution: { id: dailyState.flagId } as Flag,
                guesses: dailyState.guesses,
                currentRow: dailyState.currentRow,
                hintState: dailyState.hintState,
                gameState: dailyState.gameState,
                inputState: {},
                currentGuess: {}
              });

              // Load the full flag data
              const todaysFlag = getTodaysFlag();
              set({ solution: todaysFlag });
              return;
            }
          } catch (error) {
            console.warn('Failed to load daily game state:', error);
          }
        }

        // Start fresh daily game
        const todaysFlag = getTodaysFlag();
        const puzzleNum = getPuzzleNumber();

        // Only log in development mode
        if (process.env.NODE_ENV === 'development') {
          console.log(`Daily Where the Phoque? #${puzzleNum}:`, todaysFlag.name, todaysFlag.flagEmoji);
        }

        set({
          isDailyMode: true,
          puzzleNumber: puzzleNum,
          gameState: 'playing',
          solution: todaysFlag,
          guesses: createEmptyGuesses(get().config.maxAttempts),
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
          }
        });

        // Save initial daily state
        get().saveDailyProgress();
      },

      saveDailyProgress: () => {
        const state = get();
        if (!state.isDailyMode) return;

        const dailyState: DailyGameState = {
          date: getTodaysDateString(),
          puzzleNumber: state.puzzleNumber,
          flagId: state.solution.id,
          completed: state.gameState === 'won' || state.gameState === 'lost',
          guesses: state.guesses,
          currentRow: state.currentRow,
          hintState: state.hintState,
          gameState: state.gameState
        };

        localStorage.setItem('where-the-phoque-daily-game', JSON.stringify(dailyState));
      },

      startTestMode: () => {
        // Switch to test mode with random flag
        const randomFlag = getRandomFlag();
        // Only log in development mode  
        if (process.env.NODE_ENV === 'development') {
          console.log('Test mode:', randomFlag.name, randomFlag.flagEmoji);
        }

        set({
          isDailyMode: false,
          gameState: 'playing',
          solution: randomFlag,
          guesses: createEmptyGuesses(get().config.maxAttempts),
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
          }
        });
      },

      checkForNewDay: () => {
        const state = get();
        if (!state.isDailyMode) return;

        const todayString = getTodaysDateString();
        const storedDaily = localStorage.getItem('where-the-phoque-daily-game');

        if (storedDaily) {
          try {
            const dailyState: DailyGameState = JSON.parse(storedDaily);
            if (dailyState.date !== todayString) {
              // New day! Load fresh daily puzzle
              get().loadDailyGame();
            }
          } catch (error) {
            // If error parsing, just load daily game
            get().loadDailyGame();
          }
        } else {
          // No stored daily game, load fresh
          get().loadDailyGame();
        }
      },
    }),
    {
      name: 'where-the-phoque-game-store',
      partialize: (state) => ({
        stats: state.stats,
        config: state.config,
      }),
    }
  )
);

// Initialize game on store creation - load daily puzzle or restore progress
const initializeGame = () => {
  const store = useGameStore.getState();
  // Force reload config from file to get latest values
  store.reloadConfigFromFile();

  // Load today's daily puzzle or restore progress
  store.loadDailyGame();
};

initializeGame();
