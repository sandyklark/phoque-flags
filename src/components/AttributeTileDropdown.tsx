import { useState, useRef, useEffect } from 'react';
import type { FlagColor, FlagPattern } from '../types/game';
import gameOptions from '../data/gameOptions.json';
import { 
  GripHorizontal, 
  GripVertical, 
  Plus, 
  Circle, 
  Star, 
  Shapes, 
  Diamond, 
  Triangle, 
  Layers, 
  Square,
  TrendingUp,
  Grip
} from 'lucide-react';

const colorStyles: Record<FlagColor, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  white: 'bg-white border border-gray-400',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  black: 'bg-black',
  orange: 'bg-orange-500'
};

const patternInfo: Record<FlagPattern, { icon: React.ComponentType<any>; description: string }> = {
  'stripes': { icon: Grip, description: 'General stripes' },
  'horizontal-stripes': { icon: GripHorizontal, description: 'Horizontal stripes' },
  'vertical-stripes': { icon: GripVertical, description: 'Vertical stripes' },
  'cross': { icon: Plus, description: 'Cross pattern' },
  'circle': { icon: Circle, description: 'Circle/dot' },
  'stars': { icon: Star, description: 'Star(s)' },
  'symbol': { icon: Shapes, description: 'Symbol/emblem' },
  'diamond': { icon: Diamond, description: 'Diamond shape' },
  'triangle': { icon: Triangle, description: 'Triangle shape' },
  'complex': { icon: Layers, description: 'Complex pattern' },
  'solid': { icon: Square, description: 'Solid color' },
  'diagonal': { icon: TrendingUp, description: 'Diagonal pattern' }
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
  const [dropdownPosition, setDropdownPosition] = useState<'center' | 'left' | 'right'>('center');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
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

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = isPattern ? 288 : 256; // w-72 = 288px, w-64 = 256px
      const viewportWidth = window.innerWidth;
      const margin = 16; // 1rem margin

      // Check if centered position would go off screen
      const centeredLeft = buttonRect.left + buttonRect.width / 2 - dropdownWidth / 2;
      const centeredRight = centeredLeft + dropdownWidth;

      if (centeredLeft < margin) {
        setDropdownPosition('left');
      } else if (centeredRight > viewportWidth - margin) {
        setDropdownPosition('right');
      } else {
        setDropdownPosition('center');
      }
    }
  }, [isOpen, isPattern]);

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
      const PatternIcon = patternInfo[value as FlagPattern].icon;
      return (
        <div className="flex items-center justify-center w-full h-full">
          <PatternIcon size={20} className="text-gray-700 dark:text-gray-200" />
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
            const { icon: PatternIcon, description } = patternInfo[pattern];
            return (
              <button
                key={pattern}
                onClick={() => handleSelection(pattern)}
                className="w-full flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <div className="mr-3 flex items-center justify-center w-6">
                  <PatternIcon size={16} className="text-gray-600 dark:text-gray-300" />
                </div>
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
              aria-label={`Select ${color} color`}
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
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Select ${type.replace('Color', ' color').replace(/([A-Z])/g, ' $1').toLowerCase()}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
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
          absolute top-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
          rounded-lg shadow-lg z-50 p-2 max-h-64 overflow-y-auto
          ${isPattern ? 'w-72 sm:w-72' : 'w-64 sm:w-64'}
          max-w-[calc(100vw-2rem)]
          ${dropdownPosition === 'center' ? 'left-1/2 transform -translate-x-1/2' : ''}
          ${dropdownPosition === 'left' ? 'left-0' : ''}
          ${dropdownPosition === 'right' ? 'right-0' : ''}
        `}>
          {getDropdownContent()}
        </div>
      )}
    </div>
  );
};