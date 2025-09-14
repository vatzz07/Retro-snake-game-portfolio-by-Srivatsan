import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Position, Food, PortfolioSection } from '../App';

interface SnakeGameProps {
  gameState: GameState;
  gameMode: 'portfolio' | 'classic';
  onFoodCollected: (foodType: PortfolioSection) => void;
  onGameOver: () => void;
  collectedSections: Set<PortfolioSection>;
  score: number;
  onDirectionChangeRef?: React.MutableRefObject<((direction: Position) => void) | null>;
}

const GRID_SIZE = 20;
const GAME_SPEED = 150;

export const SnakeGame: React.FC<SnakeGameProps> = ({
  gameState,
  gameMode,
  onFoodCollected,
  onGameOver,
  collectedSections,
  score,
  onDirectionChangeRef
}) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 });
  const [food, setFood] = useState<Food[]>([]);
  const [nearbyFood, setNearbyFood] = useState<Food | null>(null);
  const gameLoopRef = useRef<number>();

  const foodTypes: PortfolioSection[] = ['about', 'skills', 'projects', 'contact'];
  const foodIcons = {
    about: '👨‍💻',
    skills: '⚡',
    projects: '🎮',
    contact: '📱'
  };

  // Generate random food position
  const generateFood = useCallback(() => {
    if (gameMode === 'classic') {
      return {
        position: {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE)
        },
        type: null,
        collected: false
      };
    }

    const availableTypes = foodTypes.filter(type => !collectedSections.has(type));
    if (availableTypes.length === 0) return null;

    const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    return {
      position: {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      },
      type: randomType,
      collected: false
    };
  }, [collectedSections, gameMode]);

  // Initialize food
  useEffect(() => {
    if (gameState === 'playing') {
      const initialFood = [];
      const maxFood = gameMode === 'classic' ? 1 : Math.min(2, 4 - collectedSections.size);
      
      for (let i = 0; i < maxFood; i++) {
        const newFood = generateFood();
        if (newFood) {
          // Ensure food doesn't spawn on snake's initial position
          const isOnSnake = newFood.position.x === 10 && newFood.position.y === 10;
          if (!isOnSnake) {
            initialFood.push(newFood);
          } else {
            // Try again with different position
            let attempts = 0;
            let altFood = generateFood();
            while (altFood && (altFood.position.x === 10 && altFood.position.y === 10) && attempts < 10) {
              altFood = generateFood();
              attempts++;
            }
            if (altFood && !(altFood.position.x === 10 && altFood.position.y === 10)) {
              initialFood.push(altFood);
            }
          }
        }
      }
      setFood(initialFood);
    }
  }, [gameState, generateFood, collectedSections.size, gameMode]);

  // Reset game
  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: 0 });
    setFood([]);
    setNearbyFood(null);
  }, []);

  // Handle direction change
  const handleDirectionChange = useCallback((newDirection: Position) => {
    if (gameState !== 'playing') return;
    
    setDirection(prev => {
      // Prevent reversing into self
      if (prev.x === -newDirection.x && prev.y === -newDirection.y) {
        return prev;
      }
      // Only change if moving perpendicular to current direction
      if (prev.x === 0 && newDirection.x !== 0) return newDirection;
      if (prev.y === 0 && newDirection.y !== 0) return newDirection;
      return prev;
    });
  }, [gameState]);

  // Expose direction change function to parent via ref
  useEffect(() => {
    if (onDirectionChangeRef) {
      onDirectionChangeRef.current = handleDirectionChange;
    }
  }, [onDirectionChangeRef, handleDirectionChange]);

  // Check for nearby food to show labels
  useEffect(() => {
    if (gameMode === 'portfolio' && snake.length > 0) {
      const head = snake[0];
      const nearby = food.find(f => {
        const distance = Math.abs(f.position.x - head.x) + Math.abs(f.position.y - head.y);
        return distance <= 3 && !f.collected;
      });
      setNearbyFood(nearby || null);
    } else {
      setNearbyFood(null);
    }
  }, [snake, food, gameMode]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;
    
    // Don't move if no direction is set (snake is stationary)
    if (direction.x === 0 && direction.y === 0) return;

    setSnake(currentSnake => {
      if (currentSnake.length === 0) return currentSnake;

      const head = currentSnake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
      };

      // Wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        onGameOver();
        return currentSnake;
      }

      // Self collision
      if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        onGameOver();
        return currentSnake;
      }

      const newSnake = [newHead, ...currentSnake];
      
      // Check for food collision
      setFood(currentFood => {
        let foodEaten = false;
        const newFood = currentFood.map(f => {
          if (f.position.x === newHead.x && f.position.y === newHead.y && !f.collected) {
            onFoodCollected(f.type);
            foodEaten = true;
            return { ...f, collected: true };
          }
          return f;
        }).filter(f => !f.collected);

        // Add new food if needed
        const maxFood = gameMode === 'classic' ? 1 : Math.min(2, 4 - collectedSections.size);
        if (newFood.length < maxFood) {
          const additionalFood = generateFood();
          if (additionalFood) {
            // Ensure food doesn't spawn on snake
            const isOnSnake = newSnake.some(segment => 
              segment.x === additionalFood.position.x && segment.y === additionalFood.position.y
            );
            if (!isOnSnake) {
              newFood.push(additionalFood);
            }
          }
        }

        return newFood;
      });

      // Check if food was eaten for this update
      const foodEaten = food.some(f => 
        f.position.x === newHead.x && f.position.y === newHead.y && !f.collected
      );

      // Don't grow snake if no food was eaten
      if (!foodEaten) {
        return newSnake.slice(0, -1);
      }

      return newSnake;
    });
  }, [gameState, direction, onGameOver, onFoodCollected, collectedSections.size, generateFood, food, gameMode]);

  // Start game loop
  useEffect(() => {
    if (gameState === 'playing') {
      // Clear any existing interval first
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      gameLoopRef.current = window.setInterval(gameLoop, GAME_SPEED);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = undefined;
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = undefined;
      }
    };
  }, [gameLoop, gameState]);

  // Reset when game starts or goes to menu
  useEffect(() => {
    if (gameState === 'menu') {
      resetGame();
    }
  }, [gameState, resetGame]);

  // Reset when transitioning from gameOver to playing (restart)
  const [prevGameState, setPrevGameState] = useState<GameState>('menu');
  useEffect(() => {
    if (prevGameState === 'gameOver' && gameState === 'playing') {
      resetGame();
    }
    setPrevGameState(gameState);
  }, [gameState, prevGameState, resetGame]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          e.preventDefault();
          setDirection(prev => prev.y === 0 ? { x: 0, y: -1 } : prev);
          break;
        case 'ArrowDown':
        case 'KeyS':
          e.preventDefault();
          setDirection(prev => prev.y === 0 ? { x: 0, y: 1 } : prev);
          break;
        case 'ArrowLeft':
        case 'KeyA':
          e.preventDefault();
          setDirection(prev => prev.x === 0 ? { x: -1, y: 0 } : prev);
          break;
        case 'ArrowRight':
        case 'KeyD':
          e.preventDefault();
          setDirection(prev => prev.x === 0 ? { x: 1, y: 0 } : prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  return (
    <div className="relative w-80 h-80 bg-green-100">
      {/* Game Grid */}
      <div 
        className="relative w-full h-full"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`${
              index === 0 
                ? 'bg-green-800 border border-green-900' // Head
                : 'bg-green-700 border border-green-800'  // Body
            } rounded-sm`}
            style={{
              gridColumn: segment.x + 1,
              gridRow: segment.y + 1,
            }}
          >
            {index === 0 && (
              <div className="w-full h-full flex items-center justify-center text-xs">
                {direction.x === 1 ? '►' : direction.x === -1 ? '◄' : direction.y === 1 ? '▼' : direction.y === -1 ? '▲' : '●'}
              </div>
            )}
          </div>
        ))}

        {/* Food */}
        {food.map((f, index) => (
          <div
            key={index}
            className={`${
              gameMode === 'classic' 
                ? 'bg-yellow-400 border-2 border-yellow-600' 
                : 'bg-yellow-400 border-2 border-yellow-600'
            } rounded-sm animate-pulse flex items-center justify-center text-xs shadow-lg relative`}
            style={{
              gridColumn: f.position.x + 1,
              gridRow: f.position.y + 1,
            }}
          >
            {gameMode === 'classic' ? '●' : foodIcons[f.type as keyof typeof foodIcons]}
            
            {/* Label for nearby food in portfolio mode */}
            {gameMode === 'portfolio' && nearbyFood && nearbyFood.position.x === f.position.x && nearbyFood.position.y === f.position.y && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-900 text-green-300 px-2 py-1 rounded text-xs font-mono whitespace-nowrap border border-green-700 z-20">
                {f.type?.toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Game State Overlays */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 bg-green-900/90 flex flex-col items-center justify-center text-green-300 font-mono">
          <div className="text-2xl mb-4 animate-pulse">SNAKE PORTFOLIO</div>
          <div className="text-center text-sm leading-relaxed">
            COLLECT PORTFOLIO ITEMS<br />
            TO UNLOCK SECTIONS<br /><br />
            PRESS A TO START
          </div>
        </div>
      )}

      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-green-900/80 flex items-center justify-center text-green-300 font-mono">
          <div className="text-xl animate-pulse">PAUSED</div>
        </div>
      )}

      {gameState === 'classic' && (
        <div className="absolute inset-0 bg-green-900/90 flex flex-col items-center justify-center text-green-300 font-mono">
          <div className="text-2xl mb-4 animate-pulse">PORTFOLIO COMPLETE!</div>
          <div className="text-center text-sm leading-relaxed">
            ALL SECTIONS UNLOCKED<br />
            READY FOR CLASSIC MODE<br /><br />
            CHECK BUTTONS BELOW
          </div>
        </div>
      )}

      {gameState === 'gameOver' && (
        <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center text-red-300 font-mono">
          <div className="text-2xl mb-4 animate-pulse">GAME OVER</div>
          <div className="text-center text-sm">
            {gameMode === 'portfolio' 
              ? `SECTIONS COLLECTED: ${collectedSections.size}/4` 
              : `FINAL SCORE: ${score}`}<br />
            PRESS A TO RESTART
          </div>
        </div>
      )}
    </div>
  );
};