import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Chess } from 'chess.js';
import Chessboard from '../components/Board/Chessboard';
import EvalBar from '../components/Board/EvalBar';
import MoveHistory from '../components/Game/MoveHistory';
import { useStockfish } from '../engine/useStockfish';
import { getOpeningName } from '../engine/openings';

const AnalysisPage: React.FC = () => {
  const location = useLocation();
  const [game, setGame] = useState(new Chess());
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [boardFlipped, setBoardFlipped] = useState(false);
  
  // Input for PGN/FEN loading
  const [pgnInput, setPgnInput] = useState('');

  // Engine state
  const { evaluatePosition, stopEvaluation, evaluation, lines, isReady } = useStockfish(20, 3);

  // Load game from route state if provided
  useEffect(() => {
    if (location.state && location.state.pgn) {
      try {
        const newGame = new Chess();
        newGame.loadPgn(location.state.pgn);
        setGame(newGame);
        setCurrentMoveIndex(newGame.history().length - 1);
      } catch (e) {
        console.error("Failed to load PGN from state", e);
      }
    }
  }, [location.state]);

  // Evaluate current position when index changes
  useEffect(() => {
    if (!isReady) return;
    
    const history = game.history();
    const evalGame = new Chess();
    for (let i = 0; i <= currentMoveIndex; i++) {
      evalGame.move(history[i]);
    }
    
    evaluatePosition(evalGame.fen(), 16); // Quick but decent depth for interactive analysis
    
    return () => {
      stopEvaluation();
    };
  }, [currentMoveIndex, game.fen(), isReady, evaluatePosition, stopEvaluation]);

  const viewGame = new Chess();
  const history = game.history();
  for (let i = 0; i <= currentMoveIndex; i++) {
    viewGame.move(history[i]);
  }

  const handleHistoryClick = (index: number) => {
    setCurrentMoveIndex(index);
  };

  const handleMove = (move: any) => {
    // In analysis mode, making a move creates a new variation (or overwrites rest of game for simplicity here)
    try {
      const newGame = new Chess(viewGame.fen());
      const res = newGame.move(move.san);
      if (res) {
        // If we're not at the end, we branch. For this simple version, we truncate the game.
        if (currentMoveIndex < game.history().length - 1) {
          const branchingGame = new Chess();
          const oldHistory = game.history();
          for (let i = 0; i <= currentMoveIndex; i++) {
            branchingGame.move(oldHistory[i]);
          }
          branchingGame.move(move.san);
          setGame(branchingGame);
          setCurrentMoveIndex(currentMoveIndex + 1);
        } else {
          // Just add to end
          const newFullGame = new Chess(game.fen());
          newFullGame.move(move.san);
          setGame(newFullGame);
          setCurrentMoveIndex(currentMoveIndex + 1);
        }
      }
    } catch(e) {}
  };

  const handleLoadPgn = () => {
    try {
      const newGame = new Chess();
      if (pgnInput.includes('/')) {
        // Assume FEN
        newGame.load(pgnInput);
      } else {
        newGame.loadPgn(pgnInput);
      }
      setGame(newGame);
      setCurrentMoveIndex(newGame.history().length - 1);
      setPgnInput('');
    } catch (e) {
      alert("Invalid PGN or FEN");
    }
  };

  const opening = getOpeningName(viewGame.pgn());

  // Convert best moves to arrows
  const arrows = lines.slice(0, 1).filter(l => l.moves.length > 0).map(line => {
    const move = line.moves[0];
    const from = move.substring(0, 2) as import('chess.js').Square;
    const to = move.substring(2, 4) as import('chess.js').Square;
    return { from, to, color: 'rgba(96, 188, 75, 0.5)' }; // Green for best move
  });

  return (
    <div className="page-container" style={{ display: 'flex', gap: 'var(--space-6)', paddingTop: 'var(--space-4)' }}>
      
      {/* Board & Eval */}
      <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
        <div style={{ width: '24px', height: 'var(--board-size)' }}>
          <EvalBar score={evaluation} mate={lines[0]?.mate || false} flipped={boardFlipped} />
        </div>
        <div style={{ width: 'var(--board-size)' }}>
          <div className="card" style={{ padding: 'var(--space-2)', marginBottom: 'var(--space-2)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>{opening}</span>
            <span style={{ color: 'var(--text-secondary)' }}>Stockfish 16.1</span>
          </div>
          
          <Chessboard 
            game={viewGame}
            flipped={boardFlipped}
            onMove={handleMove}
            interactive={true}
            arrows={arrows}
            lastMove={viewGame.history({ verbose: true }).length > 0 ? 
              { 
                from: viewGame.history({ verbose: true })[viewGame.history({ verbose: true }).length - 1].from, 
                to: viewGame.history({ verbose: true })[viewGame.history({ verbose: true }).length - 1].to 
              } : null}
          />
        </div>
      </div>

      {/* Sidebar Controls */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxHeight: 'calc(100vh - 40px)' }}>
        
        {/* Engine Lines */}
        <div className="card" style={{ padding: 'var(--space-3)' }}>
          <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--fs-md)' }}>Engine Evaluation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {lines.length === 0 ? (
              <span style={{ color: 'var(--text-muted)' }}>Evaluating...</span>
            ) : (
              lines.slice(0, 3).map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)' }}>
                  <span style={{ 
                    color: line.score >= 0 ? 'var(--color-success)' : 'var(--color-error)',
                    minWidth: '45px',
                    fontWeight: 'bold'
                  }}>
                    {line.mate ? `M${Math.abs(line.score)/10000}` : (line.score > 0 ? '+' : '') + (line.score / 100).toFixed(2)}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {line.moves.slice(0, 5).join(' ')}...
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Move History */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <MoveHistory 
            game={game} 
            currentMoveIndex={currentMoveIndex} 
            onMoveClick={handleHistoryClick} 
          />
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setBoardFlipped(!boardFlipped)}>
              Flip Board
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => {
              setGame(new Chess());
              setCurrentMoveIndex(-1);
            }}>
              Clear
            </button>
          </div>
        </div>

        {/* PGN/FEN Import */}
        <div className="card" style={{ padding: 'var(--space-3)' }}>
          <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--fs-md)' }}>Import Game</h3>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <input 
              type="text" 
              placeholder="Paste PGN or FEN..." 
              value={pgnInput}
              onChange={e => setPgnInput(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={handleLoadPgn} disabled={!pgnInput}>
              Load
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisPage;
