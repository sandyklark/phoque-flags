import { useGameStore } from '../store/gameStore';
import { BUTTON_CONFIGS, DARK_MODE_MEDIA_QUERY } from '../constants/game.constants';

export interface ThemeHookReturn {
  isDarkModeActive: boolean;
  themeIcon: string;
  themeToggleLabel: string;
  toggleTheme: () => void;
}

/**
 * Custom hook to manage theme state and provide theme-related utilities
 */
export const useTheme = (): ThemeHookReturn => {
  const { config, setTheme } = useGameStore();

  // Use the theme from config, but handle 'auto' by checking system preference
  const isDarkModeActive = config.theme === 'dark' || 
    (config.theme === 'auto' && window.matchMedia(DARK_MODE_MEDIA_QUERY).matches);

  const themeIcon = isDarkModeActive ? BUTTON_CONFIGS.theme.icons.dark : BUTTON_CONFIGS.theme.icons.light;
  const themeToggleLabel = `Switch to ${isDarkModeActive ? 'light' : 'dark'} theme`;

  const toggleTheme = () => {
    const newTheme = isDarkModeActive ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return {
    isDarkModeActive,
    themeIcon,
    themeToggleLabel,
    toggleTheme,
  };
};