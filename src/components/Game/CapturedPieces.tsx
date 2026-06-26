import React, { useMemo } from 'react';
import { Chess, type PieceSymbol, type Color } from 'chess.js';
import { getPieceComponent } from '../../assets/pieces/PieceSVGs';

interface CapturedPiecesProps {
  game: Chess;
  color: Color; // The color of the player this component belongs to (shows pieces they captured)
}

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0
};

const SORT_ORDER: Record<PieceSymbol, number> = {
  p: 1,
  n: 2,
  b: 3,
  r: 4,
  q: 5,
  k: 6
};

const CapturedPieces: React.FC<CapturedPiecesProps> = ({ game, color }) => {
  const { captured, scoreDiff } = useMemo(() => {
    const history = game.history({ verbose: true });
    
    // Count all pieces on board to find captured ones
    // Or just look at history captures
    const capturedPieces: PieceSymbol[] = [];
    
    // Opponent color (the pieces that were captured)
    const opponentColor = color === 'w' ? 'b' : 'w';
    
    history.forEach(move => {
      // If we captured something, and the piece captured belongs to the opponent
      if (move.captured && move.color === color) {
        capturedPieces.push(move.captured as PieceSymbol);
      }
      
      // Handle en passant specifically since it captures a pawn
      if (move.flags.includes('e') && move.color === color) {
        // Just making sure it's not double counted (chess.js usually puts 'p' in move.captured)
        if (!move.captured) {
          capturedPieces.push('p');
        }
      }
    });
    
    // Calculate material difference
    let whiteMaterial = 0;
    let blackMaterial = 0;
    
    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece) {
          if (piece.color === 'w') whiteMaterial += PIECE_VALUES[piece.type];
          if (piece.color === 'b') blackMaterial += PIECE_VALUES[piece.type];
        }
      }
    }
    
    const diff = color === 'w' ? whiteMaterial - blackMaterial : blackMaterial - whiteMaterial;
    
    // Sort captured pieces
    capturedPieces.sort((a, b) => SORT_ORDER[a] - SORT_ORDER[b]);
    
    return { captured: capturedPieces, scoreDiff: diff };
  }, [game.fen(), color]);
  
  if (captured.length === 0 && scoreDiff <= 0) return null;
  
  const opponentColor = color === 'w' ? 'b' : 'w';

  return (
    <div style={{ display: 'flex', alignItems: 'center', minHeight: '20px', gap: '2px', flexWrap: 'wrap' }}>
      {captured.map((p, i) => {
        const PieceComp = getPieceComponent(opponentColor, p);
        if (!PieceComp) return null;
        
        return (
          <div key={`${p}-${i}`} style={{ width: '16px', height: '16px', marginLeft: i > 0 && captured[i-1] === p ? '-8px' : '0' }}>
            <PieceComp style={{ width: '100%', height: '100%' }} />
          </div>
        );
      })}
      
      {scoreDiff > 0 && (
        <span style={{ 
          fontSize: 'var(--fs-xs)', 
          fontWeight: 'var(--fw-semibold)', 
          color: 'var(--text-secondary)',
          marginLeft: '4px' 
        }}>
          +{scoreDiff}
        </span>
      )}
    </div>
  );
};

export default CapturedPieces;
