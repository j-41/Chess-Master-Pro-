import React, { useState, useEffect, useCallback } from 'react';
import { Chess, type Move } from 'chess.js';
import Chessboard from '../components/Board/Chessboard';
import { puzzles, Puzzle, getRandomPuzzle } from '../engine/puzzles';
import { soundManager } from '../audio/SoundManager';
import { useAuth } from '../context/AuthContext';

const PuzzlePage: React.FC = () => {
  const { state: auth, updateProfile } = useAuth();
  
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [game, setGame] = useState(new Chess());
  const [moveIndex, setMoveIndex] = useState(0); // 0 is opponent's initial move
  const [status, setStatus] = useState<'initial' | 'playing' | 'solved' | 'failed'>('initial');
  
  // Streak state
  const [streak, setStreak] = useState(0);
  const [rating, setRating] = useState(auth.currentUser?.puzzleRating || 1200);

  // Load a new puzzle
  const loadNewPuzzle = useCallback(() => {
    // Pick a puzzle appropriate for the rating
    const p = getRandomPuzzle(Math.max(400, rating - 200), rating + 100);
    setCurrentPuzzle(p);
    
    // Set up board from FEN
    const newGame = new Chess(p.fen);
    setGame(newGame);
    setMoveIndex(0);
    setStatus('initial');
    
    // Make the opponent's first move automatically after a short delay
    setTimeout(() => {
      try {
        const moveStr = p.moves[0];
        newGame.move(moveStr);
        setGame(new Chess(newGame.fen()));
        setMoveIndex(1);
        setStatus('playing');
        soundManager.move();
      } catch (e) {
        console.error("Invalid first move in puzzle", p, e);
      }
    }, 500);
  }, [rating]);

  useEffect(() => {
    loadNewPuzzle();
  }, [loadNewPuzzle]);

  const handleMove = (move: Move) => {
    if (status !== 'playing' || !currentPuzzle) return;
    
    // Create UCI string to match puzzle format (e.g. "e2e4", "e7e8q")
    const uci = move.from + move.to + (move.promotion || '');
    
    // Check if move matches the expected puzzle move
    const expectedMove = currentPuzzle.moves[moveIndex];
    
    if (uci === expectedMove) {
      // Correct move
      const newGame = new Chess(game.fen());
      try {
        newGame.move(move.san);
        setGame(newGame);
        
        // Are there more moves?
        if (moveIndex + 1 < currentPuzzle.moves.length) {
          // Play opponent's response
          setTimeout(() => {
            const nextExpected = currentPuzzle.moves[moveIndex + 1];
            newGame.move(nextExpected);
            setGame(new Chess(newGame.fen()));
            setMoveIndex(moveIndex + 2);
            soundManager.move();
            
            // If the opponent's response is the last move in the puzzle sequence
            // it means the puzzle ends on the player's move, so this shouldn't happen usually
            // in standard puzzles, but just in case:
            if (moveIndex + 2 >= currentPuzzle.moves.length) {
              handlePuzzleSolved();
            }
          }, 400);
        } else {
          // Solved!
          handlePuzzleSolved();
        }
      } catch (e) {
        console.error("Error executing valid puzzle move", e);
      }
    } else {
      // Wrong move
      soundManager.puzzleWrong();
      setStatus('failed');
      setStreak(0);
      
      const newRating = Math.max(400, rating - 12);
      setRating(newRating);
      
      if (auth.isLoggedIn) {
        updateProfile({ puzzleRating: newRating });
      }
    }
  };

  const handlePuzzleSolved = () => {
    soundManager.puzzleCorrect();
    setStatus('solved');
    setStreak(s => s + 1);
    
    // Calculate rating gain based on puzzle rating vs player rating
    let gain = 10;
    if (currentPuzzle) {
      if (currentPuzzle.rating > rating + 100) gain = 15;
      else if (currentPuzzle.rating < rating - 100) gain = 5;
    }
    
    const newRating = rating + gain;
    setRating(newRating);
    
    if (auth.isLoggedIn && auth.currentUser) {
      updateProfile({ 
        puzzleRating: newRating,
        puzzlesSolved: (auth.currentUser.puzzlesSolved || 0) + 1
      });
    }
  };

  const retry = () => {
    if (!currentPuzzle) return;
    
    const newGame = new Chess(currentPuzzle.fen);
    newGame.move(currentPuzzle.moves[0]); // opponent's first move
    setGame(newGame);
    setMoveIndex(1);
    setStatus('playing');
  };

  const showHint = () => {
    if (status !== 'playing' || !currentPuzzle) return;
    // Simple hint: show the piece that should move
    const expectedMove = currentPuzzle.moves[moveIndex];
    const fromSquare = expectedMove.substring(0, 2);
    // Draw an arrow or just rely on the user seeing the piece
    // A full implementation would integrate with the Chessboard highlightSquares prop
    alert(`Hint: Move the piece on ${fromSquare}`);
  };

  // The player's color is the turn color *after* the initial opponent move
  // But we want to orient the board from the player's perspective from the start
  const playerColor = currentPuzzle ? (new Chess(currentPuzzle.fen).turn() === 'w' ? 'b' : 'w') : 'w';

  return (
    <div className="page-container" style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start', paddingTop: 'var(--space-6)' }}>
      
      <div style={{ flex: '0 0 var(--board-size)' }}>
        <div className="card" style={{ padding: 'var(--space-2)', marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Puzzle Rating: </span>
            <span style={{ fontWeight: 'bold' }}>{currentPuzzle?.rating || '---'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Your Rating: </span>
            <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>{rating}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Streak: </span>
            <span style={{ fontWeight: 'bold', color: streak > 0 ? 'var(--color-warning)' : 'inherit' }}>
              {streak} 🔥
            </span>
          </div>
        </div>

        <Chessboard 
          game={game}
          flipped={playerColor === 'b'}
          interactive={status === 'playing'}
          onMove={handleMove}
          lastMove={game.history({ verbose: true }).length > 0 ? 
            { 
              from: game.history({ verbose: true })[game.history({ verbose: true }).length - 1].from, 
              to: game.history({ verbose: true })[game.history({ verbose: true }).length - 1].to 
            } : null}
        />
      </div>

      <div className="card" style={{ flex: 1, padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <h2 style={{ fontSize: 'var(--fs-2xl)' }}>Tactics Training</h2>
        
        <div style={{ 
          padding: 'var(--space-4)', 
          borderRadius: 'var(--radius-md)',
          backgroundColor: status === 'solved' ? 'var(--color-success-bg)' : 
                          status === 'failed' ? 'var(--color-error-bg)' : 
                          'var(--bg-tertiary)',
          border: `1px solid ${
            status === 'solved' ? 'var(--color-success)' : 
            status === 'failed' ? 'var(--color-error)' : 
            'var(--border-light)'
          }`
        }}>
          {status === 'initial' && <p>Opponent is moving...</p>}
          {status === 'playing' && (
            <p style={{ fontWeight: 'bold', fontSize: 'var(--fs-lg)' }}>
              Find the best move for {playerColor === 'w' ? 'White' : 'Black'}.
            </p>
          )}
          {status === 'solved' && (
            <div>
              <p style={{ fontWeight: 'bold', color: 'var(--color-success)', fontSize: 'var(--fs-xl)' }}>
                ✓ Puzzle Solved!
              </p>
              {currentPuzzle?.themes && currentPuzzle.themes.length > 0 && (
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
                  {currentPuzzle.themes.map(t => (
                    <span key={t} style={{ 
                      fontSize: 'var(--fs-xs)', 
                      padding: '4px 8px', 
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: 'var(--radius-sm)'
                    }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          )}
          {status === 'failed' && (
            <p style={{ fontWeight: 'bold', color: 'var(--color-error)', fontSize: 'var(--fs-xl)' }}>
              ✗ Incorrect Move.
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'auto' }}>
          {status === 'playing' && (
            <button className="btn btn-secondary" onClick={showHint}>
              💡 Hint
            </button>
          )}
          
          {status === 'failed' && (
            <button className="btn btn-secondary" onClick={retry}>
              🔄 Retry
            </button>
          )}
          
          {(status === 'solved' || status === 'failed') && (
            <button className="btn btn-primary btn-lg" onClick={loadNewPuzzle}>
              Next Puzzle ➔
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default PuzzlePage;
