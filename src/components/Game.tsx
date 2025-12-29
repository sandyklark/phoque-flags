import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { GameBoard } from './GameBoard';
import { GameModal } from './GameModal';
import { GameStats } from './GameStats';
import { HintButton } from './HintButton';
import { HintModal } from './HintModal';
import { HowToPlayModal } from './HowToPlayModal';
import { SealParade } from './SealParade';
import { isGuessComplete } from '../utils/flagHelpers';
import { useTheme } from '../hooks/useTheme';
import { 
  handleGameResult, 
  getNewGameButtonText, 
  getNewGameAriaLabel, 
  getNewGameTitle, 
  getGameModeLabel 
} from '../utils/gameHelpers';
import { 
  GAME_TITLE, 
  BUTTON_CONFIGS, 
  GAME_MODE_LABELS, 
  TIMING, 
  CSS_CLASSES 
} from '../constants/game.constants';

export const Game = () => {
  const {
    gameState,
    solution,
    guesses,
    currentGuess,
    currentRow,
    config,
    stats,
    isDailyMode,
    puzzleNumber,
    setColor,
    setPattern,
    clearAttribute,
    submitGuess,
    startTestMode,
    hintState,
    closeHintModal,
    checkForNewDay,
    toggleAnimations,
  } = useGameStore();

  const { themeIcon, themeToggleLabel, toggleTheme } = useTheme();

  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [notification, setNotification] = useState('');
  const [snarkMessage, setSnarkMessage] = useState('');

  useEffect(() => {
    if (gameState === 'won' || gameState === 'lost') {
      setShowModal(true);
    }
  }, [gameState]);

  // Check for new day when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkForNewDay();
      }
    };

    const handleFocus = () => {
      checkForNewDay();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkForNewDay]);

  const handleColorSelect = (position: 'primary' | 'secondary' | 'tertiary', color: any) => {
    const result = setColor(position, color);
    handleGameResult(result, showNotification, showSnarkMessage);
  };

  const handlePatternSelect = (pattern: any) => {
    const result = setPattern(pattern);
    handleGameResult(result, showNotification, showSnarkMessage);
  };

  const handleSubmitGuess = () => {
    const result = submitGuess();
    handleGameResult(result, showNotification, showSnarkMessage);
  };

  const handleClearAttribute = (attribute: 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern') => {
    const result = clearAttribute(attribute);
    handleGameResult(result, showNotification, showSnarkMessage);
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), TIMING.NOTIFICATION_DURATION);
  };

  const showSnarkMessage = (message: string) => {
    setSnarkMessage(message);
    setTimeout(() => setSnarkMessage(''), TIMING.SNARK_MESSAGE_DURATION);
  };

  const handleNewGame = () => {
    startTestMode();
    setShowModal(false);
  };

  const isGameOver = gameState === 'won' || gameState === 'lost';
  const canSubmit = isGuessComplete(currentGuess);

  // Create CSS class helpers
  const buttonClasses = {
    mobile: `${CSS_CLASSES.buttonMobile} ${CSS_CLASSES.buttonHover} ${CSS_CLASSES.buttonBase}`,
    desktop: `${CSS_CLASSES.buttonDesktop} ${CSS_CLASSES.buttonHover} ${CSS_CLASSES.buttonBase}`,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 shadow-sm">
        <div className="max-w-4xl mx-auto">
          {/* Mobile: Compact layout, Desktop: Row layout */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">

            {/* Mobile: Title and buttons in compact layout */}
            <div className="flex items-center justify-between sm:hidden">
              <div className="flex gap-1">
                <button
                  onClick={() => setShowStats(true)}
                  className={buttonClasses.mobile}
                  title={BUTTON_CONFIGS.stats.title}
                  aria-label={BUTTON_CONFIGS.stats.ariaLabel}
                >
                  {BUTTON_CONFIGS.stats.icon}
                </button>
                <button
                  onClick={() => setShowHowToPlay(true)}
                  className={buttonClasses.mobile}
                  title={BUTTON_CONFIGS.help.title}
                  aria-label={BUTTON_CONFIGS.help.ariaLabel}
                >
                  {BUTTON_CONFIGS.help.icon}
                </button>
              </div>

              <h1 className="text-lg font-bold text-gray-700 dark:text-gray-200 text-center flex-1 mx-2">
                {GAME_TITLE} {isDailyMode ? `#${puzzleNumber}` : ''}
              </h1>

              <div className="flex gap-1">
                <button
                  onClick={handleNewGame}
                  className={buttonClasses.mobile}
                  title={getNewGameTitle(isDailyMode)}
                  aria-label={getNewGameAriaLabel(isDailyMode)}
                >
                  {BUTTON_CONFIGS.newGame.icon}
                </button>
                <button
                  onClick={toggleTheme}
                  className={buttonClasses.mobile}
                  title={BUTTON_CONFIGS.theme.title}
                  aria-label={themeToggleLabel}
                >
                  {themeIcon}
                </button>
              </div>
            </div>

            {/* Desktop layout - same as before */}
            <div className="hidden sm:flex sm:justify-between sm:items-center sm:w-full">
              {/* Left buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowStats(true)}
                  className={buttonClasses.desktop}
                  title={BUTTON_CONFIGS.stats.title}
                  aria-label={BUTTON_CONFIGS.stats.ariaLabel}
                >
                  {BUTTON_CONFIGS.stats.icon} {BUTTON_CONFIGS.stats.label}
                </button>
                <button
                  onClick={() => setShowHowToPlay(true)}
                  className={buttonClasses.desktop}
                  title={BUTTON_CONFIGS.help.title}
                  aria-label={BUTTON_CONFIGS.help.ariaLabel}
                >
                  {BUTTON_CONFIGS.help.icon} {BUTTON_CONFIGS.help.label}
                </button>
              </div>

              {/* Center title */}
              <div className="flex flex-col items-center text-center flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-200">
                  {GAME_TITLE} {isDailyMode ? `#${puzzleNumber}` : ''}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {getGameModeLabel(isDailyMode)} - {GAME_MODE_LABELS.subtitle}
                </p>
              </div>

              {/* Right buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleNewGame}
                  className={`${buttonClasses.desktop} text-sm`}
                  title={getNewGameTitle(isDailyMode)}
                  aria-label={getNewGameAriaLabel(isDailyMode)}
                >
                  {BUTTON_CONFIGS.newGame.icon} {getNewGameButtonText(isDailyMode)}
                </button>
                <button
                  onClick={toggleTheme}
                  className={buttonClasses.desktop}
                  title={BUTTON_CONFIGS.theme.title}
                  aria-label={themeToggleLabel}
                >
                  {themeIcon}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg shadow-lg z-50 font-medium">
          {notification}
        </div>
      )}

      <main className="max-w-4xl mx-auto p-4">
        {/* Single Column Game Board with Integrated Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 relative">
          {/* Seal parade with flag trail */}
          <SealParade enabled={config.animationsEnabled} />

          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold mb-1">{GAME_TITLE}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Guess the flag</p>
          </div>

          <GameBoard
            guesses={guesses}
            currentGuess={currentGuess}
            maxAttempts={config.maxAttempts}
            onColorSelect={handleColorSelect}
            onPatternSelect={handlePatternSelect}
            onClearAttribute={handleClearAttribute}
            onSubmitGuess={handleSubmitGuess}
            canSubmit={canSubmit}
            disabled={isGameOver}
          />

          {/* Manual Hint Button */}
          <div className="flex justify-center mt-4">
            <HintButton />
          </div>

          {/* Snark Message */}
          {snarkMessage && (
            <div className="mt-4 text-center animate-fade-in">
              <p className="text-sm text-orange-600 dark:text-orange-400 italic font-medium">
                {snarkMessage}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <GameModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        gameState={gameState}
        solution={solution}
        guessCount={currentRow}
        stats={stats}
        hintState={hintState}
        onNewGame={handleNewGame}
      />

      <GameStats
        stats={stats}
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />

      <HintModal
        isOpen={hintState.showModal}
        onClose={closeHintModal}
        newHint={hintState.latestHint || undefined}
      />

      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />

      {/* Footer with tech badges and animation toggle */}
      <footer className="mt-8 pb-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            {/* Tech badges */}
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <img
                src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"
                alt="React"
                className="h-5"
              />
              <img
                src="https://img.shields.io/badge/Zustand-FF6B35?style=for-the-badge&logo=react&logoColor=white"
                alt="Zustand"
                className="h-5"
              />
              <img
                src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white"
                alt="Bun"
                className="h-5"
              />
            </div>

            {/* Animation toggle */}
            <button
              onClick={toggleAnimations}
              className={`px-3 py-1 text-xs rounded-full transition-colors border ${
                config.animationsEnabled
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600'
              }`}
              title={config.animationsEnabled ? 'Disable animations (better performance)' : 'Enable animations'}
              aria-label={config.animationsEnabled ? 'Disable animations' : 'Enable animations'}
            >
              🦭 {config.animationsEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
