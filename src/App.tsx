import { GameProvider, useGame } from './store/gameState';
import Starfield from './components/Starfield';
import StartScreen from './pages/StartScreen';
import Station1Puzzle from './pages/Station1Puzzle';
import Station2Planets from './pages/Station2Planets';
import Station3Memory from './pages/Station3Memory';
import Station4Console from './pages/Station4Console';
import VictoryScreen from './pages/VictoryScreen';
import GameOverScreen from './pages/GameOverScreen';

function GameRouter() {
  const { isStarted, currentStation, isComplete, isGameOver } = useGame();

  if (isGameOver) return <GameOverScreen />;
  if (isComplete) return <VictoryScreen />;
  if (!isStarted) return <StartScreen />;

  switch (currentStation) {
    case 1:
      return <Station1Puzzle />;
    case 2:
      return <Station2Planets />;
    case 3:
      return <Station3Memory />;
    case 4:
      return <Station4Console />;
    default:
      return <StartScreen />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <div className="noise-overlay">
        <Starfield />
        <GameRouter />
      </div>
    </GameProvider>
  );
}
