import type { FlagColor, ColorPickerProps } from '../types/game';
import gameOptions from '../data/gameOptions.json';

const colorStyles: Record<FlagColor, string> = {
  red: 'bg-red-500 hover:bg-red-600',
  blue: 'bg-blue-500 hover:bg-blue-600', 
  white: 'bg-white border-2 border-gray-300 hover:bg-gray-50',
  green: 'bg-green-500 hover:bg-green-600',
  yellow: 'bg-yellow-400 hover:bg-yellow-500',
  black: 'bg-black hover:bg-gray-800',
  orange: 'bg-orange-500 hover:bg-orange-600',
  purple: 'bg-purple-500 hover:bg-purple-600',
  pink: 'bg-pink-500 hover:bg-pink-600',
  brown: 'bg-amber-800 hover:bg-amber-900',
  gray: 'bg-gray-500 hover:bg-gray-600'
};

export const ColorPicker = ({ onColorSelect, currentGuess, disabled }: ColorPickerProps) => {
  const colors = gameOptions.colors as FlagColor[];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center mb-4">Select Colors</h3>
      
      {/* Primary Color */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Primary Color {currentGuess.primaryColor && `(${currentGuess.primaryColor})`}
        </label>
        <div className="grid grid-cols-6 gap-2">
          {colors.map((color) => (
            <button
              key={`primary-${color}`}
              className={`w-10 h-10 rounded-lg transition-all ${colorStyles[color]} ${
                currentGuess.primaryColor === color ? 'ring-4 ring-blue-400' : ''
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => !disabled && onColorSelect('primary', color)}
              disabled={disabled}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Secondary Color */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Secondary Color {currentGuess.secondaryColor && `(${currentGuess.secondaryColor})`}
        </label>
        <div className="grid grid-cols-6 gap-2">
          {colors.map((color) => (
            <button
              key={`secondary-${color}`}
              className={`w-10 h-10 rounded-lg transition-all ${colorStyles[color]} ${
                currentGuess.secondaryColor === color ? 'ring-4 ring-green-400' : ''
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => !disabled && onColorSelect('secondary', color)}
              disabled={disabled}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Tertiary Color */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Tertiary Color (Optional) {currentGuess.tertiaryColor && `(${currentGuess.tertiaryColor})`}
        </label>
        <div className="grid grid-cols-6 gap-2">
          {colors.map((color) => (
            <button
              key={`tertiary-${color}`}
              className={`w-10 h-10 rounded-lg transition-all ${colorStyles[color]} ${
                currentGuess.tertiaryColor === color ? 'ring-4 ring-purple-400' : ''
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => !disabled && onColorSelect('tertiary', color)}
              disabled={disabled}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};