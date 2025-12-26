import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { GameBoard } from './GameBoard';
import { Keyboard } from './Keyboard';
import { GameModal } from './GameModal';
import { GameStats } from './GameStats';

export const Game = () => {
  const {
    gameState,
    solution,
    guesses,
    currentGuess,
    currentRow,
    config,
    stats,
    keyboardState,
    addLetter,
    removeLetter,
    submitGuess,
    resetGame,
    setTheme,
  } = useGameStore();

  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (gameState === 'won' || gameState === 'lost') {
      setShowModal(true);
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showModal || showStats) return;

      const key = event.key.toUpperCase();

      if (key === 'ENTER') {
        event.preventDefault();
        handleSubmitGuess();
      } else if (key === 'BACKSPACE') {
        event.preventDefault();
        const result = removeLetter();
        if (!result.success && result.error) {
          showNotification(result.error);
        }
      } else if (/^[A-Z]$/.test(key)) {
        event.preventDefault();
        const result = addLetter(key);
        if (!result.success && result.error) {
          showNotification(result.error);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [addLetter, removeLetter, showModal, showStats]);

  const handleKeyPress = (key: string) => {
    if (key === 'ENTER') {
      handleSubmitGuess();
    } else if (key === 'BACKSPACE') {
      const result = removeLetter();
      if (!result.success && result.error) {
        showNotification(result.error);
      }
    } else {
      const result = addLetter(key);
      if (!result.success && result.error) {
        showNotification(result.error);
      }
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

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 2000);
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-lg mx-auto flex justify-between items-center grow">
          <button
            onClick={() => setShowStats(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            title="Statistics"
          >
            📊 Stats
          </button>

          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Flagdle</h1>
            <p className="text-xs opacity-70">A word game that wants to ruin your day</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleNewGame}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              title="New game"
            >
              🎮 New Game
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              title="Toggle theme"
            >
              {config.theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded z-40">
          {notification}
        </div>
      )}

      {/* Game Board */}
      <main className="flex-1 flex flex-col justify-between max-w-lg mx-auto">
        <GameBoard
          guesses={guesses}
          currentGuess={currentGuess}
          maxAttempts={config.maxAttempts}
          wordLength={config.wordLength}
        />

        {/* Keyboard */}
        <Keyboard
          onKeyPress={handleKeyPress}
          keyboardState={keyboardState}
          disabled={isGameOver}
        />
      </main>

      {/* Modals */}
      <GameModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        gameState={gameState}
        solution={solution}
        guessCount={currentRow}
        stats={stats}
        onNewGame={handleNewGame}
      />

      <GameStats
        stats={stats}
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />
    </div>
  );
};
