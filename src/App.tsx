import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RetroConsole } from './components/RetroConsole';
import { SnakeGame } from './components/SnakeGame';
import { PortfolioModal } from './components/PortfolioModal';
import { portfolioData } from './components/PortfolioData';

export type GameState = 'playing' | 'paused' | 'gameOver' | 'menu' | 'classic';
export type PortfolioSection = 'about' | 'projects' | 'skills' | 'contact' | null;

export interface Position {
  x: number;
  y: number;
}

export interface Food {
  position: Position;
  type: PortfolioSection;
  collected: boolean;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [selectedSection, setSelectedSection] = useState<PortfolioSection>(null);
  const [collectedSections, setCollectedSections] = useState<Set<PortfolioSection>>(new Set());
  const [gameMode, setGameMode] = useState<'portfolio' | 'classic'>('portfolio');
  const [showResume, setShowResume] = useState(false);
  const directionChangeRef = useRef<((direction: Position) => void) | null>(null);

  const handleFoodCollected = useCallback((foodType: PortfolioSection) => {
    if (foodType && gameMode === 'portfolio') {
      setScore(prev => prev + 10);
      setCollectedSections(prev => {
        const newCollected = new Set([...prev, foodType]);
        // Check if all sections are collected
        if (newCollected.size === 4) {
          setTimeout(() => setGameState('classic'), 2000);
        }
        return newCollected;
      });
      setSelectedSection(foodType);
      setGameState('paused');
    } else if (gameMode === 'classic') {
      setScore(prev => prev + 10);
    }
  }, [gameMode]);

  const handleGameStart = useCallback(() => {
    setGameState('playing');
    if (gameMode === 'portfolio') {
      setScore(0);
      setCollectedSections(new Set());
    }
  }, [gameMode]);

  const handleClassicMode = useCallback(() => {
    setGameMode('classic');
    setGameState('playing');
    setScore(0);
  }, []);

  const handlePortfolioMode = useCallback(() => {
    setGameMode('portfolio');
    setGameState('menu');
    setScore(0);
    setCollectedSections(new Set());
  }, []);

  const handleGameOver = useCallback(() => {
    setGameState('gameOver');
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedSection(null);
    setGameState('playing');
  }, []);

  const handlePause = useCallback(() => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Enter':
        case 'Space':
          if (gameState === 'menu' || gameState === 'gameOver') {
            handleGameStart();
          } else if (selectedSection) {
            handleModalClose();
          } else {
            handlePause();
          }
          break;
        case 'KeyB':
          if (!showResume && !selectedSection) {
            handleViewResume();
          }
          break;
        case 'Escape':
          if (showResume) {
            handleCloseResume();
          } else if (selectedSection) {
            handleModalClose();
          } else if (gameState === 'playing') {
            setGameState('menu');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, selectedSection, handleGameStart, handleModalClose, handlePause]);

  const handleViewResume = useCallback(() => {
    setShowResume(true);
  }, []);

  const handleCloseResume = useCallback(() => {
    setShowResume(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="relative">
        <RetroConsole
          gameState={gameState}
          score={score}
          collectedSections={collectedSections}
          gameMode={gameMode}
          onStart={handleGameStart}
          onPause={handlePause}
          onClassicMode={handleClassicMode}
          onPortfolioMode={handlePortfolioMode}
          onViewResume={handleViewResume}
          onDirectionChange={(direction) => directionChangeRef.current?.(direction)}
        >
          <SnakeGame
            gameState={gameState}
            gameMode={gameMode}
            onFoodCollected={handleFoodCollected}
            onGameOver={handleGameOver}
            collectedSections={collectedSections}
            score={score}
            onDirectionChangeRef={directionChangeRef}
          />
        </RetroConsole>
        
        {selectedSection && (
          <PortfolioModal
            section={selectedSection}
            data={portfolioData[selectedSection]}
            isOpen={!!selectedSection}
            onClose={handleModalClose}
          />
        )}

        {showResume && (
          <div className="fixed inset-0 bg-white z-50">
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-4 border-b bg-gray-50 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800">Resume - Srivatsan P</h2>
                <div className="flex gap-2">
                  <a
                    href="/Srivatsan_P_Resume.pdf"
                    download="Srivatsan_P_Resume.pdf"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold"
                  >
                    📥 Download Resume
                  </a>
                  <button
                    onClick={handleCloseResume}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-bold"
                  >
                    ← Back to Game
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <iframe
                  src={`/Srivatsan_P_Resume.pdf?t=${Date.now()}`}
                  className="w-full h-full border-0"
                  title="Resume"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
