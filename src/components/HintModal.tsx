import { useGameStore } from '../store/gameStore';

const hintIcons = ['🌍', '📍', '🔤'];
const hintTypes = ['Continent', 'Region', 'First Letter'];

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  newHint?: string;
}

export const HintModal = ({ isOpen, onClose, newHint }: HintModalProps) => {
  const { hintState } = useGameStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">💡</span>
            <h2 className="text-xl font-bold">Hints</h2>
          </div>

          {/* Show new hint prominently if provided */}
          {newHint && (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 justify-center">
                <span className="text-2xl">
                  {hintIcons[hintState.hintsUsed - 1] || '💡'}
                </span>
                <div>
                  <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    New {hintTypes[hintState.hintsUsed - 1] || 'Hint'}!
                  </div>
                  <div className="text-yellow-800 dark:text-yellow-200 font-medium">
                    {newHint}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Show all hints */}
          {hintState.hintHistory.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                All Hints ({hintState.hintHistory.length})
              </h3>
              {hintState.hintHistory.map((hint, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg border-l-3 ${
                    index === hintState.hintHistory.length - 1 && newHint
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">
                    {hintIcons[index] || '💡'}
                  </span>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {hintTypes[index] || 'Hint'} #{index + 1}
                    </div>
                    <div className="text-sm text-gray-800 dark:text-gray-200">
                      {hint}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No hints yet. Hints will appear automatically as you play, or you can request them manually.
            </p>
          )}

          <div className="mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};