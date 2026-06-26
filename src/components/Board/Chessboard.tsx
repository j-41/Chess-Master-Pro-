import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Chess, type Square, type Move, type PieceSymbol, type Color } from 'chess.js';
import { getPieceComponent } from '../../assets/pieces/PieceSVGs';
import { useSettings } from '../../context/SettingsContext';
import { soundManager } from '../../audio/SoundManager';
import './Chessboard.css';

interface ChessboardProps {
  game: Chess;
  onMove?: (move: Move) => void;
  interactive?: boolean;
  flipped?: boolean;
  lastMove?: { from: Square; to: Square } | null;
  selectedSquare?: Square | null;
  legalMoves?: Square[];
  inCheck?: boolean;
  highlightSquares?: Map<Square, string>;
  arrows?: Array<{ from: Square; to: Square; color: string }>;
  size?: number;
  showCoordinates?: boolean;
  onSquareClick?: (square: Square) => void;
  onPieceDrop?: (from: Square, to: Square) => boolean;
  premoveSquares?: { from: Square; to: Square } | null;
  boardId?: string;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

function squareToCoords(square: Square, flipped: boolean): { row: number; col: number } {
  const file = square.charCodeAt(0) - 97; // a=0, h=7
  const rank = 8 - parseInt(square[1]);    // 8=0, 1=7
  if (flipped) {
    return { row: 7 - rank, col: 7 - file };
  }
  return { row: rank, col: file };
}

function coordsToSquare(row: number, col: number, flipped: boolean): Square {
  if (flipped) {
    row = 7 - row;
    col = 7 - col;
  }
  return `${FILES[col]}${RANKS[row]}` as Square;
}

const Chessboard: React.FC<ChessboardProps> = ({
  game,
  onMove,
  interactive = true,
  flipped = false,
  lastMove = null,
  highlightSquares = new Map(),
  arrows = [],
  size,
  showCoordinates: showCoordsProp,
  premoveSquares = null,
  boardId = 'main-board',
}) => {
  const { settings } = useSettings();
  const showCoordinates = showCoordsProp ?? settings.showCoordinates;
  
  const [selected, setSelected] = useState<Square | null>(null);
  const [legalMovesForSelected, setLegalMovesForSelected] = useState<Square[]>([]);
  const [dragging, setDragging] = useState<{ square: Square; piece: { type: PieceSymbol; color: Color } } | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [promotionMove, setPromotionMove] = useState<{ from: Square; to: Square } | null>(null);
  const [animatingMove, setAnimatingMove] = useState<{ from: Square; to: Square; piece: { type: PieceSymbol; color: Color } } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [rightClickSquares, setRightClickSquares] = useState<Map<Square, string>>(new Map());
  const [drawingArrow, setDrawingArrow] = useState<{ from: Square; current: Square } | null>(null);
  const [customArrows, setCustomArrows] = useState<Array<{ from: Square; to: Square; color: string }>>([]);

  const board = useMemo(() => game.board(), [game.fen()]);
  const inCheck = game.inCheck();
  const kingSquare = useMemo(() => {
    const turn = game.turn();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === turn) {
          return `${FILES[c]}${RANKS[r]}` as Square;
        }
      }
    }
    return null;
  }, [board, game.turn()]);

  // Clear selection when game changes
  useEffect(() => {
    setSelected(null);
    setLegalMovesForSelected([]);
  }, [game.fen()]);

  const getSquareSize = useCallback(() => {
    if (boardRef.current) {
      return boardRef.current.offsetWidth / 8;
    }
    return (size || 560) / 8;
  }, [size]);

  const handleSquareClick = useCallback((square: Square) => {
    if (!interactive) return;

    // Clear right-click annotations on left click
    setRightClickSquares(new Map());
    setCustomArrows([]);

    const piece = game.get(square);

    if (selected) {
      // Try to make a move
      const moves = game.moves({ square: selected, verbose: true });
      const targetMove = moves.find(m => m.to === square);

      if (targetMove) {
        // Check for promotion
        if (targetMove.flags.includes('p') || 
            (targetMove.piece === 'p' && (targetMove.to[1] === '8' || targetMove.to[1] === '1'))) {
          if (settings.autoQueen) {
            executeMove(selected, square, 'q');
          } else {
            setPromotionMove({ from: selected, to: square });
          }
        } else {
          executeMove(selected, square);
        }
        return;
      }

      // If clicking own piece, reselect
      if (piece && piece.color === game.turn()) {
        selectSquare(square);
        return;
      }

      // Deselect
      setSelected(null);
      setLegalMovesForSelected([]);
    } else {
      // Select a piece
      if (piece && piece.color === game.turn()) {
        selectSquare(square);
      }
    }
  }, [selected, game, interactive, settings.autoQueen]);

  const selectSquare = useCallback((square: Square) => {
    setSelected(square);
    const moves = game.moves({ square, verbose: true });
    setLegalMovesForSelected(moves.map(m => m.to as Square));
  }, [game]);

  const executeMove = useCallback((from: Square, to: Square, promotion?: string) => {
    try {
      const movingPiece = game.get(from);
      const targetPiece = game.get(to);
      
      const move = game.move({
        from,
        to,
        promotion: promotion as 'q' | 'r' | 'b' | 'n' | undefined,
      });

      if (move) {
        // Play sound
        if (move.flags.includes('k') || move.flags.includes('q')) {
          soundManager.castle();
        } else if (move.flags.includes('p')) {
          soundManager.promote();
        } else if (move.flags.includes('c') || move.flags.includes('e') || targetPiece) {
          soundManager.capture();
        } else {
          soundManager.move();
        }

        // Check for check
        if (game.inCheck()) {
          setTimeout(() => soundManager.check(), 100);
        }

        // Check for game end
        if (game.isGameOver()) {
          setTimeout(() => soundManager.gameEnd(), 200);
        }

        setSelected(null);
        setLegalMovesForSelected([]);
        setPromotionMove(null);

        if (onMove) {
          // We need to undo because the parent manages the game state
          game.undo();
          onMove(move);
        }
      }
    } catch (e) {
      soundManager.illegal();
      setSelected(null);
      setLegalMovesForSelected([]);
    }
  }, [game, onMove]);

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent, square: Square) => {
    if (!interactive) return;
    
    const piece = game.get(square);
    if (!piece || piece.color !== game.turn()) return;

    e.preventDefault();
    
    const pos = 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } :
                                  { x: e.clientX, y: e.clientY };

    setDragging({ square, piece });
    setDragPos(pos);
    selectSquare(square);
  }, [interactive, game, selectSquare]);

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    e.preventDefault();

    const pos = 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } :
                                  { x: e.clientX, y: e.clientY };
    setDragPos(pos);
  }, [dragging]);

  const handleDragEnd = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging || !boardRef.current) {
      setDragging(null);
      return;
    }

    const rect = boardRef.current.getBoundingClientRect();
    const pos = 'changedTouches' in e ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } :
                                         { x: e.clientX, y: e.clientY };

    const sqSize = rect.width / 8;
    const col = Math.floor((pos.x - rect.left) / sqSize);
    const row = Math.floor((pos.y - rect.top) / sqSize);

    if (col >= 0 && col < 8 && row >= 0 && row < 8) {
      const targetSquare = coordsToSquare(row, col, flipped);

      if (targetSquare !== dragging.square) {
        // Check for promotion
        const moves = game.moves({ square: dragging.square, verbose: true });
        const targetMove = moves.find(m => m.to === targetSquare);
        
        if (targetMove) {
          if (targetMove.flags.includes('p') ||
              (targetMove.piece === 'p' && (targetMove.to[1] === '8' || targetMove.to[1] === '1'))) {
            if (settings.autoQueen) {
              executeMove(dragging.square, targetSquare, 'q');
            } else {
              setPromotionMove({ from: dragging.square, to: targetSquare });
            }
          } else {
            executeMove(dragging.square, targetSquare);
          }
        } else {
          soundManager.illegal();
        }
      }
    }

    setDragging(null);
  }, [dragging, flipped, game, executeMove, settings.autoQueen]);

  // Right-click for annotations
  const handleContextMenu = useCallback((e: React.MouseEvent, square: Square) => {
    e.preventDefault();
    setDrawingArrow({ from: square, current: square });
  }, []);

  const handleContextMenuEnd = useCallback((e: React.MouseEvent, square: Square) => {
    if (drawingArrow) {
      if (drawingArrow.from === square) {
        // Toggle highlight on single square
        setRightClickSquares(prev => {
          const next = new Map(prev);
          if (next.has(square)) {
            next.delete(square);
          } else {
            next.set(square, 'rgba(235, 97, 80, 0.8)');
          }
          return next;
        });
      } else {
        // Draw arrow
        setCustomArrows(prev => {
          const exists = prev.findIndex(a => a.from === drawingArrow.from && a.to === square);
          if (exists >= 0) {
            return prev.filter((_, i) => i !== exists);
          }
          return [...prev, { from: drawingArrow.from, to: square, color: 'rgba(235, 97, 80, 0.8)' }];
        });
      }
      setDrawingArrow(null);
    }
  }, [drawingArrow]);

  const handlePromotionSelect = useCallback((piece: string) => {
    if (promotionMove) {
      executeMove(promotionMove.from, promotionMove.to, piece);
    }
  }, [promotionMove, executeMove]);

  // Render squares
  const renderBoard = () => {
    const squares: React.ReactNode[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = coordsToSquare(row, col, flipped);
        const isLight = (row + col) % 2 === 0;
        const boardRow = flipped ? 7 - row : row;
        const boardCol = flipped ? 7 - col : col;
        const piece = board[boardRow]?.[boardCol];

        const isSelected = selected === square;
        const isLastMoveFrom = lastMove?.from === square;
        const isLastMoveTo = lastMove?.to === square;
        const isLegalMove = settings.showLegalMoves && legalMovesForSelected.includes(square);
        const isCheck = inCheck && kingSquare === square;
        const isPremoveFrom = premoveSquares?.from === square;
        const isPremoveTo = premoveSquares?.to === square;
        const rightClickColor = rightClickSquares.get(square);
        const highlightColor = highlightSquares.get(square);
        const isDraggingFrom = dragging?.square === square;
        
        let squareClass = `chess-square ${isLight ? 'light' : 'dark'}`;
        if (isSelected) squareClass += ' selected';
        if (isLastMoveFrom || isLastMoveTo) squareClass += ' last-move';
        if (isCheck) squareClass += ' in-check';
        if (isPremoveFrom || isPremoveTo) squareClass += ' premove';

        squares.push(
          <div
            key={square}
            className={squareClass}
            data-square={square}
            style={{
              backgroundColor: rightClickColor || highlightColor || undefined,
            }}
            onClick={() => handleSquareClick(square)}
            onMouseDown={(e) => {
              if (e.button === 0) handleDragStart(e, square);
              if (e.button === 2) handleContextMenu(e, square);
            }}
            onMouseUp={(e) => {
              if (e.button === 2) handleContextMenuEnd(e, square);
            }}
            onTouchStart={(e) => handleDragStart(e, square)}
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Coordinate labels */}
            {showCoordinates && col === 0 && (
              <span className={`coord coord-rank ${isLight ? 'dark-text' : 'light-text'}`}>
                {flipped ? (row + 1).toString() : (8 - row).toString()}
              </span>
            )}
            {showCoordinates && row === 7 && (
              <span className={`coord coord-file ${isLight ? 'dark-text' : 'light-text'}`}>
                {flipped ? FILES[7 - col] : FILES[col]}
              </span>
            )}

            {/* Legal move indicator */}
            {isLegalMove && !piece && (
              <div className="legal-move-dot" />
            )}
            {isLegalMove && piece && (
              <div className="legal-move-ring" />
            )}

            {/* Piece */}
            {piece && !isDraggingFrom && (() => {
              const PieceComp = getPieceComponent(piece.color, piece.type);
              if (!PieceComp) return null;
              return (
                <div className="piece-container">
                  <PieceComp size={undefined} className="chess-piece" />
                </div>
              );
            })()}
          </div>
        );
      }
    }
    return squares;
  };

  // Render arrows (SVG overlay)
  const renderArrows = () => {
    const allArrows = [...arrows, ...customArrows];
    if (allArrows.length === 0 && !drawingArrow) return null;

    return (
      <svg className="arrows-overlay" viewBox="0 0 800 800" pointerEvents="none">
        <defs>
          <marker id="arrowhead-red" markerWidth="4" markerHeight="4" refX="2.5" refY="2" orient="auto">
            <polygon points="0 0, 4 2, 0 4" fill="rgba(235, 97, 80, 0.8)" />
          </marker>
          <marker id="arrowhead-green" markerWidth="4" markerHeight="4" refX="2.5" refY="2" orient="auto">
            <polygon points="0 0, 4 2, 0 4" fill="rgba(96, 188, 75, 0.8)" />
          </marker>
          <marker id="arrowhead-blue" markerWidth="4" markerHeight="4" refX="2.5" refY="2" orient="auto">
            <polygon points="0 0, 4 2, 0 4" fill="rgba(75, 135, 220, 0.8)" />
          </marker>
          <marker id="arrowhead-yellow" markerWidth="4" markerHeight="4" refX="2.5" refY="2" orient="auto">
            <polygon points="0 0, 4 2, 0 4" fill="rgba(230, 200, 50, 0.8)" />
          </marker>
        </defs>
        {allArrows.map((arrow, i) => {
          const from = squareToCoords(arrow.from, flipped);
          const to = squareToCoords(arrow.to, flipped);
          const x1 = from.col * 100 + 50;
          const y1 = from.row * 100 + 50;
          const x2 = to.col * 100 + 50;
          const y2 = to.row * 100 + 50;
          const markerId = arrow.color.includes('green') ? 'arrowhead-green' :
                          arrow.color.includes('blue') ? 'arrowhead-blue' :
                          arrow.color.includes('yellow') ? 'arrowhead-yellow' :
                          'arrowhead-red';
          return (
            <line
              key={`arrow-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={arrow.color}
              strokeWidth="14"
              strokeLinecap="round"
              markerEnd={`url(#${markerId})`}
              opacity={0.8}
            />
          );
        })}
        {drawingArrow && drawingArrow.from !== drawingArrow.current && (() => {
          const from = squareToCoords(drawingArrow.from, flipped);
          const to = squareToCoords(drawingArrow.current, flipped);
          return (
            <line
              x1={from.col * 100 + 50} y1={from.row * 100 + 50}
              x2={to.col * 100 + 50} y2={to.row * 100 + 50}
              stroke="rgba(235, 97, 80, 0.5)"
              strokeWidth="14"
              strokeLinecap="round"
              markerEnd="url(#arrowhead-red)"
              opacity={0.5}
            />
          );
        })()}
      </svg>
    );
  };

  // Promotion dialog
  const renderPromotionDialog = () => {
    if (!promotionMove) return null;

    const color = game.turn();
    const { col } = squareToCoords(promotionMove.to, flipped);
    const isTop = (color === 'w' && !flipped) || (color === 'b' && flipped);
    const pieces: PieceSymbol[] = ['q', 'r', 'b', 'n'];

    return (
      <div className="promotion-overlay" onClick={() => setPromotionMove(null)}>
        <div
          className={`promotion-dialog ${isTop ? 'top' : 'bottom'}`}
          style={{ left: `${col * 12.5}%` }}
          onClick={(e) => e.stopPropagation()}
        >
          {pieces.map((p) => {
            const PieceComp = getPieceComponent(color, p);
            if (!PieceComp) return null;
            return (
              <div
                key={p}
                className="promotion-option"
                onClick={() => handlePromotionSelect(p)}
              >
                <PieceComp className="chess-piece" />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Dragging piece
  const renderDragPiece = () => {
    if (!dragging) return null;
    const PieceComp = getPieceComponent(dragging.piece.color, dragging.piece.type);
    if (!PieceComp) return null;
    const sqSize = getSquareSize();

    return (
      <div
        className="dragging-piece"
        style={{
          position: 'fixed',
          left: dragPos.x - sqSize / 2,
          top: dragPos.y - sqSize / 2,
          width: sqSize,
          height: sqSize,
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        <PieceComp className="chess-piece" />
      </div>
    );
  };

  return (
    <>
      <div
        ref={boardRef}
        id={boardId}
        className="chessboard-container"
        style={{ width: size || undefined }}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseLeave={() => { if (dragging) setDragging(null); }}
      >
        <div className="chessboard-grid">
          {renderBoard()}
        </div>
        {renderArrows()}
        {renderPromotionDialog()}
      </div>
      {renderDragPiece()}
    </>
  );
};

export default Chessboard;
