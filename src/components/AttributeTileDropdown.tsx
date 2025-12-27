import { useState, useRef, useEffect } from 'react';
import type { FlagColor, FlagPattern } from '../types/game';
import gameOptions from '../data/gameOptions.json';

const colorStyles: Record<FlagColor, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  white: 'bg-white border border-gray-400',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  black: 'bg-black',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  brown: 'bg-amber-800',
  gray: 'bg-gray-500'
};

const patternInfo: Record<FlagPattern, { emoji: string; description: string }> = {
  'stripes': { emoji: '▦', description: 'General stripes' },
  'horizontal-stripes': { emoji: '≡', description: 'Horizontal stripes' },
  'vertical-stripes': { emoji: '⫸', description: 'Vertical stripes' },
  'cross': { emoji: '✝', description: 'Cross pattern' },
  'circle': { emoji: '●', description: 'Circle/dot' },
  'stars': { emoji: '✦', description: 'Star(s)' },
  'symbol': { emoji: '⚡', description: 'Symbol/emblem' },
  'diamond': { emoji: '◆', description: 'Diamond shape' },
  'triangle': { emoji: '▲', description: 'Triangle shape' },
  'complex': { emoji: '◈', description: 'Complex pattern' },
  'solid': { emoji: '■', description: 'Solid color' },
  'diagonal': { emoji: '▦', description: 'Diagonal pattern' }
};

interface AttributeTileDropdownProps {
  type: 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern';
  value: FlagColor | FlagPattern | null;
  onChange: (value: FlagColor | FlagPattern) => void;
  onClear: () => void;
  isOptional?: boolean;
}

export const AttributeTileDropdown = ({ type, value, onChange, onClear, isOptional = false }: AttributeTileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const isPattern = type === 'pattern';
  const colors = gameOptions.colors as FlagColor[];
  const patterns = gameOptions.patterns as FlagPattern[];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelection = (selectedValue: FlagColor | FlagPattern) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const handleClear = () => {
    onClear();
    setIsOpen(false);
  };


  const getTileContent = () => {
    if (!value) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-8 h-8 rounded border-2 border-dashed border-gray-400 dark:border-gray-500 flex items-center justify-center">
            <span className="text-xs text-gray-400">?</span>
          </div>
        </div>
      );
    }

    if (isPattern) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-2xl">{patternInfo[value as FlagPattern].emoji}</span>
        </div>
      );
    } else {
      // Color attribute
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div 
            className={`w-8 h-8 rounded-full ${colorStyles[value as FlagColor]} ${
              value === 'white' ? 'border border-gray-400' : ''
            }`}
          />
        </div>
      );
    }
  };

  const getDropdownContent = () => {
    if (isPattern) {
      return (
        <div className="space-y-1">
          {patterns.map((pattern) => {
            const { emoji, description } = patternInfo[pattern];
            return (
              <button
                key={pattern}
                onClick={() => handleSelection(pattern)}
                className="w-full flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <span className="text-xl mr-3">{emoji}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium capitalize">{pattern.replace('-', ' ')}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>
                </div>
              </button>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-1">
          {/* None option for optional fields */}
          {isOptional && (
            <button
              onClick={handleClear}
              className="flex flex-col items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-dashed border-gray-400"
            >
              <div className="w-6 h-6 rounded-full bg-white border border-gray-400 relative flex items-center justify-center">
                <span className="text-gray-500 text-xs font-bold">∅</span>
              </div>
              <span className="text-xs mt-1 text-gray-500">None</span>
            </button>
          )}
          
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleSelection(color)}
              className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title={color}
            >
              <div className={`w-8 h-8 rounded-full mx-auto ${colorStyles[color]} ${color === 'white' ? 'border border-gray-400' : ''}`} />
            </button>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Clickable Tile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-300
          ${value 
            ? 'bg-white dark:bg-gray-600 border-blue-300 dark:border-blue-600 text-gray-800 dark:text-gray-200' 
            : 'bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-300'
          }
          hover:bg-gray-50 dark:hover:bg-gray-500 hover:border-blue-400 dark:hover:border-blue-500
          cursor-pointer
        `}
      >
        {getTileContent()}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`
          absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
          rounded-lg shadow-lg z-50 p-2 max-h-64 overflow-y-auto
          ${isPattern ? 'w-72 sm:w-72' : 'w-64 sm:w-64'}
          max-w-[calc(100vw-2rem)]
        `}>
          {getDropdownContent()}
        </div>
      )}
    </div>
  );
};