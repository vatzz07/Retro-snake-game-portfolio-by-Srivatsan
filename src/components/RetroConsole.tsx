import React from 'react';
import { GameState, PortfolioSection } from '../App';

interface RetroConsoleProps {
  children: React.ReactNode;
  gameState: GameState;
  score: number;
  collectedSections: Set<PortfolioSection>;
  gameMode: 'portfolio' | 'classic';
  onStart: () => void;
  onPause: () => void;
  onClassicMode: () => void;
  onPortfolioMode: () => void;
  onViewResume: () => void;
  onDirectionChange?: (direction: { x: number; y: number }) => void;
}

export const RetroConsole: React.FC<RetroConsoleProps> = ({
  children,
  gameState,
  score,
  collectedSections,
  gameMode,
  onStart,
  onPause,
  onClassicMode,
  onPortfolioMode,
  onViewResume,
  onDirectionChange
}) => {
  return (
    <div className="relative bg-gray-300 p-8 rounded-3xl shadow-2xl border-4 border-gray-400">
      {/* Console Brand */}
      <div className="text-center mb-4">
        <div className="font-mono text-xs tracking-widest text-gray-600">PORTFOLIO BY</div>
        <div className="font-mono text-2xl tracking-wider text-gray-800 mt-1">SRIVATSAN</div>
      </div>

      {/* Main Screen */}
      <div className="relative bg-gray-800 p-4 rounded-lg border-4 border-gray-700 shadow-inner">
        {/* Screen Header */}
        <div className="bg-green-900 text-green-300 font-mono text-xs p-2 mb-2 rounded border border-green-700">
          <div className="flex justify-between items-center">
            <span>SCORE: {score.toString().padStart(3, '0')}</span>
            <span>{gameMode === 'portfolio' ? `COLLECTED: ${collectedSections.size}/4` : 'CLASSIC MODE'}</span>
          </div>
        </div>

        {/* Game Screen */}
        <div className="relative bg-green-100 border-4 border-green-900 rounded overflow-hidden">
          {/* Scanlines Effect */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="w-full h-full bg-gradient-to-b from-transparent via-green-900/10 to-transparent animate-pulse"></div>
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]"></div>
          </div>
          
          {children}
        </div>

        {/* Status Indicators */}
        <div className="flex justify-between mt-2 text-green-300 font-mono text-xs">
          {gameMode === 'portfolio' ? (
            <div className="flex gap-2">
              {['about', 'skills', 'projects', 'contact'].map((section) => (
                <div
                  key={section}
                  className={`w-3 h-3 rounded border ${
                    collectedSections.has(section as PortfolioSection)
                      ? 'bg-green-400 border-green-300'
                      : 'bg-green-900 border-green-700'
                  }`}
                  title={section.toUpperCase()}
                ></div>
              ))}
            </div>
          ) : (
            <div className="text-xs">CLASSIC SNAKE MODE</div>
          )}
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            gameState === 'playing' || gameState === 'classic' ? 'bg-green-400' : 'bg-red-400'
          }`}></div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mt-6">
        {/* D-Pad */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-1 w-20 h-20">
            <div></div>
            <button 
              onClick={() => onDirectionChange?.({ x: 0, y: -1 })}
              className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded border-2 border-gray-800 shadow-lg flex items-center justify-center text-white font-mono text-xs transition-colors"
            >
              ↑
            </button>
            <div></div>
            <button 
              onClick={() => onDirectionChange?.({ x: -1, y: 0 })}
              className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded border-2 border-gray-800 shadow-lg flex items-center justify-center text-white font-mono text-xs transition-colors"
            >
              ←
            </button>
            <div className="bg-gray-600 rounded border-2 border-gray-700"></div>
            <button 
              onClick={() => onDirectionChange?.({ x: 1, y: 0 })}
              className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded border-2 border-gray-800 shadow-lg flex items-center justify-center text-white font-mono text-xs transition-colors"
            >
              →
            </button>
            <div></div>
            <button 
              onClick={() => onDirectionChange?.({ x: 0, y: 1 })}
              className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded border-2 border-gray-800 shadow-lg flex items-center justify-center text-white font-mono text-xs transition-colors"
            >
              ↓
            </button>
            <div></div>
          </div>
          <div className="text-center mt-2">
            <div className="font-mono text-xs text-gray-600">WASD / TAP</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={gameState === 'menu' || gameState === 'gameOver' || gameState === 'classic' ? onStart : onPause}
            className="w-12 h-12 bg-red-600 hover:bg-red-500 rounded-full border-4 border-red-800 shadow-lg flex items-center justify-center text-white font-mono text-xs font-bold"
          >
            {gameState === 'menu' || gameState === 'gameOver' || gameState === 'classic' ? 'A' : gameState === 'playing' ? '⏸' : '▶'}
          </button>
          <button
            onClick={onViewResume}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-500 rounded-full border-4 border-blue-800 shadow-lg flex items-center justify-center text-white font-mono text-xs font-bold"
          >
            B
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mt-4 font-mono text-xs text-gray-600 leading-relaxed">
        {gameState === 'menu' && (
          <>
            COLLECT PORTFOLIO ITEMS TO UNLOCK SECTIONS<br />
            PRESS A OR SPACE TO START<br />
            PRESS B TO VIEW RESUME<br />
            USE WASD OR TAP D-PAD TO CONTROL SNAKE
          </>
        )}
        {gameState === 'playing' && gameMode === 'portfolio' && (
          <>
            USE WASD OR TAP D-PAD TO MOVE • COLLECT GLOWING ITEMS<br />
            PRESS A TO PAUSE • PRESS B FOR RESUME • ESC FOR MENU
          </>
        )}
        {gameState === 'playing' && gameMode === 'classic' && (
          <>
            CLASSIC SNAKE MODE • USE WASD OR TAP D-PAD • COLLECT YELLOW FOOD<br />
            PRESS A TO PAUSE • PRESS B FOR RESUME • ESC FOR MENU
          </>
        )}
        {gameState === 'classic' && (
          <>
            ALL PORTFOLIO SECTIONS UNLOCKED!<br />
            <button 
              onClick={onClassicMode}
              className="bg-green-700 hover:bg-green-600 text-green-100 px-3 py-1 rounded mt-2 mr-2"
            >
              PLAY CLASSIC
            </button>
            <button 
              onClick={onPortfolioMode}
              className="bg-blue-700 hover:bg-blue-600 text-blue-100 px-3 py-1 rounded mt-2"
            >
              RESTART PORTFOLIO
            </button>
          </>
        )}
        {gameState === 'gameOver' && (
          <>
            GAME OVER! {gameMode === 'portfolio' ? `COLLECTED ${collectedSections.size}/4 SECTIONS` : `SCORE: ${score}`}<br />
            {gameMode === 'classic' ? (
              <>
                <button 
                  onClick={onClassicMode}
                  className="bg-green-700 hover:bg-green-600 text-green-100 px-3 py-1 rounded mt-2 mr-2"
                >
                  CLASSIC MODE
                </button>
                <button 
                  onClick={onPortfolioMode}
                  className="bg-blue-700 hover:bg-blue-600 text-blue-100 px-3 py-1 rounded mt-2"
                >
                  RESTART PORTFOLIO
                </button>
              </>
            ) : (
              <>PRESS A OR SPACE TO RESTART</>
            )}
          </>
        )}
      </div>
    </div>
  );
};