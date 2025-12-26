import { useEffect } from 'react';
import { Game } from './components/Game';
import { useGameStore } from './store/gameStore';

function App() {
  const { setTheme, config } = useGameStore();

  useEffect(() => {
    // Initialize theme on app start
    setTheme(config.theme);
  }, [setTheme, config.theme]);

  return <Game />;
}

export default App;