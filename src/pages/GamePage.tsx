import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chess, type Move, type Color } from 'chess.js';
import Chessboard from '../components/Board/Chessboard';
import EvalBar from '../components/Board/EvalBar';
import PlayerCard from '../components/Game/PlayerCard';
import MoveHistory from '../components/Game/MoveHistory';
import GameControls from '../components/Game/GameControls';
import GameOverModal from '../components/Game/GameOverModal';
import { useStockfish } from '../engine/useStockfish';
import { getAIRating, calculateElo } from '../engine/EloSystem';
import { useAuth, UserProfile } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import './GamePage.css';

const GamePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: auth, updateProfile } = useAuth();
  const { settings } = useSettings();
  
  // Game Configuration from route state
  const config = location.state || {
    mode: 'ai', // 'ai' or 'local'
    timeControl: '10+0', // 'bullet', 'blitz', 'rapid'
    difficulty: 10, // 1-20 for AI
    color: 'w', // 'w', 'b', 'random'
  };

  const timeMs = useMemo(() => {
    const parts = config.timeControl.split('+');
    return parseInt(parts[0]) * 60 * 1000;
  }, [config.timeControl]);

  const incrementMs = useMemo(() => {
    const parts = config.timeControl.split('+');
    return parseInt(parts[1] || '0') * 1000;
  }, [config.timeControl]);

  const playerColor: Color = useMemo(() => {
    if (config.color === 'random') return Math.random() > 0.5 ? 'w' : 'b';
    return config.color as Color;
  }, [config.color]);

  // Game State
  const [game, setGame] = useState(new Chess());
  const [boardFlipped, setBoardFlipped] = useState(playerColor === 'b');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<{
    result: 'win' | 'loss' | 'draw';
    reason: string;
    winnerColor: 'w' | 'b' | null;
  } | null>(null);
  
  // History viewing state
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [viewingHistory, setViewingHistory] = useState(false);
  const [viewGame, setViewGame] = useState(new Chess());

  // Engine
  const { isReady, isEvaluating, evaluatePosition, bestMove, stopEvaluation, evaluation, lines } = useStockfish(config.difficulty, 1);

  // Players
  const aiPlayer = { username: `Stockfish Lvl ${config.difficulty}`, rating: getAIRating(config.difficulty), isAI: true };
  const humanPlayer = auth.currentUser || { username: 'Guest', rating: 1200 };
  
  const whitePlayer = playerColor === 'w' ? humanPlayer : (config.mode === 'ai' ? aiPlayer : { username: 'Player 2', rating: 1200 });
  const blackPlayer = playerColor === 'b' ? humanPlayer : (config.mode === 'ai' ? aiPlayer : { username: 'Player 2', rating: 1200 });

  // Initialize Game
  useEffect(() => {
    // If AI is white, make the first move
    if (config.mode === 'ai' && playerColor === 'b' && isReady && !gameStarted) {
      setGameStarted(true);
      evaluatePosition(game.fen(), Math.min(10, Math.floor(config.difficulty / 2) + 1));
    }
  }, [config.mode, playerColor, isReady, gameStarted, game, config.difficulty, evaluatePosition]);

  // Handle AI moves
  useEffect(() => {
    if (config.mode === 'ai' && bestMove && gameStarted && !gameOver && game.turn() !== playerColor) {
      setTimeout(() => {
        try {
          const move = game.move(bestMove);
          if (move) {
            const newGame = new Chess(game.fen());
            setGame(newGame);
            setViewGame(newGame);
            setCurrentMoveIndex(newGame.history().length - 1);
            checkGameOver(newGame);
          }
        } catch (e) {
          console.error("AI attempted illegal move", bestMove, e);
        }
      }, 500); // Small delay for realism
    }
  }, [bestMove, config.mode, gameStarted, gameOver, game, playerColor]);

  const checkGameOver = useCallback((currentGame: Chess) => {
    if (currentGame.isGameOver()) {
      setGameOver(true);
      
      let result: 'win' | 'loss' | 'draw' = 'draw';
      let reason = 'Draw';
      let winner: 'w' | 'b' | null = null;

      if (currentGame.isCheckmate()) {
        winner = currentGame.turn() === 'w' ? 'b' : 'w';
        reason = 'Checkmate';
        result = winner === playerColor ? 'win' : 'loss';
      } else if (currentGame.isStalemate()) {
        reason = 'Stalemate';
      } else if (currentGame.isThreefoldRepetition()) {
        reason = 'Threefold Repetition';
      } else if (currentGame.isInsufficientMaterial()) {
        reason = 'Insufficient Material';
      } else if (currentGame.isDraw()) {
        reason = '50-Move Rule';
      }

      setGameResult({ result, reason, winnerColor: winner });
      stopEvaluation();
    }
  }, [playerColor, stopEvaluation]);

  const handleMove = (move: Move) => {
    // If viewing history, can't move
    if (viewingHistory && currentMoveIndex !== game.history().length - 1) {
      // Could allow variations here in the future
      return;
    }

    if (!gameStarted) setGameStarted(true);

    const newGame = new Chess(game.fen());
    try {
      newGame.move(move.san);
      setGame(newGame);
      setViewGame(newGame);
      setCurrentMoveIndex(newGame.history().length - 1);
      
      checkGameOver(newGame);

      if (!newGame.isGameOver() && config.mode === 'ai') {
        // Trigger AI
        const depth = Math.max(1, Math.floor(config.difficulty / 1.5));
        evaluatePosition(newGame.fen(), depth);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTimeUp = useCallback((color: Color) => {
    if (gameOver) return;
    
    setGameOver(true);
    stopEvaluation();
    
    const winner = color === 'w' ? 'b' : 'w';
    const reason = 'Timeout';
    const result = winner === playerColor ? 'win' : 'loss';
    
    setGameResult({ result, reason, winnerColor: winner });
  }, [gameOver, playerColor, stopEvaluation]);

  const handleHistoryClick = (index: number) => {
    if (index === -1) {
      setViewGame(new Chess());
      setCurrentMoveIndex(-1);
      setViewingHistory(true);
    } else {
      const history = game.history();
      const newViewGame = new Chess();
      for (let i = 0; i <= index; i++) {
        newViewGame.move(history[i]);
      }
      setViewGame(newViewGame);
      setCurrentMoveIndex(index);
      setViewingHistory(index !== history.length - 1);
    }
  };

  const handleResign = () => {
    if (gameOver) return;
    if (settings.confirmResign) {
      if (!window.confirm('Are you sure you want to resign?')) return;
    }
    
    setGameOver(true);
    stopEvaluation();
    
    const winner = game.turn() === 'w' ? 'b' : 'w';
    setGameResult({ result: 'loss', reason: 'Resignation', winnerColor: winner });
  };

  const handleDrawOffer = () => {
    if (gameOver) return;
    // Simple logic for AI accepting draw: random chance based on eval
    if (config.mode === 'ai') {
      const willAccept = Math.random() > 0.8 || (evaluation > 200 && playerColor === 'w') || (evaluation < -200 && playerColor === 'b');
      if (willAccept) {
        setGameOver(true);
        stopEvaluation();
        setGameResult({ result: 'draw', reason: 'Draw by agreement', winnerColor: null });
      } else {
        alert('Opponent declined the draw offer.');
      }
    }
  };

  // Process rating updates when game ends
  const eloResult = useMemo(() => {
    if (!gameResult || !auth.currentUser || config.mode !== 'ai' || auth.currentUser.username === 'Guest') return undefined;
    
    const res = calculateElo(
      auth.currentUser.rating,
      aiPlayer.rating,
      gameResult.result,
      auth.currentUser.gamesPlayed
    );

    // Update profile (in a real app, this would be an API call)
    // Delay slightly so it doesn't happen during render
    setTimeout(() => {
      updateProfile({
        rating: res.newPlayerRating,
        gamesPlayed: auth.currentUser!.gamesPlayed + 1,
        wins: auth.currentUser!.wins + (gameResult.result === 'win' ? 1 : 0),
        losses: auth.currentUser!.losses + (gameResult.result === 'loss' ? 1 : 0),
        draws: auth.currentUser!.draws + (gameResult.result === 'draw' ? 1 : 0),
      });
    }, 0);

    return res;
  }, [gameResult, auth.currentUser?.username]);

  return (
    <div className="game-page">
      <div className="game-layout">
        
        {/* Left column / Evaluation */}
        {settings.showEvalBar && (
          <div className="eval-container">
            <EvalBar 
              score={evaluation} 
              mate={lines[0]?.mate || false} 
              flipped={boardFlipped} 
            />
          </div>
        )}

        {/* Center column / Board */}
        <div className="board-column">
          <PlayerCard 
            player={boardFlipped ? whitePlayer : blackPlayer}
            color={boardFlipped ? 'w' : 'b'}
            game={game}
            timeMs={timeMs}
            incrementMs={incrementMs}
            isActive={!gameOver && game.turn() === (boardFlipped ? 'w' : 'b')}
            gameStarted={gameStarted}
            onTimeUp={handleTimeUp}
          />
          
          <div className="board-wrapper">
            <Chessboard 
              game={viewGame} 
              flipped={boardFlipped}
              onMove={handleMove}
              interactive={!gameOver && (!viewingHistory || currentMoveIndex === game.history().length - 1) && (config.mode !== 'ai' || game.turn() === playerColor)}
              lastMove={viewGame.history({ verbose: true }).length > 0 ? 
                { 
                  from: viewGame.history({ verbose: true })[viewGame.history({ verbose: true }).length - 1].from, 
                  to: viewGame.history({ verbose: true })[viewGame.history({ verbose: true }).length - 1].to 
                } : null}
            />
          </div>

          <PlayerCard 
            player={boardFlipped ? blackPlayer : whitePlayer}
            color={boardFlipped ? 'b' : 'w'}
            game={game}
            timeMs={timeMs}
            incrementMs={incrementMs}
            isActive={!gameOver && game.turn() === (boardFlipped ? 'b' : 'w')}
            gameStarted={gameStarted}
            onTimeUp={handleTimeUp}
            isBottom={true}
          />
        </div>

        {/* Right column / History & Controls */}
        <div className="controls-column">
          <MoveHistory 
            game={game}
            currentMoveIndex={currentMoveIndex}
            onMoveClick={handleHistoryClick}
          />
          <GameControls 
            onResign={handleResign}
            onDrawOffer={handleDrawOffer}
            onFlipBoard={() => setBoardFlipped(!boardFlipped)}
            canResign={gameStarted && !gameOver}
            canOfferDraw={gameStarted && !gameOver}
          />
        </div>

      </div>

      {gameOver && gameResult && (
        <GameOverModal
          result={gameResult.result}
          reason={gameResult.reason}
          playerColor={playerColor}
          winnerColor={gameResult.winnerColor}
          player={humanPlayer}
          opponent={aiPlayer}
          eloResult={eloResult}
          onRematch={() => {
            setGame(new Chess());
            setViewGame(new Chess());
            setGameOver(false);
            setGameStarted(false);
            setGameResult(null);
            setCurrentMoveIndex(-1);
          }}
          onNewGame={() => navigate('/play')}
          onAnalyze={() => navigate('/analysis', { state: { pgn: game.pgn() } })}
          onClose={() => setGameResult(null)}
        />
      )}
    </div>
  );
};

export default GamePage;
