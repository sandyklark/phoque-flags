import type { GameModalProps } from '../types/game';
import { FlagIcon } from './FlagIcon';

export const GameModal = ({ 
  isOpen, 
  onClose, 
  gameState, 
  solution, 
  guessCount, 
  stats, 
  hintState,
  onNewGame 
}: GameModalProps) => {
  if (!isOpen) return null;

  const handleShare = async () => {
    const shareText = `Flagdle ${guessCount}/5\n\n${gameState === 'won' ? '🎯' : '❌'} ${solution.name} ${solution.flagEmoji}\n\nPlay at flagdle.com`;
    
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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {gameState === 'won' ? '🎉 Congratulations!' : '😔 Better luck next time!'}
          </h2>
          
          {/* Flag Display */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex justify-center mb-2">
              <FlagIcon countryCode={solution.id} size={96} className="border border-gray-300 dark:border-gray-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">{solution.name}</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Continent:</strong> {solution.continent}</p>
              <p><strong>Primary Color:</strong> {solution.primaryColor}</p>
              <p><strong>Secondary Color:</strong> {solution.secondaryColor}</p>
              {solution.tertiaryColor && (
                <p><strong>Tertiary Color:</strong> {solution.tertiaryColor}</p>
              )}
              <p><strong>Pattern:</strong> {solution.pattern.replace('-', ' ')}</p>
            </div>
          </div>

          {gameState === 'won' ? (
            <div className="mb-4">
              <p className="text-green-600 dark:text-green-400 font-semibold">
                You guessed the flag in {guessCount} {guessCount === 1 ? 'try' : 'tries'}!
              </p>
              {hintState.hintsUsed > 0 && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                  💡 {hintState.hintsUsed} hint{hintState.hintsUsed === 1 ? '' : 's'} used
                </p>
              )}
            </div>
          ) : (
            <div className="mb-4">
              <p className="text-red-600 dark:text-red-400">
                Don't worry, flags can be tricky!
              </p>
              {hintState.hintsUsed > 0 && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                  💡 {hintState.hintsUsed} hint{hintState.hintsUsed === 1 ? '' : 's'} used
                </p>
              )}
            </div>
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
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Share
            </button>
            <button
              onClick={onNewGame}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              New Game
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};