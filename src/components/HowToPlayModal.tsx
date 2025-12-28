import { X } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal = ({ isOpen, onClose }: HowToPlayModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">How to Play</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Objective */}
          <section>
            <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">🎯 Objective</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Guess the country flag by identifying its colors and pattern. You have 5 attempts to get it right!
            </p>
          </section>

          {/* How to Guess */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">🎮 How to Make a Guess</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-orange-500 font-bold">1.</span>
                <div>
                  <strong>Choose Primary Color:</strong> Select the most prominent color on the flag
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 font-bold">2.</span>
                <div>
                  <strong>Choose Secondary Color (optional):</strong> Pick the second most common color
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 font-bold">3.</span>
                <div>
                  <strong>Choose Tertiary Color (optional):</strong> Add a third color if present
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 font-bold">4.</span>
                <div>
                  <strong>Select Pattern:</strong> Choose the flag's design pattern (stripes, solid, cross, etc.)
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 font-bold">5.</span>
                <div>
                  <strong>Submit:</strong> Click "Submit Guess" when you're ready
                </div>
              </div>
            </div>
          </section>

          {/* Feedback System */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">💡 Understanding Feedback</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                <span><strong>Green:</strong> Correct color/pattern in the right position</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="w-4 h-4 bg-amber-600 rounded"></div>
                <span><strong>Amber:</strong> Color is in the flag but in the wrong position</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span><strong>Gray:</strong> Color/pattern is not in the flag</span>
              </div>
            </div>
          </section>

          {/* Patterns */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">🏁 Pattern Types</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>• Horizontal stripes</div>
              <div>• Vertical stripes</div>
              <div>• Diagonal stripes</div>
              <div>• Cross/Nordic cross</div>
              <div>• Union Jack style</div>
              <div>• Solid color</div>
              <div>• Triangle</div>
              <div>• Complex design</div>
            </div>
          </section>

          {/* Hints */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">🔍 Hint System</h3>
            <div className="space-y-2">
              <p><strong>Automatic hints unlock as you play:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>After 2 wrong guesses: Continent hint</li>
                <li>After 4 wrong guesses: Region hint</li>
                <li>After all guesses used: First letter hint</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                💡 You can also manually request hints using the hint button!
              </p>
            </div>
          </section>

          {/* Game Modes */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">📅 Game Modes</h3>
            <div className="space-y-2">
              <div>
                <strong>Daily Mode:</strong> Everyone gets the same flag each day. Perfect for sharing results!
              </div>
              <div>
                <strong>Practice Mode:</strong> Play unlimited games with random flags to improve your skills.
              </div>
            </div>
          </section>

          {/* Tips */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">✨ Pro Tips</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Start with the most obvious colors you can see</li>
              <li>Pay attention to the pattern - it's often the key!</li>
              <li>Remember that some flags have very similar color schemes</li>
              <li>Use hints strategically if you're stuck</li>
              <li>Practice mode is great for learning flag patterns</li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Got it! Let's play 🦭
          </button>
        </div>
      </div>
    </div>
  );
};