import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { GameBoard } from './GameBoard';
import { GameModal } from './GameModal';
import { GameStats } from './GameStats';
import { HintButton } from './HintButton';
import { HintModal } from './HintModal';
import { isGuessComplete } from '../utils/flagHelpers';

export const Game = () => {
  const {
    gameState,
    solution,
    guesses,
    currentGuess,
    currentRow,
    config,
    stats,
    setColor,
    setPattern,
    clearAttribute,
    submitGuess,
    resetGame,
    setTheme,
    hintState,
    closeHintModal,
  } = useGameStore();

  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (gameState === 'won' || gameState === 'lost') {
      setShowModal(true);
    }
  }, [gameState]);

  const handleColorSelect = (position: 'primary' | 'secondary' | 'tertiary', color: any) => {
    const result = setColor(position, color);
    if (!result.success && result.error) {
      showNotification(result.error);
    }
  };

  const handlePatternSelect = (pattern: any) => {
    const result = setPattern(pattern);
    if (!result.success && result.error) {
      showNotification(result.error);
    }
  };

  const handleSubmitGuess = () => {
    const result = submitGuess();
    if (!result.success && result.error) {
      showNotification(result.error);
    } else if (result.success && result.message) {
      showNotification(result.message);
    }
  };

  const handleClearAttribute = (attribute: 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern') => {
    const result = clearAttribute(attribute);
    if (!result.success && result.error) {
      showNotification(result.error);
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleNewGame = () => {
    resetGame();
    setShowModal(false);
  };

  const toggleTheme = () => {
    const newTheme = config.theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const isGameOver = gameState === 'won' || gameState === 'lost';
  const canSubmit = isGuessComplete(currentGuess);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => setShowStats(true)}
            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Statistics"
          >
            📊 Stats
          </button>

          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Flagdle</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Guess the flag by its colors and patterns</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleNewGame}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="New game"
            >
              🎮 New Game
            </button>

            <button
              onClick={toggleTheme}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Toggle theme"
            >
              {config.theme === 'dark' ? '☀️' : '🌙'}
            </button>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-center">Flagdle - Guess the Flag</h2>
          
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
    </div>
  );
};
