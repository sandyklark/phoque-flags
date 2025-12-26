import type { GameModalProps } from '../types/game';
import { getShareText } from '../utils/gameHelpers';

export const GameModal = ({ 
  isOpen, 
  onClose, 
  gameState, 
  solution, 
  guessCount, 
  stats, 
  onNewGame 
}: GameModalProps) => {
  if (!isOpen) return null;

  const handleShare = async () => {
    const shareText = getShareText([], gameState === 'won');
    
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
    }
  };

  const winPercentage = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {gameState === 'won' ? '🎉 Congratulations!' : '😔 Better luck next time!'}
          </h2>
          
          {gameState === 'won' ? (
            <p className="mb-4">
              You guessed the word <strong>{solution}</strong> in {guessCount} {guessCount === 1 ? 'try' : 'tries'}!
            </p>
          ) : (
            <p className="mb-4">
              The word was <strong>{solution}</strong>
            </p>
          )}

          <div className="border-t border-b py-4 my-4">
            <h3 className="font-semibold mb-2">Statistics</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Played</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{winPercentage}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Win</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.currentStreak}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Current</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.maxStreak}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Max</div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Share
            </button>
            <button
              onClick={onNewGame}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              New Game
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};