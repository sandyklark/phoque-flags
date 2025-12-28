import type { GameStats as GameStatsType } from '../types/game';

interface GameStatsProps {
  stats: GameStatsType;
  isOpen: boolean;
  onClose: () => void;
}

export const GameStats = ({ stats, isOpen, onClose }: GameStatsProps) => {
  if (!isOpen) return null;

  const winPercentage = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;

  const maxGuesses = Math.max(...Object.keys(stats.guessDistribution).map(Number), 6);
  const maxCount = Math.max(...Object.values(stats.guessDistribution), 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Statistics</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-gray-600 dark:hover:text-gray-400"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 text-center mb-6">
          <div>
            <div className="text-3xl font-bold">{stats.gamesPlayed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Played</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{winPercentage}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Win %</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{stats.currentStreak}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{stats.maxStreak}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Max Streak</div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Guess Distribution</h3>
          <div className="space-y-1">
            {Array.from({ length: maxGuesses }, (_, i) => i + 1).map((guess) => {
              const count = stats.guessDistribution[guess] || 0;
              const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
              
              return (
                <div key={guess} className="flex items-center gap-2">
                  <div className="w-4 text-right">{guess}</div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded">
                    <div
                      className="bg-emerald-600 text-white text-right pr-2 rounded text-sm font-medium h-6 flex items-center justify-end"
                      style={{ width: `${Math.max(percentage, count > 0 ? 8 : 0)}%` }}
                    >
                      {count > 0 ? count : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};