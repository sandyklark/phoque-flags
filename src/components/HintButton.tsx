import { useGameStore } from '../store/gameStore';

export const HintButton = () => {
  const { hintState, getHint, gameState } = useGameStore();

  const handleGetHint = () => {
    getHint();
  };

  const canUseHint = gameState === 'playing' && hintState.hintsUsed < hintState.maxHints;
  const hintsRemaining = hintState.maxHints - hintState.hintsUsed;

  return (
    <button
      onClick={handleGetHint}
      disabled={!canUseHint}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
        ${canUseHint
          ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md hover:shadow-lg'
          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }
      `}
      title={canUseHint ? `Get a manual hint (${hintsRemaining} remaining)` : 'No hints remaining'}
    >
      <span className="text-lg">💡</span>
      <span>
        Manual Hint {hintsRemaining > 0 ? `(${hintsRemaining})` : '(0)'}
      </span>
    </button>
  );
};